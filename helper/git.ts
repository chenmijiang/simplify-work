import { $ } from "bun";

/**
 * Check if Git is installed.
 */
export async function checkGitInstallation(): Promise<void> {
  try {
    await $`git --version`;
  } catch (error) {
    throw new Error("Git is not installed. Please install Git and try again.");
  }
}

/**
 * check remote repository
 */
export async function checkRemoteRepository(): Promise<void> {
  try {
    const output = await $`git remote -v`;
    if (!output) {
      throw new Error(
        "No remote repository found. Please add a remote repository and try again.",
      );
    }
  } catch (error) {
    throw new Error("Failed to check remote repository.");
  }
}

/**
 * check branch and uncommitted changes
 */
export async function checkBranchAndUncommittedChanges(): Promise<void> {
  try {
    // Check for master/main branch
    const { stdout: branches } = await $`git branch -r`;
    if (
      !branches.includes("origin/master") &&
      !branches.includes("origin/main")
    ) {
      throw new Error("No master/main branch found on remote.");
    }

    const { stdout: status } = await $`git status --porcelain`;
    if (status) {
      throw new Error(
        "There are uncommitted changes. Please commit or stash them before creating a new branch.",
      );
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * create and switch branch
 * @param branchName string
 */
export async function createAndSwitchBranch(branchName: string): Promise<void> {
  try {
    await $`git checkout -b ${branchName}`;
  } catch (error) {
    throw new Error(`Failed to create and switch to branch ${branchName}.`);
  }
}
