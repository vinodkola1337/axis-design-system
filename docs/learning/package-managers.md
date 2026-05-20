# Package Managers & Bootstrap

A stack where each tool manages the layer below it.

**The pinning stack** — each layer pins the one below it:

| Layer | Manages | Pinned by |
|-------|---------|-----------|
| `winget` | Apps on Windows | Manifest in `winget-pkgs` repo |
| `nvm` / `fnm` | Node versions | `.nvmrc` / `.node-version` |
| `corepack` | pnpm/yarn version | `"packageManager"` in `package.json` |
| client | Your dependencies | Client-specific lockfile |

Fresh clone + `corepack enable` + `pnpm install` reproduces the exact toolchain. No global state.

**Where dependencies physically live:**

| Client | Storage | What's in git |
|--------|---------|---------------|
| npm / Yarn Classic | `node_modules/` (real files) | nothing |
| pnpm | Global store + symlinks | nothing |
| Yarn Berry standard | `.yarn/cache/*.zip` | nothing |
| Yarn Berry zero-install | `.yarn/cache/*.zip` | **all zips + `.pnp.cjs`** |

Same protocol, same registry — different ideas about where the bytes sit on disk.

---

## winget — Windows Package Manager

Microsoft's official CLI installer. Built into Windows 11. The Windows analog of `apt` (Debian) or `brew` (macOS).

**Manifest model — Microsoft hosts metadata, not binaries.**

```
winget install OpenJS.NodeJS.LTS
  ↓
1. Fetch manifest from github.com/microsoft/winget-pkgs   ← YAML: URL + SHA256
2. Download MSI from nodejs.org                            ← vendor's CDN
3. Verify SHA256 matches manifest                          ← abort on mismatch
4. Run installer silently                                  ← /quiet /norestart
```

Same MSI you'd download manually — just scripted and hash-verified. Use the default `winget` source for dev tooling; the `msstore` source has sandboxing quirks with global packages.

---

## Node + npm — The Bundle

The Node MSI installs three things: the **node** runtime, **npm** (default package manager), and **corepack** (covered later). One install, three tools.

**npm's disk model:** a real copy of every dependency in `node_modules/`, per project.

```bash
npm install lodash
# Creates ./node_modules/lodash/ — full copy, per project.
```

Universally supported. Fine for single-project use. Gets painful at monorepo scale because every workspace gets a full copy of every dependency.

---

## The Shared Registry

`npm`, `pnpm`, and both yarns are **independent implementations of the same protocol**. All fetch from the same registry:

```
        registry.npmjs.org
              ↑      ↑      ↑      ↑
            npm    pnpm   yarn   berry
```

Like email clients of SMTP/IMAP — your `package.json` and the registry don't care which client you used. You can point any of them at private registries (Verdaccio, GitHub Packages, JFrog).

The four clients differ in **how they lay out dependencies on disk**, not in what they can fetch.

---

## Yarn Classic (v1)

Same disk model as npm. Different lockfile (`yarn.lock`), different CLI verbs (`yarn add` vs `npm install`). Frozen in maintenance since Berry's release.

In 2026 there's no architectural reason to start a new project on Classic — it exists only for legacy migrations.

---

## Yarn Berry (v2+) — The Conceptual Break

Total rewrite of yarn. **No `node_modules` at all.** Dependencies stored as zip files, loaded through a runtime hook.

### Layout

```
your-project/
├── .yarn/cache/
│   ├── lodash-npm-4.17.21-abc123.zip    ← one zip per dep version
│   └── vue-npm-3.5.0-def456.zip
├── .pnp.cjs                              ← the lookup table
├── package.json
└── yarn.lock
```

`.yarn/cache/*.zip` = each dep as a single zip, never extracted. `.pnp.cjs` = generated JS file mapping `package@version` → zip location.

### How it runs your code

```
node app.js
   ↓ yarn injects --require ./.pnp.cjs
   ↓ require('lodash')
   ↓ patched resolver: lookup → "lodash-...zip, internal path index.js"
   ↓ patched fs:       reads bytes DIRECTLY from inside the zip (virtual fs)
   ↓ module loads
```

**The zips are never unzipped.** Berry mounts them as a virtual filesystem at runtime. Skip writing 200k unzipped files just to read 50 of them.

### Two distribution modes

