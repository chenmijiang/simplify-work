import { input } from "@inquirer/prompts";
import { SW } from "types";
import * as fs from "fs";
import * as path from "path";

const main: SW.ExecBashFunction = async () => {
  const pluginName = await input({
    message: "Enter the plugin name:",
    required: true,
  });
  const pluginPath = await input({
    message: "Enter the plugin path:",
    default: "sw",
  });

  const currentDir = process.cwd();
  const pluginDir = path.join(currentDir, pluginPath);
  const pluginFilePath = path.join(pluginDir, `${pluginName}.ts`);

  if (!fs.existsSync(pluginDir)) {
    fs.mkdirSync(pluginDir, { recursive: true });
  }

  if (fs.existsSync(pluginFilePath)) {
    throw new Error(`File ${pluginFilePath} already exists.`);
  }

  const content = `import { SW } from "types";\n\nconst main: SW.ExecBashFunction = async () => {\n  console.info("todo implement ${pluginName}");\n};\n\nexport default main;\n`;
  fs.writeFileSync(pluginFilePath, content, "utf8");
  console.log(`Plugin file created successfully at ${pluginPath}`);
};

export default main;
