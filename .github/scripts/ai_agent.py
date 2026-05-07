#!/usr/bin/env python3
"""
AI agent that reviews a PR diff and commits fixes via LiteLLM (OpenAI-compatible API).
"""

import json
import os
import subprocess
import sys
from pathlib import Path

from openai import OpenAI

REPO_ROOT = Path(os.environ.get("GITHUB_WORKSPACE", ".")).resolve()
MAX_ITERATIONS = 10

SYSTEM_PROMPT = """You are an expert software engineer performing an automated code review and fix pass on a pull request.

You will be given:
1. The PR title and description
2. The unified diff of all changed files

Your job:
- Identify real bugs, type errors, security issues, or broken logic in the changed code
- Fix them by reading the relevant files and writing corrected versions
- Do NOT change style, formatting, or make refactors beyond what is needed to fix the issues
- If the code looks correct, call done() immediately

You have tools to read files, write files, and signal completion.
Work methodically: read a file before writing it.
"""

tools = [
    {
        "type": "function",
        "function": {
            "name": "read_file",
            "description": "Read the full content of a file in the repository.",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "Path relative to repo root, e.g. src/app/page.tsx",
                    }
                },
                "required": ["path"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "write_file",
            "description": "Write content to a file, creating it if needed.",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "Path relative to repo root",
                    },
                    "content": {
                        "type": "string",
                        "description": "Full file content to write",
                    },
                },
                "required": ["path", "content"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "done",
            "description": "Signal that you have finished. Call this when there is nothing to fix or all fixes are applied.",
            "parameters": {
                "type": "object",
                "properties": {
                    "summary": {
                        "type": "string",
                        "description": "Short summary of what was fixed, or 'No issues found' if nothing needed fixing.",
                    }
                },
                "required": ["summary"],
            },
        },
    },
]


def run(cmd: list[str], check=True) -> str:
    result = subprocess.run(cmd, capture_output=True, text=True, cwd=REPO_ROOT)
    if check and result.returncode != 0:
        print(f"[cmd] {' '.join(cmd)}\n{result.stderr}", file=sys.stderr)
        raise RuntimeError(f"Command failed: {' '.join(cmd)}")
    return result.stdout.strip()


def get_diff() -> str:
    base = os.environ.get("BASE_SHA", "HEAD~1")
    head = os.environ.get("HEAD_SHA", "HEAD")
    return run(["git", "diff", base, head])


def read_file(path: str) -> str:
    target = REPO_ROOT / path
    if not target.exists():
        return f"ERROR: file not found: {path}"
    try:
        return target.read_text()
    except Exception as e:
        return f"ERROR reading {path}: {e}"


def write_file(path: str, content: str) -> str:
    target = REPO_ROOT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content)
    return f"Written {path} ({len(content)} bytes)"


def dispatch_tool(name: str, args: dict) -> str:
    if name == "read_file":
        return read_file(args["path"])
    if name == "write_file":
        return write_file(args["path"], args["content"])
    if name == "done":
        return f"DONE:{args['summary']}"
    return f"Unknown tool: {name}"


def commit_changes(summary: str) -> None:
    status = run(["git", "status", "--porcelain"])
    if not status:
        print("No files changed — nothing to commit.")
        return

    run(["git", "config", "user.name", "ai-agent[bot]"])
    run(["git", "config", "user.email", "ai-agent@users.noreply.github.com"])
    run(["git", "add", "-A"])
    run(["git", "commit", "-m", f"fix(ai-agent): {summary}"])

    branch = run(["git", "rev-parse", "--abbrev-ref", "HEAD"])
    run(["git", "push", "origin", branch])
    print(f"Pushed fixes to {branch}.")


def main() -> None:
    pr_title = os.environ.get("PR_TITLE", "")
    pr_body = os.environ.get("PR_BODY", "")
    diff = get_diff()

    if not diff.strip():
        print("Empty diff — nothing to review.")
        return

    client = OpenAI(
        api_key=os.environ["LITELLM_API_KEY"],
        base_url=os.environ["LITELLM_BASE_URL"],
    )
    model = os.environ.get("LITELLM_MODEL", "gpt-4o")

    user_content = f"""## PR: {pr_title}

{pr_body or '(no description)'}

## Diff

```diff
{diff[:40000]}
```
"""

    messages: list[dict] = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_content},
    ]

    final_summary = "No issues found"

    for iteration in range(MAX_ITERATIONS):
        print(f"\n--- iteration {iteration + 1} ---")
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            tools=tools,
            tool_choice="auto",
        )

        msg = response.choices[0].message
        messages.append(msg.model_dump(exclude_none=True))

        if not msg.tool_calls:
            print("Model stopped without calling done() — treating as finished.")
            break

        all_done = False
        for tc in msg.tool_calls:
            name = tc.function.name
            args = json.loads(tc.function.arguments)
            print(f"[tool] {name}({list(args.keys())})")
            result = dispatch_tool(name, args)

            if result.startswith("DONE:"):
                final_summary = result[5:]
                all_done = True
            else:
                print(f"  → {result[:120]}")

            messages.append(
                {
                    "role": "tool",
                    "tool_call_id": tc.id,
                    "content": result,
                }
            )

        if all_done:
            break
    else:
        print("Reached max iterations.")

    commit_changes(final_summary)


if __name__ == "__main__":
    main()
