#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const patchScript = path.join(rootDir, "scripts", "openclaw-after-tool-call-messages.patch.sh");
const verbose = process.env.DEBUG === "1" || process.env.OPENCLAW_PATCH_VERBOSE === "1";

if (!existsSync(patchScript)) {
  if (verbose) console.warn("[postinstall] OpenClaw patch script not found, skipping.");
  process.exit(0);
}

const bashProbe = spawnSync("bash", ["--version"], { stdio: "ignore" });
if (bashProbe.error) {
  if (verbose) console.warn("[postinstall] bash is not available, skipping optional OpenClaw patch.");
  process.exit(0);
}

const result = spawnSync("bash", [patchScript], {
  cwd: rootDir,
  encoding: "utf8",
  stdio: "pipe",
  shell: false,
});

if (result.error) {
  if (verbose) {
    console.warn(`[postinstall] Optional OpenClaw patch failed to start: ${result.error.message}`);
  }
  process.exit(0);
}

if (result.status !== 0) {
  if (verbose) {
    console.warn("[postinstall] Optional OpenClaw patch was not applied; continuing install.");
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
  }
}

process.exit(0);
