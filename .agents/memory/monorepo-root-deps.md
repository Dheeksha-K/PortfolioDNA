---
name: Monorepo from root node_modules
description: All npm packages install to root; subdirectory package.json scripts don't work
---

## Rule
`installLanguagePackages` always installs to the root `package.json` and `node_modules/`. Never use `npm --prefix subdir run ...` in scripts.

**Why:** The Replit package management callback has no concept of workspaces; it writes to the repo root.

**How to apply:**
- Root `package.json` scripts should call binaries directly: `tsx server/src/index.ts`, `vite --config client/vite.config.ts`
- npm adds `node_modules/.bin` to PATH when running scripts, so binaries resolve correctly
- Subdirectory `package.json` files can exist for reference/types but their `node_modules` won't be populated
