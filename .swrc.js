const config = {
  operation: {
    message: "请选择你的操作",
    default: "init",
    choices: [
      {
        name: "初始化开发环境",
        value: "init",
        description: "安装依赖、初始化 git 仓库、创建开发分支",
      },
      {
        name: "创建新需求分支",
        value: "git-branch",
        description: "基于基线分支创建开发分支",
      },
      {
        name: "git commit 你的代码",
        value: "git-commit",
        description: "采用 cz-customizable 规范 git commit",
      },
      {
        name: "deploy 你的代码",
        value: "git-deploy",
        description: "简化 git pull/merge/push/tag 操作",
      },
      {
        name: "创建新插件",
        value: "new-plugin",
        description: "创建新的插件",
        disabled: true,
      },
    ],
  },
  plugins: {
    "git-commit": {
      types: [
        { value: "initial", name: "🎉 initial:   初始化项目" },
        { value: "wip", name: "🚧 wip:       工作进行中" },
        { value: "feat", name: "✨ feat:      新增一个功能" },
        { value: "fix", name: "🐛 fix:       修复一个Bug" },
        {
          value: "refactor",
          name: "🔨 refactor:  重构（既不修复bug也不添加特性的代码更改）",
        },
        { value: "docs", name: "📝 docs:      文档变更" },
        { value: "test", name: "✅ test:      添加缺失的测试或更正现有的测试" },
        { value: "chore", name: "🗯 chore:      构建过程或辅助工具的变动" },
        { value: "revert", name: "⏪ revert:    代码回退" },
        { value: "perf", name: "⚡️ perf:      提升性能" },
        { value: "ui", name: "💄 ui:        更新UI和样式" },
        { value: "style", name: "🎨 style:     改进代码结构/代码格式" },
        { value: "mv", name: "🚚 mv:        移动重命名文件" },
        { value: "delete", name: "🔥 delete:    删除文件" },
        { value: "up", name: "⬆️ up:         升级依赖" },
        { value: "down", name: "⬇️ down:       降级依赖" },
        { value: "docker", name: "🐳 docker:    docker相关" },
        { value: "tag", name: "🔖 tag:       发行/版本标签" },
        { value: "patch", name: "🚑 patch:     重要补丁" },
      ],
      messages: {
        type: "请选择您要提交的类型:",
        scope: "请输入修改范围(可选):",
        customScope: "请输入文件修改范围(可选):",
        subject: "请简要描述提交(必选):",
        body: "请输入详细描述，使用'|'换行(可选):",
        breaking: "列出任何突破性的变化(可选)",
        footer: "请输入要关闭的issue(可选)。例:#31，#34:",
        confirmCommit: "您确定要继续执行上面的提交吗?",
      },
      scopes: [
        {
          name: "other",
          value: "other",
        },
      ],
      skipQuestions: [],
      allowBreakingChanges: ["feat", "fix"],
      subjectLimit: 100,
    },
    "git-branch": {
      default: "main",
      choices: [
        { name: "main", value: "main" },
        { name: "master", value: "master" },
      ],
    },
  },
};

module.exports = config;
