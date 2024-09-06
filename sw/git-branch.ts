/**
 * 1. 检查是否安装git、是否有远程仓库地址、是否有master/main分支、是否有未提交的代码
 * 2. 根据远程master/main 分支创建新的本地开发分支
 * 3. 本地开发分支命名规则：sprint-(随机16位数字字符串+日期)-(可选，自定义分支名称)
 * 4. 本地开发分支创建后，自动切换到该分支
 */
import { confirm, input } from "@inquirer/prompts";
import {
  checkBranchAndUncommittedChanges,
  checkGitInstallation,
  checkRemoteRepository,
  createAndSwitchBranch,
} from "../helper/git";
import { SW } from "types";

/**
 * generateBranchName
 */
function generateBranchName(customName: string = ""): string {
  const randomDigits = Math.random().toString(36).slice(2).slice(0, 16);
  // format: YYYYMMDD
  const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
  return `sprint-${randomDigits}${date}${customName ? `-${customName}` : ""}`;
}

const main: SW.ExecBashFunction = async () => {
  await checkGitInstallation();
  await checkRemoteRepository();
  await checkBranchAndUncommittedChanges();

  const customName = await input({
    message: "Enter a custom name for the branch (optional):",
  });

  const branchName = generateBranchName(customName.trim());
  const answer = await confirm({
    message: `Create a new branch with the name: ${branchName}?(Y/n)`,
    default: true,
  });
  if (!answer) {
    process.exit(0);
  }
  await createAndSwitchBranch(branchName);
  // todo: confirm whether to push the branch to the remote repository
};

export default main;
