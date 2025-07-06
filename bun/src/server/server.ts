import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { type ViteDevServer } from "vite";
import { connectToWeb } from "./connect-to-web";

const app = new Hono();

app.get("/up", async (c) => {
  return c.text("UP");
});

// Vite SPA Integration
if (process.env.NODE_ENV === "production") {
  console.log("In production");
  // In prod, serve static files.
  app.use(
    "/*",
    serveStatic({
      root: `./dist/`,
    }),
  );

  // SPA fallback - serve index.html for all non-API routes
  app.get("*", async (c) => {
    return c.html(await Bun.file("./dist/index.html").text());
  });
}
// In development, attach the vite middleware.
else {
  console.log("In development");
  let vite: ViteDevServer;
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base: "/",
  });

  app.use(async (c, next) => {
    const handler = connectToWeb(vite.middlewares);

    const response = await handler(c.req.raw);

    if (response) {
      return response;
    }
    // If not handled by Vike, continue to next middleware
    await next();
  });

  // SPA fallback for dev - let Vite handle the index.html transformation
  app.get("*", async (c) => {
    const url = c.req.url;
    try {
      // Transform and serve index.html
      const template = await Bun.file("./index.html").text();
      const html = await vite.transformIndexHtml(url, template);
      return c.html(html);
    } catch (error) {
      console.error("Error serving index.html:", error);
      return c.text("Internal Server Error", 500);
    }
  });
}

const server = Bun.serve({
  fetch: app.fetch,
  port: 3000,
});
