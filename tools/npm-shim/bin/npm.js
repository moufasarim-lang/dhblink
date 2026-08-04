#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const command = args[0];

function run(program, programArgs) {
  const result = spawnSync(program, programArgs, {
    stdio: "inherit",
    shell: false,
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  process.exit(result.status ?? 1);
}

if (command === "install" || command === "i" || command === "ci") {
  console.log("[dhblink npm shim] dependencies already installed by deno install");
  process.exit(0);
}

if (command === "run" && args[1] === "build") {
  console.log("[dhblink npm shim] running build with deno task build");
  run("deno", ["task", "build"]);
}

console.error(`[dhblink npm shim] unsupported npm command: ${args.join(" ")}`);
process.exit(1);
