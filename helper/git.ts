import { execPromise } from "./utils";

// 检测 git 是否安装
export async function checkGitInstallation() {
  const { stdout: gitVersion } = await execPromise("git --version");
  if (!gitVersion) {
    throw new Error("Git is not installed. Please install Git.");
  }
  console.log("current git version:", gitVersion.trim());
}

// 检测远程仓库和主分支，并拉取最新代码
export async function checkRemoteAndBranch() {
  // 判断是否有远程分支
  const { stdout: remote } = await execPromise("git remote -v");

  if (!remote) {
    return;
  }
  // 检测是否有远程主分支 master / main
  const { stdout: heads } = await execPromise("git ls-remote --heads origin");

  const hasMaster = heads.includes("refs/heads/master");
  const hasMain = heads.includes("refs/heads/main");

  if (hasMaster) {
    console.log("Found remote 'master' branch. Pulling latest code...");
    await execPromise("git pull origin master");
  } else if (hasMain) {
    console.log("Found remote 'main' branch. Pulling latest code...");
    await execPromise("git pull origin main");
  } else {
    throw new Error(
      "No 'master' or 'main' branch found in the remote repository.",
    );
  }
}

// 检测是否有未提交的代码
export async function checkUncommittedChanges() {
  const { stdout: status } = await execPromise("git status --porcelain");
  if (status) {
    throw new Error(
      "You have uncommitted changes. Please commit or stash them before proceeding.",
    );
  }
}

// commit code
export async function commitChanges(commitMessage: string) {
  await execPromise(`git commit -m "${commitMessage}"`);
}

// 创建并切换到新分支
export async function createAndSwitchBranch(
  branchName: string,
  baseBranch: string,
  isPull: boolean,
) {
  await execPromise(`git checkout ${baseBranch}`);
  if (isPull) {
    await execPromise(`git pull origin ${baseBranch}`);
  }

  // create new branch
  await execPromise(`git checkout -b ${branchName}`);
  console.log(`Switched to new branch: ${branchName}`);
}

// 检测git暂存区是否有代码
export async function hasStagedChanges() {
  // 检测暂存区是否有代码
  const { stdout: stagedFiles } = await execPromise(
    "git diff --cached --name-only",
  );

  if (!stagedFiles.trim()) {
    throw new Error("No staged changes found. Please stage your changes.");
  }
}
