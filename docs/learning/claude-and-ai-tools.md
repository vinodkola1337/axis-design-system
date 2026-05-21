# Claude

**Claude** is the AI model made by Anthropic — the LLM that reasons, generates text, and decides what to do. You can reach it through multiple surfaces:

| Surface | What it is |
|---|---|
| claude.ai | Web and mobile chat interface |
| Anthropic API | Direct HTTP access to the model — you build the wrapper |
| Claude Code | CLI tool for software engineering, built by Anthropic on top of the API |
| Claude desktop app | Native app, same model, richer than the web UI |

**Claude Code** is a developer tool that wraps the Claude model with everything needed for engineering work: file system access, shell execution, a memory system, project context via CLAUDE.md, and a permission/sandbox layer. It is a product, not the model itself.

The mental model for this doc: Claude (the LLM) is the engine. Claude Code is the vehicle built around it.

```
Claude Code = LLM + Retrieval System + Memory Store + Tool Runtime + Permission Gate
```

- **LLM** — reasons, plans, decides tool usage
- **Retrieval** — selectively injects CLAUDE.md, memories, files into the context window
- **Tool Runtime** — executes tool calls: `Read`/`Edit`/`Glob`/`Grep` via Node.js fs, `Bash` via the OS shell (PowerShell on Windows, bash/zsh on Mac)
- **Permission Gate** — intercepts every tool call before execution; checks `settings.json` allowedTools/deniedTools, prompts if unlisted, blocks if denied.

---

## Why Claude Code Over Other AI Coding Agents

| Advantage | What it means |
|---|---|
| Full filesystem access | Reads, writes, and searches any file — the whole repo, or any local path you grant access to |
| Shell execution | Runs real commands: builds, tests, git ops, package installs — sees the actual output |
| Parallel sub-agents | Spawns independent agents for concurrent tasks, each with its own context window — e.g. research + implementation running simultaneously |
| Agentic loops | Run → observe → fix → repeat autonomously. Can run a failing test, read the error, fix the code, and re-run without you intervening |
| Persistent memory | Carries learned context across sessions — not just within one conversation |
| Git-aware | Reads history, creates commits, opens PRs, runs `gh` CLI natively |
| MCP extensibility | Connect to external tools via MCP servers — databases, Slack, Linear, browser automation, etc. |
| Context compaction | Sessions survive beyond the context window via automatic summarization — long tasks don't hit a hard stop |

---

## Full Architecture Flow

```
╔══════════════════════════════════════════════════════════════╗
║  STARTUP                                                     ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  $ claude                                                    ║
║       │                                                      ║
║       ▼                                                      ║
║  settings.json (user → project → local)                      ║
║       │                                                      ║
║       ├── model         → locked in for session              ║
║       ├── env vars      → injected into process              ║
║       ├── hooks         → registered as listeners            ║
║       └── permissions   → loaded into memory                 ║
║                                                              ║
║       ▼                                                      ║
║  CLAUDE.md (global → project → subdir)                       ║
║       │                                                      ║
║       └── system prompt assembled, held in memory            ║
║                                                              ║
║       ▼                                                      ║
║  Session ready. LLM not called yet.                          ║
╚══════════════════════════════════════════════════════════════╝
                    │
                    │  user types a prompt
                    ▼
╔══════════════════════════════════════════════════════════════╗
║  EACH TURN                                                   ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Claude Code assembles API call:                             ║
║  ┌────────────────────────────────────────┐                  ║
║  │ system:   Anthropic instructions       │ ← never changes  ║
║  │           + Claude Code runtime rules  │                  ║
║  │           + tool definitions           │                  ║
║  │           + CLAUDE.md content          │                  ║
║  │                                        │                  ║
║  │ messages: [turn 1 user]                │ ← grows          ║
║  │           [turn 1 assistant]           │   each turn      ║
║  │           [turn 1 tool call]           │                  ║
║  │           [turn 1 tool result]         │                  ║
║  │           [turn 2 user]                │                  ║
║  │           ...                          │                  ║
║  │           [current prompt]  ← newest   │                  ║
║  └────────────────────────────────────────┘                  ║
║       │                                                      ║
║       ▼                                                      ║
║   Anthropic API  →  LLM  →  response                         ║
║                        │                                     ║
║              ┌─────────┴──────────┐                          ║
║              │                    │                          ║
║           text reply          tool call                      ║
║              │                    │                          ║
║              ▼                    ▼                          ║
║         shown to user     runtime intercepts                 ║
║                                   │                          ║
║                           check permissions                  ║
║                                   │                          ║
║                        ┌──────────┴──────────┐               ║
║                      allow                 deny              ║
║                        │                    │                ║
║                    execute             block it              ║
║                        │                    │                ║
║                    result ─────────────── error              ║
║                        │                                     ║
║                 injected into messages[]                      ║
║                        │                                     ║
║                  next API call fires                         ║
╚══════════════════════════════════════════════════════════════╝
                    │
                    │  user types next prompt
                    └── loop back, messages[] grows
```

