#!/usr/bin/env zx

import { execSync } from "child_process";

process.env.FORCE_COLOR = 3;

import inquirer from "inquirer";

async function start() {
  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What do you want to do ?",
      choices: [
        {
          name: "build",
          value: async () => {
            execSync("rm -rf dist", { stdio: "inherit" });
            execSync("tsc -p tsconfig.build.json", { stdio: "inherit" });

            console.log("\nDone ✅\n");
          },
        },
        {
          name: "test",
          value: () => {
            execSync("vitest --run src/use-slice.spec.tsx", {
              stdio: "inherit",
            });
            execSync("vitest --run src/test/vitest/mock-slice.spec.ts", {
              stdio: "inherit",
            });
            execSync("jest src/test/jest/mock-slice.spec.ts", {
              stdio: "inherit",
            });

            console.log("\nSuccess ✅\n");
          },
        },
      ],
    },
  ]);

  await action();
}

await start();
