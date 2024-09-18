import path from "path";
import os from "os";
import fs from "fs/promises";
import { getFileFullName, getPackageRootDir, SWorkPluginDir } from "./commons";

/**
 * load plugin
 */
async function loadPlugin(pluginPath: string): Promise<any | null> {
  try {
    // if the file does not exist, fs.stat will throw an error
    await fs.stat(pluginPath);
    // use require to load the plugin
    return require(pluginPath);
  } catch (err: any) {
    // only continue if the file does not exist
    if (err.code !== "ENOENT") {
      throw err;
    }
    return null;
  }
}

export async function getCustomPlugin(pluginName: string): Promise<any | null> {
  const packageRoot = await getPackageRootDir(process.cwd());

  const projectPluginPath = path.resolve(
    packageRoot,
    SWorkPluginDir,
    getFileFullName(pluginName),
  );
  const userPluginPath = path.resolve(
    os.homedir(),
    SWorkPluginDir,
    getFileFullName(pluginName),
  );

  const projectPlugin = await loadPlugin(projectPluginPath);
  if (projectPlugin) {
    return projectPlugin;
  }

  const userPlugin = await loadPlugin(userPluginPath);
  if (userPlugin) {
    return userPlugin;
  }

  return null;
}
