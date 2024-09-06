import { select } from "@inquirer/prompts";
import errorHandler from "helper/errorHandler";

/**
 * @type {SW.Config}
 * todo: use dynamic import to load the operation file
 */
import config from "./sw.config";

async function main() {
  /**
   * @description select operation type
   */
  const path = await select(config.operation);

  try {
    // use dynamic import to load the operation file
    const operationModule = await import(`./${path}`);
    // Check if the imported module contains the required logic
    if (operationModule && typeof operationModule.default === "function") {
      // Execute the logic in the imported module
      await operationModule.default(config);
    } else {
      throw new Error("Operation module does not export a default function");
    }
  } catch (error: unknown) {
    errorHandler(error);
  }
}

main();
