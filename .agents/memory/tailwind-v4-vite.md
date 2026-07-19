---
name: Tailwind v4 + Vite setup
description: How to configure Tailwind CSS v4 with Vite in this project
---

## Rule
Use `@tailwindcss/vite` plugin (not PostCSS) and `@theme {}` block in CSS for custom tokens.

**Why:** Tailwind v4 deprecated `tailwind.config.js` and PostCSS-based config for Vite projects. The vite plugin is the recommended path.

**How to apply:**
1. Install `@tailwindcss/vite`
2. Add `tailwindcss()` to `vite.config.ts` plugins array (import from `@tailwindcss/vite`)
3. In CSS: `@import "tailwindcss"` then `@theme { --color-brand: #7c6af7; }` for custom values
4. Delete `tailwind.config.js` and `postcss.config.js` — not needed
5. `@apply`, `@layer`, and custom CSS classes still work in v4
