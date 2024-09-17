import SW from "@/types";
import { cosmiconfig } from "cosmiconfig";
import path from "path";
import fs from "fs/promises";

async function getPackageRootDir(currentDir: string): Promise<string> {
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

async function getPackageDir() {
  const currentDir = __dirname;

  const packageRoot = await getPackageRootDir(currentDir);
  console.log(`Package root directory: ${packageRoot}`);

  return packageRoot;
}

const explorer = cosmiconfig("sw", {
  stopDir: require("os").homedir(),
  searchPlaces: [".swrc", ".swrc.json", ".swrc.js"],
});

/**
 * get custom config
 * @returns {SW.Config}
 */
export async function getCustomConfig(): Promise<SW.Config | null> {
  const result = await explorer.search();

  if (result) {
    return result.config as SW.Config;
  }
  return null;
}

/**
 * get default config
 * @returns {SW.Config}
 */
export async function getDefaultConfig(): Promise<SW.Config> {
  const rootDir = await getPackageDir();
  if (!rootDir) {
    throw new Error("Could not find package root directory");
  }

  const configPath = path.join(rootDir, ".swrc.json");
  const result = await explorer.load(configPath);
  return result.config as SW.Config;
}

/**
 * merge config
 *
 * @param customConfig
 * @param defaultConfig
 * @returns {SW.Config}
 */
export function mergeConfig(
  customConfig: SW.Config | null,
  defaultConfig: SW.Config,
): SW.Config {
  // if customConfig is null, return defaultConfig
  if (!customConfig) {
    return defaultConfig;
  }

  // @ts-ignore
  const mergedConfig: SW.Config = {};

  for (const key in defaultConfig) {
    if (defaultConfig.hasOwnProperty(key)) {
      const defaultValue = defaultConfig[key];
      const customValue = customConfig[key];

      if (key === "plugins") {
        mergedConfig[key] = {
          ...defaultValue,
          ...customValue,
        };
      }

      if (customValue !== undefined) {
        mergedConfig[key] = customValue;
      } else {
        mergedConfig[key] = defaultValue;
      }
    }
  }

  // // enable customConfig to have additional properties
  // for (const key in customConfig) {
  //   if (
  //     customConfig.hasOwnProperty(key) &&
  //     !defaultConfig.hasOwnProperty(key)
  //   ) {
  //     mergedConfig[key] = customConfig[key];
  //   }
  // }

  return mergedConfig;
}
