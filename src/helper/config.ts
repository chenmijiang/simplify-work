import SW from "@/types";
import { cosmiconfig } from "cosmiconfig";

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
  const result = await explorer.load(".swrc.json");
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
