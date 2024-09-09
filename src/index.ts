#!/usr/bin/env node

import { select } from "@inquirer/prompts";
import errorHandler from "@/helper/errorHandler";

import { getCustomConfig, mergeConfig } from "@/helper/config";
import defaultConfig from ".sw-config";

async function main() {
  try {
    /**
     * @description get custom config
     */
    const customConfig = await getCustomConfig();
    /**
     * @description merge config
     */
    const newConfig = mergeConfig(customConfig, defaultConfig);
    /**
     * @description select operation type
     */
    const path = await select(newConfig.operation);
    // use dynamic import to load the operation file
    const operationModule = await import(`./${path}`);
    // Check if the imported module contains the required logic
    if (operationModule && typeof operationModule.default === "function") {
      // Execute the logic in the imported module
      await operationModule.default(newConfig);
    } else {
      throw new Error("Operation module does not export a default function");
    }
  } catch (error: unknown) {
    errorHandler(error);
  }
}

main();
