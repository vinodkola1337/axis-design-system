# Claude Code vs Codex

```text
Claude Code focuses on making the agent smarter.

Codex focuses on making the execution environment safer and more controllable.
```

## File Structure Cheat Sheet

| Area               | Claude Code                      | Codex                            | Description                                    |
| ------------------ | -------------------------------- | -------------------------------- | ---------------------------------------------- |
| Instructions       | `CLAUDE.md`                      | `AGENTS.md`                      | Main project instructions loaded automatically |
| Temp Override      | -                                | `AGENTS.override.md`             | Temporary override without editing AGENTS.md   |
| Config Folder      | `.claude/`                       | `.codex/`                        | Main runtime/configuration folder              |
| Skills             | `.claude/skills/<name>/SKILL.md` | `.agents/skills/<name>/SKILL.md` | Reusable workflows/tools/prompts               |
| Sub-Agents         | `.claude/agents/<name>.md`       | `.codex/agents/<name>.toml`      | Specialized autonomous agents                  |
| Hooks              | `.claude/hooks/`                 | Runtime/config hooks             | Lifecycle/event automations                    |
| Settings           | `.claude/settings.json`          | `.codex/config.toml`             | Permissions, runtime behavior, env vars        |
| Sandbox            | Mostly abstracted                | Explicitly configurable          | Controls filesystem/network boundaries         |
| Profiles           | Implicit/runtime-managed         | `.codex/profiles/`               | Execution/runtime presets                      |
| Policies           | Mostly hidden                    | `.codex/policies/`               | Approval and execution policies                |
| Global Config      | `~/.claude/`                     | `~/.codex/`                      | Global settings across all projects            |
| Global Skills      | Inside `~/.claude/`              | `~/.agents/skills/`              | Shared reusable skills                         |
| Architecture Style | Context-first                    | Execution-first                  | Primary architectural emphasis                 |
| UX Philosophy      | Abstracted                       | Explicit/configurable            | Visibility into runtime behavior               |

---

## Tool-Neutral Quick Reference

Use tool-neutral files for durable project knowledge. Use tool-specific files for runtime behavior.

```text
AGENTS.md              # project knowledge and working rules
.codex/config.toml     # Codex runtime behavior
.claude/settings.json  # Claude Code runtime behavior, if used
```

Rule of thumb:

```text
If it teaches the agent about the project, put it in AGENTS.md.
If it controls what the runtime can do, put it in tool-specific config.
If it contains secrets or personal local paths, keep it local and out of git.
```

---

## Tool-Neutral Instructions

`AGENTS.md` should describe the project, not the agent product.

Good content:

* project purpose
* repo structure
* build, test, lint, and dev commands
* architecture rules
* coding conventions
* documentation update rules
* package/versioning rules
* known constraints and deferred decisions

Avoid:

* "Claude should..."
* "Codex should..."
* product-specific command names
* local machine assumptions
* MCP servers, API keys, sandbox rules, or approval settings

Example:

```md
## Workflow

- Read `docs/spec.md` before implementation work.
- Update `docs/architecture.md` when architecture decisions change.
- Run `pnpm run build` before considering package changes complete.
```

---

## Tool-Neutral Skills

Skills are reusable task playbooks. Keep the workflow neutral even if each tool stores it differently.

Good skill content:

* when to use the skill
* required inputs
* step-by-step workflow
* commands to run
* files to inspect
* verification checklist
* expected output format

Neutral source pattern:

```text
skills/
  release-package.md
  add-component.md
  update-design-tokens.md
```

Tool-specific adapters, only when needed:

```text
.agents/skills/add-component/SKILL.md     # Codex-facing adapter
.claude/skills/add-component/SKILL.md     # Claude-facing adapter, if used
```

The durable part is the workflow. The storage location is tool-specific.

---

## Tool-Neutral Sub-Agents

Sub-agents are specialized roles. Define the role and responsibility in neutral terms first.

Good sub-agent definition:

* name
* purpose
* when to invoke
* allowed scope
* files or domains it owns
* expected output
* escalation rules

Example:

```md
# Design Token Reviewer

Purpose: Review token changes for tiering, naming, theme coverage, and component leakage.
Scope: `packages/tokens`, token docs, and generated CSS references.
Output: Findings first, then recommended fixes.
```

Tool-specific wrappers come later:

```text
.codex/agents/design-token-reviewer.toml  # Codex runtime definition
.claude/agents/design-token-reviewer.md   # Claude Code definition, if used
```

Keep the role stable; adapt the wrapper per tool.

---

## When Tool-Specific Config Matters

Use tool-specific config for execution behavior, not general project knowledge.

Tool-specific config includes:

* MCP servers
* sandbox mode
* filesystem writable roots
* network access
* approval policy
* model/profile selection
* environment variables
* hooks and lifecycle automation
* local secrets and credentials
* tool permissions

Examples:

```text
AGENTS.md          # shared project instructions
.codex/config.toml # Codex permissions, MCP, sandbox, profiles
```

MCP is tool-specific because it wires external tools into a runtime. The project may document that it uses Figma, GitHub, Playwright, or a database, but the actual MCP server command, credentials, and approval rules belong in Codex/Claude/local config.

---

## Mental Distinction

| Claude Code                    | Codex                                         |
| ------------------------------ | --------------------------------------------- |
| "Teach the agent how to think" | "Define how the agent is allowed to execute"  |
| Focuses on context engineering | Focuses on execution engineering              |
| More autonomous feeling        | More infrastructure-controlled feeling        |
| Hidden runtime complexity      | Visible runtime boundaries                    |
| AI Software Engineer           | AI Terminal Operator                          |

---

## Shared Architecture

Both follow roughly:

```text
User
 |
Runtime / Orchestrator
 |
LLM
 |
Tool Calls
 |
Shell / Filesystem
```

Both have:

* System instructions
* Runtime mediation
* Tool execution layer
* Permission system
* Context management
* Isolation/sandboxing

The LLM never directly executes commands.
It proposes actions -> runtime validates -> environment executes.

---

## Soft vs Hard Rules

### System Instructions

Examples:

* "Do not delete files"
* "Stay inside repo"

These are:

* soft rules
* behavioral guidance to the LLM
* not guaranteed enforcement

---

### Runtime Policies

Runtime:

* intercepts tool calls
* validates commands
* asks approvals
* applies policies

This is actual execution control.

---

### Sandbox

Sandbox = hard boundary.

Examples:

* filesystem restriction
* network restriction
* process restriction

OS/container/runtime enforces this physically.

Even if model hallucinates:

```bash
rm -rf ~/
```

sandbox can block it.

---

## Claude Code Philosophy

Mental model:

```text
Context-first agent
```

Focus:

* context engineering
* repo understanding
* long reasoning loops
* autonomous coding flow
* abstracted UX

Feels like:

```text
AI Software Engineer
```

Claude hides much of:

* sandbox behavior
* runtime policies
* execution boundaries

You mostly interact naturally.

---

## Codex Philosophy

Mental model:

```text
Execution-first agent
```

Focus:

* sandbox visibility
* explicit boundaries
* deterministic execution
* infrastructure control

Feels like:

```text
AI Terminal Operator
```

Codex exposes:

* sandbox modes
* approval modes
* filesystem access
* network access

You explicitly configure environment behavior.

---

## Biggest Architectural Difference

NOT:

```text
Claude = context
Codex = execution
```

More accurately:

```text
Claude emphasizes context engineering.

Codex emphasizes execution engineering.
```

Both can do both.

Difference is architectural emphasis and visibility.
