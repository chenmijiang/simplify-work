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
 * merge choices
 * @param defaultChoices
 * @param customChoices
 * @returns
 */
function mergeChoices(defaultChoices: any[], customChoices: any[]): any[] {
  const choiceMap = new Map();

  defaultChoices.forEach((choice) => choiceMap.set(choice.value, choice));

  customChoices.forEach((choice) => choiceMap.set(choice.value, choice));

  return Array.from(choiceMap.values());
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

  function deepMerge(custCon: any, defaultCon: any): any {
    const result = { ...custCon };

    for (const key in defaultCon) {
      if (defaultCon.hasOwnProperty(key)) {
        if (
          typeof defaultCon[key] === "object" &&
          defaultCon[key] !== null &&
          !Array.isArray(defaultCon[key])
        ) {
          result[key] = deepMerge(result[key] || {}, defaultCon[key]);
        } else if (Array.isArray(defaultCon[key])) {
          result[key] = result[key] ?? defaultCon[key];
          // if (key === "choices") {
          //   result[key] = mergeChoices(result[key] || [], defaultCon[key]);
          // } else {
          //   result[key] = [...(result[key] || []), ...defaultCon[key]];
          // }
        } else {
          result[key] = defaultCon[key];
        }
      }
    }
    return result;
  }

  return deepMerge(customConfig, defaultConfig);
}
