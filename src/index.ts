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
    let operationModule: any;
    try {
      operationModule = await import(`./sw/${path}.ts`);
    } catch (error) {
      try {
        operationModule = await import(`./sw/${path}/index.ts`);
      } catch (error) {
        throw new Error("Operation module does not exist");
      }
    }

    // Validate the imported module to ensure it exports a function
    const operation = operationModule.default || operationModule; // Try to use the default export or fallback to the module itself if default is undefined

    if (typeof operation !== "function") {
      throw new Error("Operation module does not export a default function");
    }

    // Execute the logic in the imported module
    await operation(newConfig);
  } catch (error: unknown) {
    errorHandler(error);
  }
}

main();
