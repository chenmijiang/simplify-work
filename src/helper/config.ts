import SW from "@/types";
import { cosmiconfig, Options, PublicExplorer } from "cosmiconfig";
import path from "path";
import { getPackageDir } from "./commons";

const ExplorerName = "sw";
const ExplorerOptions: Readonly<Partial<Options>> = {
  stopDir: require("os").homedir(),
  searchPlaces: [".swrc", ".swrc.json", ".swrc.js"],
};
const explorer: PublicExplorer = cosmiconfig(ExplorerName, ExplorerOptions);

export const DefaultConfigFileName = ".swrc.js";

/**
 * get custom config
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
 */
export async function getDefaultConfig(): Promise<SW.Config> {
  const rootDir = await getPackageDir();
  if (!rootDir) {
    throw new Error("Could not find package root directory");
  }

  const configPath = path.join(rootDir, DefaultConfigFileName);
  const result = await explorer.load(configPath);
  return result.config as SW.Config;
}

/**
 * merge array, remove duplicate elements
 */
export function mergeArray(customArray: any[], defaultArray: any[]): any[] {
  const mergedMap = new Map();

  defaultArray.forEach((item) => mergedMap.set(JSON.stringify(item), item));
  customArray.forEach((item) => mergedMap.set(JSON.stringify(item), item));

  return Array.from(mergedMap.values());
}

/**
 * handle value, merge custom value and default value
 */
export function handleValue(source: any, target: any) {
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
}

/**
 * handle plugins, merge custom plugins and default plugins
 */
export function handlePlugins(
  customPlugins: any,
  defaultPlugins: SW.Config["plugins"],
): SW.Config["plugins"] {
  const mergedPlugins: SW.Config["plugins"] = { ...defaultPlugins };

  // assign custom plugins to merged plugins
  for (const key in customPlugins) {
    const customPlugin = customPlugins[key];
    const defaultPlugin = defaultPlugins[key];

    mergedPlugins[key] = defaultPlugin
      ? handleValue(customPlugin, defaultPlugin)
      : customPlugin;
  }

  return mergedPlugins;
}

/**
 * merge config
 */
export function mergeConfig(
  customConfig: Partial<SW.Config> | null,
  defaultConfig: SW.Config,
): SW.Config {
  // if custom config is not exist, return default config
  if (!customConfig) {
    return defaultConfig;
  }

  const mergedConfig: SW.Config = { ...defaultConfig };

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
