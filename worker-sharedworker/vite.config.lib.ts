import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  worker: {
    format: "es",
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL("./src/library.ts", import.meta.url)),
      name: "library",
      fileName: f => `library${f == "umd" ? `.umd` : ""}.js`,
      formats: ["es", "umd"],
    }
  }
})
