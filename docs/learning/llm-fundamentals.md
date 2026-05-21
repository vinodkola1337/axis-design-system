# LLM Fundamentals

## The Core Constraint: LLMs Are Stateless

Each API call is independent. The model has no memory of previous requests.
This is architectural, not a limitation — stateless systems are trivially scalable:
distribute requests across thousands of GPU clusters, load balance freely, recover from failures without losing state.

---

## Tokens — The Unit of Everything

A token is the smallest chunk of text an LLM processes. Roughly:

```
1 token ≈ 0.75 English words
"Hello world" → ["Hello", " world"]  (2 tokens)
```

Tokens drive three things: **context size**, **cost**, **speed**. Different models tokenize the same text differently.

---

## How Conversations Work (Simulating State)

The chat app — not the model — stores history. Every new request bundles it all:

```
System Prompt          ← CLAUDE.md + app instructions + tool definitions
+ Conversation History ← all prior turns, re-sent every time
+ Current User Message
──────────────────────
= Context Window       ← total tokens the LLM can see at once
```

The LLM sees a growing snapshot, not a live session. As the conversation grows,
token count grows with it → more compute, higher latency, higher cost.
That's why unrelated topics work better in a new chat.

---

## Infrastructure: How Scale Is Achieved

One model, many replicas. Requests are distributed across servers and GPU clusters,
each loading the same weights (the model's learned numerical parameters).

```
Request 1 → Load Balancer → GPU Cluster A  ┐
Request 2 → Load Balancer → GPU Cluster B  ├── same weights, parallel execution
Request 3 → Load Balancer → GPU Cluster C  ┘
```

Statelessness makes this possible — no cluster needs to know what another processed.

---

## Memory in AI Apps

"Memory" is always external to the model. Common patterns:

| Pattern | How it works |
|---|---|
| Full history | Re-send every message (simple, expensive at scale) |
| Summarization | Compress old turns, inject summary |
| Vector search | Embed past context, retrieve relevant chunks |
| Structured DB | Store facts explicitly, inject on retrieval |

Claude Code uses all of these — CLAUDE.md is manual retrieval, the memory system is vector-adjacent retrieval, compaction is summarization.

---

## Key Insight: Training vs Inference

During your conversation:
- model **weights do not change** — it is not learning from you
- weights are the frozen result of a separate, expensive training process

What you experience as "the model getting smarter" is prompt engineering, better context, or a new model version — not live learning.