| Layer | When loaded | Seen by LLM? |
|---|---|---|
| `settings.json` | startup, once | Never |
| `CLAUDE.md` | startup → system prompt | Yes, every call |
| system prompt | every API call | Yes, always first |
| `messages[]` | every API call | Yes, full history |
| tool results | mid-turn, injected | Yes, as user messages |

---

## Sample API Call

What Claude Code sends to the Anthropic API on the first prompt:

```json
{
  "model": "claude-sonnet-4-6",
  "max_tokens": 8096,

  "system": "
    ── Anthropic built-in instructions ───────────────────
    You are Claude, made by Anthropic. Be helpful, honest...
    [safety rules, response formatting]

    ── Claude Code runtime instructions ──────────────────
    You are operating as Claude Code, a CLI coding assistant.
    You have access to tools: Bash, Read, Edit, Glob, Grep...
    [how to use each tool, when to ask permission, etc.]

    ── Tool definitions (JSON schemas) ───────────────────
    { name: 'Bash', description: '...', input_schema: { ... } }
    { name: 'Glob', description: '...', input_schema: { ... } }
    ... (all available tools)

    ── ~/.claude/CLAUDE.md ───────────────────────────────
    # Vinod's Global Context
    Full-stack dev → Front-end Architect + AI skills...

    ── .claude/CLAUDE.md ─────────────────────────────────
    # Axis Design System
    Token-driven, scalable UI system...
  ",

  "messages": [
    { "role": "user", "content": "what files are in the src directory?" }
  ]
}
```

On the second prompt ("which one is the main entry point?"), the same system
prompt is sent but messages[] now contains the full prior turn:

```json
"messages": [
  { "role": "user",      "content": "what files are in the src directory?" },
  { "role": "assistant", "content": [
      { "type": "text",     "text": "I'll check that." },
      { "type": "tool_use", "name": "Glob", "input": { "pattern": "src/**/*" } }
  ]},
  { "role": "user",      "content": [
      { "type": "tool_result", "content": "src/index.ts\nsrc/components/..." }
  ]},
  { "role": "assistant", "content": "Here are the files: src/index.ts..." },

  { "role": "user",      "content": "which one is the main entry point?" }
]
```

The LLM never remembers. Claude Code re-sends the full transcript every call.
Tool calls and their results appear as regular messages — the LLM sees the
whole conversation as one continuous context window.

---

## settings.json

Read at startup. The LLM never sees it — it configures the Claude Code process itself.

Three layers, more specific wins on conflict:

```
~/.claude/settings.json          ← user (all projects)
<repo>/.claude/settings.json     ← project (checked in, shared)
<repo>/.claude/settings.local.json  ← local (gitignored, personal overrides)
```

Key fields:

| Field | What it controls |
|---|---|
| `model` | Which Claude model to use for the session |
| `env` | Key-value pairs injected as environment variables into tool processes |
| `hooks` | Shell commands triggered on runtime events — executed by the harness, not the LLM |
| `permissions` | `allowedTools` / `deniedTools` lists — enforced as execution gates, not just guidance |

**Hooks** fire on events like `PreToolUse`, `PostToolUse`, and `Stop`. Because the harness runs them, they cannot be overridden by CLAUDE.md instructions or conversation context — they always execute.

**Permissions** are the actual enforcement layer. A tool call Claude wants to make gets intercepted here before execution. If it's not in `allowedTools`, the user is prompted or it's blocked outright. This is different from CLAUDE.md, which only guides the LLM's reasoning.

---

## How Claude Code Builds Context

Each request is assembled in this order before it reaches the LLM:

```
System Instructions         ← Anthropic-set safety/behavior rules
Runtime / Tool Instructions ← Execution environment rules
CLAUDE.md hierarchy         ← Your project instructions
Retrieved Memories          ← Relevant past context, selectively loaded
Conversation History        ← Current session
Current User Request
Relevant Files / Tool Outputs
```

The LLM has no permanent memory. Claude Code is the retrieval + injection layer around it.

---

## What is CLAUDE.md

A plain text file that gets injected into the system prompt on every API call. It's how you give the LLM persistent project knowledge — conventions, stack decisions, things it should always know.

**It is soft guidance, not enforcement.** CLAUDE.md instructions guide the LLM's reasoning but can be overridden by higher layers (Anthropic safety rules, runtime rules). They are not execution guards — that's `settings.json`'s job.

**Hierarchy and scope** are covered in the architecture diagram. The short version: global → project → subdir, more specific wins.

**Docs:** https://docs.anthropic.com/en/docs/claude-code/memory

---

## Memory Files

Separate from CLAUDE.md. Stored at `~/.claude/projects/<project>/memory/`.

| | CLAUDE.md | Memory |
|--|-----------|--------|
| Purpose | Instructions, conventions | Learned context about you and the project |
| Written by | You | Claude (automatically during sessions) |
| Examples | "Use Composition API" | "User has PrimeVue DS experience" |

**Memory is not fully loaded every session.** Claude retrieves only what's relevant to the current task. Working on Vue UI files? It may load `Use PrimeVue` but skip unrelated backend memories.
