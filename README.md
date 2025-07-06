## Bug: Bun not serving static files from Vite middleware.

This is a **minimum example** that demonstrates how Bun isn't serving static files via the Vite middleware.

### 👉 Info

**What this app is:** A plain SPA vite app served in a Hono server via a middleware.

**The issue:** Bun isn't serving static files during dev.

**Possible cause:** Someone pointed out that it could be caused by this regression: [stream.Readable's `readable` event not firing](https://github.com/oven-sh/bun/issues/19111).

#### What does work currently (FYI):

- Node example, same exact code (with minor adjustments, File API, Bun.serve APIs).
- Bun, but only in NODE_ENV production, after all files are built into dist, which makes sense.
- Bun, in dev & prod, but only if you don't use the custom middleware setup like here. (The plain one you get with `bun create vite`)
- Deno, same exact code (with minor adjustments as well, I removed the example so this repo less confusing, but I have confirmed it works).

### 👉 Steps to reproduce:

> Bun example doesn't work.

1. Clone this repo.
2. `cd bun`
3. `bun install`, `bun dev`
4. Visit http://localhost:3000/vite.svg - ❌ Expect not working

---

> Node example works.

1. `cd node`
2. `bun install`, `bun dev`
3. Visit http://localhost:3000/vite.svg - ✅ Expect working
4. (You can also try `bun preview`) - ✅ Expect working

---

> Bun example works but only in `NODE_ENV` production.

1. `cd bun`
2. `bun preview`
3. Visit http://localhost:3000/vite.svg - ✅ Expect working

---

> Bun example works in dev & prod, but with plain vite.

1. `bun create vite@latest --solid-ts working-example`
2. cd working-example
3. `bun install`, `bun dev`
4. Visit http://localhost:3000/vite.svg - ✅ Expect working

### 👉 Other info.

- This same exact setup worked before in Bun. Hoping it gets fixed 🙏.
- If maybe the `connect-to-web.ts` has something wrong, then it might be worth opening an issue on [magne4000/universal-middleware](https://github.com/magne4000/universal-middleware/issues)
