# Vercel & Serverless

## What is Vercel?
A **managed hosting platform** targeted at frontend (static files) and SSR (server-side rendered) applications. You give it your code, provide minimal config, and it handles all infrastructure — SSL, CDN, scaling, deployment pipelines.

It is **not** a deployment tool that pushes to your existing servers. It **is** the hosting destination itself.

---

## What You Configure
- Git repo + branch to watch
- Build command (`npm run build`)
- Framework (often auto-detected)
- Environment variables

Everything else — regions, load balancers, scaling, SSL — is handled by Vercel automatically.

---

## Deployment Mental Picture

**Traditional (e.g. Azure App Service):**
```
Write code → Build → Push to Azure → Azure hosts it → Users visit
```
You own and manage every step.

**Vercel:**
```
Write code → Git push → [Vercel handles everything] → Users visit
```
Vercel watches your repo, builds on every push, and publishes automatically.

---

## JAMstack
**JAM = JavaScript + APIs + Markup**

An architecture pattern where:
- The site is **pre-built into static files** at build time (not per request)
- No traditional server — files are served from a CDN
- Dynamic behavior is handled by calling **third-party APIs** from the browser

Best for: marketing sites, blogs, documentation — content that doesn't change per user.

```
Traditional:  Request → Server runs code → Builds HTML → Sends to user  (every request)
JAMstack:     Build once → HTML pre-generated → CDN → Sent to user       (server work done once)
```

---

## SSR on Vercel (e.g. Next.js)
Vercel can host **full Next.js apps** — not just static files:
- Static assets → served from CDN
- Server-rendered pages → run via serverless functions
- API routes → also run as serverless functions

You don't provision any server. Vercel inspects your code and routes accordingly.

---

## Serverless Functions
A serverless function is **not an always-on server**. It is compute allocated on demand:

```
Request arrives
  → Vercel spins up a temporary container (like a pod)
  → Runs your function
  → Returns response
  → Tears it down
```

- No idle cost — you only pay when it runs
- Scales automatically with traffic
- **Cold starts** — first request after idle can be slightly slow

### Stateless by Nature
Each invocation starts completely fresh. No memory is shared between requests.

```javascript
// BREAKS in serverless — counter always resets to 1
let counter = 0;
export function handler() {
    counter++;
    return counter;
}
```

### Where State Lives Instead
| Need | Solution |
|---|---|
| User data | Database (Postgres, MongoDB) |
| Sessions | Redis or JWT tokens |
| File uploads | Blob storage (S3, Azure Blob) |
| Cache | Redis, CDN |

---

## Can Vercel Host Backend APIs?

Yes — **if your backend is serverless-style**. The distinction is not frontend vs backend, it's about the nature of the backend:

| Backend Type | Vercel? |
|---|---|
| Next.js API routes / Edge functions | Yes |
| Stateless request/response handlers | Yes |
| Express / .NET / Java long-running server | No |
| WebSocket / persistent connections | No |
| Operations exceeding 60 seconds | No |

**The real deciding factor:**
> "Is my backend logic short-lived and stateless?"
> - Yes → Vercel can host it
> - No → You need a dedicated server

Vercel only runs **Node.js and Edge runtimes** — it cannot host .NET, Java, or Go long-running services.

---

## Vercel vs Azure — When to Choose What

For a **full stack app** already on Azure (backend APIs, DB, auth):
- Splitting frontend to Vercel adds complexity: two platforms, two bills, cross-cloud latency
- **Azure Static Web Apps** gives the same zero-config frontend deployment within Azure
- Staying fully on Azure is simpler and more defensible

Vercel makes sense when:
- Pure frontend / JAMstack with no real backend
- No existing cloud investment
- Next.js app with no Azure dependency
- Small team needing zero DevOps overhead

---

## Serverless vs Dedicated Server

| Scenario | Recommendation |
|---|---|
| Spiky / unpredictable traffic | Serverless |
| Simple, short-lived, event-driven tasks | Serverless |
| Always-on, high-volume, heavy load | Dedicated server |
| Long-running processes | Dedicated server (serverless has time limits ~10-60s) |
| WebSockets / real-time connections | Dedicated server (needs persistent connection) |
| Heavy compute (ML, video processing) | Dedicated server |

### Economics at Scale
```
Serverless = pay per invocation
Dedicated  = flat monthly rate

At very high request volume → serverless bill can exceed a dedicated server
```

Logging works fine in serverless (stream to Datadog, CloudWatch, etc.) — the real concerns at scale are **latency from cold starts** and **cost per invocation**.

### Simple Decision Rule
- Traffic spiky or unpredictable? → **Serverless**
- Always-on, heavy, high-frequency? → **Dedicated server**
- Long-running or stateful? → **Dedicated server**
- Lightweight, event-driven? → **Serverless**
