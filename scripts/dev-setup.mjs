#!/usr/bin/env node
// One-command local bootstrap: Postgres up, roles + migrations applied,
// dependencies installed, dev server started.
//
// Plain Node.js (no bash) so this works the same on Windows (cmd/PowerShell),
// macOS and Linux -- `child_process.execSync` already picks the right shell
// per platform, no WSL / Git Bash required.
import { execSync } from "node:child_process";
import { copyFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(root);

function run(command, options = {}) {
  execSync(command, { stdio: "inherit", ...options });
}

function commandExists(command) {
  try {
    execSync(command, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

if (!commandExists("docker --version")) {
  console.error(
    "Docker is required (used to run local Postgres). Install Docker Desktop / Docker Engine and re-run.",
  );
  process.exit(1);
}

if (!existsSync(join(root, ".env"))) {
  console.log("No .env found, copying .env.example -> .env (local defaults, fine for dev).");
  copyFileSync(join(root, ".env.example"), join(root, ".env"));
}

console.log("Starting Postgres (docker compose)...");
run("docker compose up -d db");

console.log("Waiting for Postgres to be healthy...");
let healthy = false;
for (let i = 0; i < 30; i++) {
  let status = "";
  try {
    status = execSync('docker compose ps db --format "{{.Health}}"').toString().trim();
  } catch {
    status = "";
  }
  if (status === "healthy") {
    healthy = true;
    break;
  }
  execSync(process.platform === "win32" ? "ping -n 2 127.0.0.1 >NUL" : "sleep 1");
}
if (!healthy) {
  console.error("Postgres did not become healthy in time. Check 'docker compose logs db'.");
  process.exit(1);
}

if (!existsSync(join(root, "node_modules"))) {
  console.log("Installing dependencies...");
  run("npm install");
}

console.log("Applying database migrations (schema + Row-Level Security policies)...");
run("npx prisma migrate deploy");

console.log("Generating Prisma Client...");
run("npx prisma generate");

console.log("Seeding demo data (skipped if already present)...");
run("npm run db:seed");

console.log();
console.log("Setup complete. Starting the dev server on http://localhost:3000");
console.log("(Ctrl+C to stop; Postgres keeps running in the background -- 'npm run db:down' to stop it.)");
run("npm run dev");
