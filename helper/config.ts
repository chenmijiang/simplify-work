import { SW } from "types";
import findConfig from "find-config";

/**
 * get custom config
 * @returns {SW.Config}
 */
export async function getCustomConfig(
  SW_CONFIG_NAME = ".sw-config.ts",
): Promise<SW.Config | null> {
  return findConfig.require(SW_CONFIG_NAME, { home: false });
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

      if (customValue !== undefined) {
        mergedConfig[key] = customValue;
      } else {
        mergedConfig[key] = defaultValue;
      }
    }
  }

  // enable customConfig to have additional properties
  for (const key in customConfig) {
    if (
      customConfig.hasOwnProperty(key) &&
      !defaultConfig.hasOwnProperty(key)
    ) {
      mergedConfig[key] = customConfig[key];
    }
  }

  return mergedConfig;
}
