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
 * merge config
 *
 * @param customConfig
 * @param defaultConfig
 * @returns {SW.Config}
 */
export function mergeConfig(
  customConfig: Partial<SW.Config> | null,
  defaultConfig: SW.Config,
): SW.Config {
  // 如果 customConfig 为空，返回 defaultConfig
  if (!customConfig) {
    return defaultConfig;
  }

  const mergedConfig: SW.Config = { ...defaultConfig };

  function mergeArray(customArray: any[], defaultArray: any[]): any[] {
    const mergedMap = new Map();

    defaultArray.forEach((item) => mergedMap.set(JSON.stringify(item), item));
    customArray.forEach((item) => mergedMap.set(JSON.stringify(item), item));

    return Array.from(mergedMap.values());
  }

  const handleValue = (source: any, target: any) => {
    const mergedValue = { ...target };
    for (const key in target) {
      const customValue = source[key] ?? [];
      const defaultValue = target[key];

      if (Array.isArray(defaultValue)) {
        const overwriteKey = `overwrite${key[0].toUpperCase()}${key.slice(1)}`;
        const overwriteValue: boolean = !!source[overwriteKey];

        mergedValue[key] = overwriteValue
          ? customValue
          : mergeArray(customValue, defaultValue);
      } else {
        mergedValue[key] = customValue ?? defaultValue;
      }
    }
    return mergedValue;
  };

  const handlePlugins = (
    customPlugins: any,
    defaultPlugins: SW.Config["plugins"],
  ): SW.Config["plugins"] => {
    const mergedPlugins: SW.Config["plugins"] = { ...defaultPlugins };

    for (const key in customPlugins) {
      const customPlugin = customPlugins[key];
      const defaultPlugin = defaultPlugins[key];

      mergedPlugins[key] = defaultPlugin
        ? handleValue(customPlugin, defaultPlugin)
        : customPlugin;
    }

    return mergedPlugins;
  };

  const customHandlerMap = {
    operation: handleValue,
    plugins: handlePlugins,
  };

  for (const key in customConfig) {
    const customValue = customConfig[key];
    const defaultValue = defaultConfig[key];

    if (key in customHandlerMap) {
      mergedConfig[key] = customHandlerMap[key](customValue, defaultValue);
    } else {
      mergedConfig[key] = customValue ?? defaultValue;
    }
  }

  return mergedConfig;
}
