import { SW } from "./types";

const config: SW.Config = {
  operation: {
    message: "请选择你的操作",
    default: "sw/init",
    choices: [
      {
        name: "初始化开发环境",
        value: "sw/init",
        description: "安装依赖、初始化 git 仓库、创建开发分支",
      },
      {
        name: "创建新需求分支",
        value: "sw/git-branch",
        description: "创建新分支并推送到远程",
      },
      {
        name: "git commit 你的代码",
        value: "sw/git-commit",
        description: "采用 cz-customizable 规范 git commit",
      },
      {
        name: "deploy 你的代码",
        value: "sw/git-deploy",
        description: "简化 git pull/merge/push/tag 操作",
      },
      {
        name: "创建新插件",
        value: "sw/new-plugin",
        description: "创建新的插件",
      },
    ],
  },
};

export default config;
