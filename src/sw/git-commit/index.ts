import { editor } from "@inquirer/prompts";
import { commitChanges, hasStagedChanges } from "@/helper/git";
import SW from "@/types";
import formatCommitMessage from "./build-commit";
import { mergeCzCustomConfig } from "./mergeCzCustomConfig";
import buildAndExecQuestions from "./questions";

const main: SW.ExecBashFunction = async (config) => {
  // if no staged changes, exit
  await hasStagedChanges();

  const czCustomConfig = mergeCzCustomConfig(config["git-commit"]);

  const answers = await buildAndExecQuestions(czCustomConfig);
  const confirmCommit = answers.confirmCommit;
  const commitMsg = formatCommitMessage(answers, czCustomConfig);

  if (confirmCommit === "yes") {
    await commitChanges(commitMsg);
  } else if (confirmCommit === "edit") {
    const commit = await editor({
      message: "Edit commit message",
      default: commitMsg,
    });
    await commitChanges(commit);
  } else {
    console.info("Commit has been canceled.");
  }
};

export default main;
