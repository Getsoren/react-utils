import { resolve } from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, UserConfig as UserConfigVite } from "vite";
import dts from "unplugin-dts/vite";
import { UserConfig as InlineConfigVitest } from "vitest/config";
import pkg from "./package.json" with { type: "json" };

type UserConfig = UserConfigVite & {
  test: InlineConfigVitest["test"];
};

const config: UserConfig = {
  build: {
    lib: {
      entry: resolve(import.meta.dirname, "src/main.ts"),
      fileName: "[name]",
      name: pkg.name,
    },
    rolldownOptions: {
      external: [...Object.keys(pkg.peerDependencies), "react/jsx-runtime", "react/jsx-dev-runtime"],
      output: {
        globals: {
          react: "React",
        },
      },
    },
  },
  plugins: [
    dts({
      exclude: ["**/*.test.ts", "**/*.test.tsx", "src/App.tsx", "src/test.config.ts"],
    }),
    react(),
  ],
  resolve: {
    alias: [
      { find: "@", replacement: resolve(import.meta.dirname, "src") },
      { find: "~", replacement: resolve(import.meta.dirname) },
    ],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "test.config.ts",
  },
};

export default defineConfig(config);
