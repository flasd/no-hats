#!/usr/bin/env node

import chalk from "chalk";
import { resolve } from "path";
import { promises as fs } from "fs";

function boldYellow(text: string) {
  return chalk.bold(chalk.yellow(text));
}

function boldRed(text: string) {
  return chalk.bold(chalk.red(text));
}

async function noHats(packagePaths: string[]) {
  const packages = await Promise.all(
    packagePaths.map(async (packagePath) => {
      const raw = await fs.readFile(resolve(packagePath), "utf-8");
      return JSON.parse(raw);
    })
  );

  const packagesWithHats = packages.filter((pkg) => {
    return (
      Object.values(pkg.dependencies || {}).some((dep: string) =>
        dep.includes("^")
      ) ||
      Object.values(pkg.devDependencies || {}).some((dep: string) =>
        dep.includes("^")
      )
    );
  });

  if (packagesWithHats.length === 0) {
    console.log(chalk.white("No hats found!"));
    process.exit(0);
  }

  console.log(
    chalk.white(
      `Found ${boldYellow(
        packagesWithHats.length.toString()
      )} packages with hats:`
    )
  );

  packagesWithHats.forEach((pkg) => {
    const offendingDeps = Object.entries({
      ...pkg.dependencies,
      ...pkg.devDependencies,
    }).filter(([, version]: [string, string]) => version.includes("^"));

    console.log(
      chalk.white(
        `  ${boldYellow(pkg.name)}
${chalk.white(
  offendingDeps
    .map(([name, version]) => `    "${name}": "${boldRed(version as string)}"`)
    .join("\n")
)}`
      )
    );
  });

  process.exit(1);
}

export function main(args: string[]) {
  const packagePaths = args.slice(2);
  noHats(packagePaths);
}

main(process.argv);
