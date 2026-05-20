# Claude & AI Tools

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

## CLAUDE.md Hierarchy

Loaded automatically. More specific scope wins on conflict.

| Scope | Path | Notes |
|-------|------|-------|
| Global | `~/.claude/CLAUDE.md` | Every session, every project |
| Project | `<repo>/CLAUDE.md` | That repo only |
| Subdirectory | `<repo>/packages/ui/CLAUDE.md` | Loaded dynamically when working in that folder — saves tokens in monorepos |

---

## Two Types of Precedence

**Vertical — system hierarchy (top overrides bottom)**

```
System Instructions > Runtime Rules > CLAUDE.md > Conversation
```

A repo CLAUDE.md cannot override Anthropic safety rules.

**Horizontal — within CLAUDE.md (specific overrides broad)**

```
Subdirectory > Project > Global
```

If global says `Use npm` and project says `Use pnpm` — inside that repo, pnpm wins.

---

## CLAUDE.md vs Runtime Enforcement

| | CLAUDE.md | Runtime / Sandbox |
|--|-----------|-------------------|
| What it is | Soft behavioral instructions for the LLM | Actual execution restrictions |
| Example | `Avoid inline styles` | Blocked shell commands, read-only filesystem, permission prompts |
| Enforced? | No — guides reasoning, not guaranteed | Yes — enforced by the container |

**Key point:** CLAUDE.md instructions can be ignored by the model if they conflict with higher layers. They are not guards.

---

## Memory Files

Separate from CLAUDE.md. Stored at `~/.claude/projects/<project>/memory/`.

| | CLAUDE.md | Memory |
|--|-----------|--------|
| Purpose | Instructions, conventions | Learned context about you and the project |
| Written by | You | Claude (automatically during sessions) |
| Examples | "Use Composition API" | "User has PrimeVue DS experience" |

**Memory is not fully loaded every session.** Claude retrieves only what's relevant to the current task. Working on Vue UI files? It may load `Use PrimeVue` but skip unrelated backend memories.

---

## Mental Model

```
Claude Code = LLM + Retrieval System + Memory Store + Tool Runtime + Sandbox
```

- **LLM** — reasons, plans, decides tool usage
- **Retrieval** — selectively injects CLAUDE.md, memories, files into the context window
- **Runtime** — executes commands, enforces permissions, manages sandbox

**Docs:** https://docs.anthropic.com/en/docs/claude-code/memory