| Mode | `.yarn/cache/*.zip` | Fresh clone |
|------|---------------------|-------------|
| Standard | Gitignored, fetched on install | Needs network |
| Zero-install | **Committed to git** | Works offline, instant — no install step |

Zero-install trades repo size (50–500 MB of zips in `.git/`) for bit-for-bit reproducibility. Usually paired with Git LFS.

### Compatibility — the real catch

Berry fetches the same packages from the same registry. But PnP bypasses `node_modules`, so any tool that assumes `node_modules` exists can break.

| Category | Why it breaks | Workaround |
|----------|---------------|------------|
| Phantom dependencies | Lib imports something it didn't declare; npm hoisting hid this for years | `packageExtensions` in `.yarnrc.yml` |
| `node_modules` path-walking | Hardcoded `./node_modules/X/...` paths | Upstream fix, or `nodeLinker: node-modules` |
| Subprocess tools | Spawn `node` without the `--require .pnp.cjs` hook | Use the `yarn node` wrapper |
| Older bundlers / linters | Custom resolution that bypasses Node | Updated versions support PnP; older ones don't |

**Escape hatch — `nodeLinker`.** Berry can turn PnP off:

```yaml
# .yarnrc.yml
nodeLinker: node-modules    # or 'pnp' (default), or 'pnpm' (symlink mode)
```

Compatibility problems vanish — so does most of Berry's architectural advantage. If you'd need this fallback, pnpm is simpler.

---

## pnpm — Performant npm

Independent client. Disk model: one global content-addressable store, symlinks per project.

### Two-layer storage

```
~/.pnpm-store/v3/files/          ← GLOBAL store — one real copy per file, ever (hard links)

project/node_modules/
  .pnpm/                         ← virtual store — hard links into global store
    react@18.2.0/
      node_modules/react/  ──────→ hard link to ~/.pnpm-store/...
  react/                         ← symlink → .pnpm/react@18.2.0/node_modules/react
```

- **Hard link** — two directory entries pointing to the same bytes on disk. File can "move" and the link still works. pnpm uses these between global store ↔ `.pnpm`.
- **Symlink** — a pointer to a path. Breaks if the target moves. pnpm uses these for the `node_modules/<package>` surface your code actually imports from.

Disk savings are **cross-repo**, not just within a monorepo — the global store is shared machine-wide. A second project using the same React version costs zero extra disk space.

**Workspaces — the real architectural win.** A **monorepo** is one git repo holding multiple related packages. Axis DS is a monorepo: `packages/tokens` (design tokens), `packages/ui` (Vue components), and `packages/docs` (Storybook) all live in this repo, share one `pnpm-lock.yaml`, and reference each other by workspace name. pnpm gives this first-class support:

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
```

```bash
pnpm install                              # all workspaces
pnpm --filter @axis/tokens build          # one workspace
pnpm --filter @axis/ui add @axis/tokens   # internal dep, wired via symlink
```

When `@axis/ui` depends on `@axis/tokens` and both live in this repo, pnpm wires them with a symlink — no publish step.

**Dev workflow implication:** Storybook importing `@vinodkola/axis-ui` follows the symlink straight to the live source in `packages/axis-ui/`. Edit a component → Storybook hot-reloads. Build + publish is only needed when shipping to npm for external consumers.

---

## corepack — Manager of Managers

**Not a package manager.** A shim that ships with Node, which downloads and pins the correct version of pnpm or yarn per project.

**The problem it solves — version drift.**

```
Without corepack:
  npm i -g pnpm        ← one pnpm version system-wide → drifts across projects/machines

With corepack:
  package.json: "packageManager": "pnpm@9.12.0"
  ↳ pnpm install → corepack intercepts → fetches that exact version on demand
  ↳ cd ../other-project → uses ITS pinned version automatically
```

**Setup (once per machine):**

```bash
corepack enable                            # turn on the shim
corepack prepare pnpm@latest --activate    # set latest as default
```

After this, `"packageManager"` in `package.json` is authoritative. You never `npm i -g pnpm` again.

---

## When to Use Which

Pick by what the project actually needs.

**Quick shortcut:**

```
single project, conventional?           → npm
monorepo, conventional, fast?           → pnpm
monorepo, strict, willing to invest?    → Yarn Berry
old project on yarn classic?            → leave it
```

---
