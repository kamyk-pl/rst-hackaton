---
name: project-workflow
description: Organizes work within the medbridge project structure where ./app holds application code and ./requirements holds all business content (PRDs, specs, user stories, domain context, decisions). Use when starting a new feature, reading requirements, saving produced artifacts, or navigating the project's two-folder structure.
---

# Project Workflow

## Project Structure

```
./
├── app/           # Application code — all implementation lives here
└── requirements/  # Business content — source of truth for what to build
    ├── provided/  # User-supplied input (briefs, domain docs, raw specs)
    └── produced/  # Claude-produced artifacts (PRDs, ADRs, user stories, breakdowns)
```

## Agentic Process

### Before implementing anything
1. Read relevant files in `./requirements/` to understand context
2. If requirements are ambiguous, ask before proceeding
3. Never invent requirements — surface gaps and ask

### When producing artifacts (PRDs, specs, breakdowns, decisions)
- Save to `./requirements/produced/<artifact-name>.md`
- Use clear filenames: `prd-<feature>.md`, `adr-<decision>.md`, `stories-<feature>.md`

### When implementing
- All code goes in `./app/`
- Reference the relevant requirements file as ground truth
- If implementation reveals a requirements gap, update `./requirements/produced/` first

## Quick Reference

| Task | Location |
|------|----------|
| User-provided brief or domain doc | `./requirements/provided/` |
| PRD / feature spec | `./requirements/produced/` |
| User stories / tickets | `./requirements/produced/` |
| Architecture decisions | `./requirements/produced/` |
| All application code | `./app/` |

## Workflow Checklist

- [ ] Read `./requirements/` before touching `./app/`
- [ ] Save all produced docs to `./requirements/produced/`
- [ ] Keep `./app/` free of specs and docs
- [ ] Ask when requirements are missing rather than guessing
