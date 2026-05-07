#!/usr/bin/env python3
"""
AI agent that reads a GitHub issue and implements the required changes.
Commits to the current branch; the workflow then opens a PR.
"""

import json
import os
import subprocess
import sys
from pathlib import Path

from openai import OpenAI

REPO_ROOT = Path(os.environ.get("GITHUB_WORKSPACE", ".")).resolve()
MAX_ITERATIONS = 20

SYSTEM_PROMPT = """You are an expert software engineer implementing a GitHub issue.

You will receive:
1. The issue title, body, and labels
2. A directory listing of the repository root

Your job:
- Read the relevant source files to understand the codebase
- Implement exactly what the issue describes — no more, no less
- Write clean, idiomatic code consistent with the existing style
- If the issue is unclear or impossible to implement safely, call done() with an explanation

Work methodically:
1. Explore the repo structure (list_directory, read_file)
2. Understand the existing code
3. Make the changes (write_file)
4. Call done() with a summary of what you did

Do NOT:
- Add unrelated features or refactors
- Change tests unless the issue explicitly asks for it
- Modify files unrelated to the issue
"""

tools = [
    {
        "type": "function",
        "function": {
            "name": "list_directory",
            "description": "List files and directories at a given path.",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "Path relative to repo root. Use '.' for root.",
                    }
                },
                "required": ["path"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "read_file",
            "description": "Read the full content of a file.",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "Path relative to repo root"}
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
                    "path": {"type": "string"},
                    "content": {"type": "string"},
                },
                "required": ["path", "content"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "done",
            "description": "Signal completion. Call when all changes are applied or if nothing can be done.",
            "parameters": {
                "type": "object",
                "properties": {
                    "summary": {
                        "type": "string",
                        "description": "What was implemented, or why nothing was done.",
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
        raise RuntimeError(f"Command failed ({' '.join(cmd)}): {result.stderr}")
    return result.stdout.strip()


def list_directory(path: str) -> str:
    target = REPO_ROOT / path
    if not target.exists():
        return f"ERROR: path not found: {path}"
    if not target.is_dir():
        return f"ERROR: not a directory: {path}"
    entries = sorted(target.iterdir(), key=lambda p: (p.is_file(), p.name))
    lines = []
    for e in entries:
        if e.name.startswith(".") and e.name not in (".github",):
            continue
        suffix = "/" if e.is_dir() else ""
        lines.append(f"{e.name}{suffix}")
    return "\n".join(lines) if lines else "(empty)"


def read_file(path: str) -> str:
    target = REPO_ROOT / path
    if not target.exists():
        return f"ERROR: file not found: {path}"
    try:
        content = target.read_text()
        if len(content) > 30_000:
            return content[:30_000] + f"\n\n[...truncated, {len(content)} total bytes]"
        return content
    except Exception as e:
        return f"ERROR reading {path}: {e}"


def write_file(path: str, content: str) -> str:
    target = REPO_ROOT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content)
    return f"Written: {path} ({len(content)} bytes)"


def dispatch(name: str, args: dict) -> tuple[str, bool]:
    """Returns (result_text, is_done)."""
    if name == "list_directory":
        return list_directory(args["path"]), False
    if name == "read_file":
        return read_file(args["path"]), False
    if name == "write_file":
        return write_file(args["path"], args["content"]), False
    if name == "done":
        return args["summary"], True
    return f"Unknown tool: {name}", False


def commit_changes(summary: str) -> None:
    status = run(["git", "status", "--porcelain"])
    if not status:
        print("No changes to commit.")
        return
    run(["git", "config", "user.name", "ai-agent[bot]"])
    run(["git", "config", "user.email", "ai-agent@users.noreply.github.com"])
    run(["git", "add", "-A"])
    issue_num = os.environ.get("ISSUE_NUMBER", "?")
    run(["git", "commit", "-m", f"fix(ai-agent): implement #{issue_num} — {summary[:72]}"])
    print(f"Committed: {summary[:72]}")


def main() -> None:
    issue_number = os.environ.get("ISSUE_NUMBER", "?")
    issue_title = os.environ.get("ISSUE_TITLE", "")
    issue_body = os.environ.get("ISSUE_BODY", "(no description)")
    issue_labels = os.environ.get("ISSUE_LABELS", "")

    client = OpenAI(
        api_key=os.environ["LITELLM_API_KEY"],
        base_url=os.environ["LITELLM_BASE_URL"],
    )
    model = os.environ.get("LITELLM_MODEL", "gpt-4o")

    root_listing = list_directory(".")

    user_content = f"""## Issue #{issue_number}: {issue_title}

**Labels:** {issue_labels or "none"}

**Description:**
{issue_body}

---

## Repository root structure:
{root_listing}

Please implement this issue.
"""

    messages: list[dict] = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_content},
    ]

    summary = "No changes made."

    for i in range(MAX_ITERATIONS):
        print(f"\n--- iteration {i + 1} ---")
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            tools=tools,
            tool_choice="auto",
        )
        msg = response.choices[0].message
        messages.append(msg.model_dump(exclude_none=True))

        if not msg.tool_calls:
            print("Model stopped without calling done().")
            break

        finished = False
        for tc in msg.tool_calls:
            name = tc.function.name
            args = json.loads(tc.function.arguments)
            print(f"  [{name}] {list(args.keys())}")
            result, is_done = dispatch(name, args)
            if is_done:
                summary = result
                finished = True
            else:
                print(f"    → {str(result)[:100]}")
            messages.append({
                "role": "tool",
                "tool_call_id": tc.id,
                "content": result,
            })

        if finished:
            break
    else:
        print("Reached max iterations.")

    commit_changes(summary)
    print(f"\nDone: {summary}")


if __name__ == "__main__":
    main()
