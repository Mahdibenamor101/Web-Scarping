import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    testTimeout: 15000,
    // Vitest's default excludes don't cover .claude/ -- without this, a
    // concurrent agent's isolated git worktree under .claude/worktrees/
    // (this repo's own convention, not something vitest knows about) gets
    // picked up and every test runs twice, once per copy.
    exclude: ["**/node_modules/**", "**/.claude/**"],
  },
});
