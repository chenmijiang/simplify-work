/**
 * 1. 检查是否安装git、是否有远程仓库地址、是否有master/main分支、是否有未提交的代码
 * 2. 根据远程master/main 分支创建新的本地开发分支
 * 3. 本地开发分支命名规则：sprint-(随机16位数字字符串+日期)-(可选，自定义分支名称)
 * 4. 本地开发分支创建后，自动切换到该分支
 */
import { confirm, input, select } from "@inquirer/prompts";
import {
  checkGitInstallation,
  checkUncommittedChanges,
  createAndSwitchBranch,
} from "@/helper/git";
import SW from "@/types";

/**
 * generateBranchName
 */
function generateBranchName(customName: string = ""): string {
  const randomDigits = Math.random().toString(36).slice(2).slice(0, 16);
  // format: YYYYMMDD
  const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
  return `sprint${customName ? `-${customName}` : ""}-${randomDigits}${date}`;
}

/**
 * 1. 检测 git 是否安装
 * 3. 检测是否有未提交的代码，有则提示提交
 * 4. 本地开发分支命名规则：sprint-(随机16位数字字符串+日期)-(可选，自定义分支名称)
 * 5. 根据本地 master/main 分支创建新的开发分支，并切换到该分支
 */
const main: SW.ExecBashFunction = async () => {
  // check git installation
  await checkGitInstallation();
  // check uncommitted changes
  await checkUncommittedChanges();

  let isCreated = false;
  let branchName = "";

  while (!isCreated) {
    const customName = await input({
      message: "Enter a new branch for the branch (optional):",
    });

    branchName = generateBranchName(customName);
    isCreated = await confirm({
      message: `Create a new branch with the name: ${branchName} ?(Y/n)`,
      default: true,
    });
  }
  // 选择基线分支，select：main/master
  const baseMaster = await select({
    message: "Select a base branch to create a new branch:",
    default: "main",
    choices: [
      { name: "main", value: "main" },
      { name: "master", value: "master" },
    ],
  });
  // 是否拉取远程分支，默认是
  const isPull = await confirm({
    message: `Pull the latest '${baseMaster}' branch from the remote repository? (Y/n)`,
    default: true,
  });

  await createAndSwitchBranch(branchName, baseMaster, isPull);
};

export default main;
