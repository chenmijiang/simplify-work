import { select } from "@inquirer/prompts";
import errorHandler from "@/helper/errorHandler";
import {
  getCustomConfig,
  getDefaultConfig,
  mergeConfig,
} from "@/helper/config";
import { getCustomPlugin } from "@/helper/plugin";

async function main() {
  try {
    /**
     * @description merge config
     */
    const config = mergeConfig(
      await getCustomConfig(),
      await getDefaultConfig(),
    );
    /**
     * @description select operation type
     */
    const pluginName = await select(config.operation);

    // use dynamic import to load the operation file
    let operationModule: any = null;
    try {
      operationModule = await import(`./plugins/${pluginName}.ts`);
    } catch (_) {
      try {
        operationModule = await import(`./plugins/${pluginName}/index.ts`);
      } catch (_) {
        operationModule = await getCustomPlugin(pluginName);
        if (!operationModule) {
          throw new Error("plugin does not exist");
        }
      }
    }
    // Try to use the default export or fallback to the module itself if default is undefined
    const plugin = operationModule.default || operationModule;
    if (typeof plugin !== "function") {
      throw new Error("plugin does not export a default function");
    }

    /**
     * @description Execute the logic in the imported module
     */
    await plugin(config.plugins[pluginName], config);
  } catch (error: unknown) {
    errorHandler(error);
  }
}

main();

export * from "./types";
