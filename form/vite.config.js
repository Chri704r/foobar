// vite.config.js
const { resolve } = require("path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
  base: "/kea/14_eksamen/test-5/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
});
