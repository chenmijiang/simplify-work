import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

export const execPromise = promisify(exec);

export const SWorkDir = ".sw";
export const SWorkPluginDir = path.join(SWorkDir, "plugins");

/**
 * get package root directory
 */
export async function getPackageRootDir(currentDir: string): Promise<string> {
  let dir = currentDir;

  while (dir !== path.dirname(dir)) {
    const packageJsonPath = path.join(dir, "package.json");
    try {
      await fs.access(packageJsonPath);
      return dir;
    } catch {
      dir = path.dirname(dir);
    }
  }

  throw new Error("Cannot find package root directory.");
}

/**
 * get package directory
 */
export async function getPackageDir() {
  const currentDir = __dirname;

  const packageRoot = await getPackageRootDir(currentDir);
  return packageRoot;
}

/**
 * get file full name
 */
export function getFileFullName(
  pluginName: string,
  extension: string = "js",
): string {
  return `${pluginName}.${extension}`;
}
