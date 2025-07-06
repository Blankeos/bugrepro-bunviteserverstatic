// import vikeSolid from "vike-solid/vite";
// import vike from "vike/plugin";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  server: {
    port: 3002,
    hmr: {
      port: 3002,
    },
  },
});
