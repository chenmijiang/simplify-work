import { SW } from "@/types";
import formatCommitMessage from "./build-commit";

interface Question {
  type: "input" | "select" | "expand";
  name: string;
  message: string | ((answers: SW.CzCustomAnswers) => string);
  choices?: any;
  default?: any;
  when?: (answers: SW.CzCustomAnswers) => boolean;
  validate?: (value: string) => boolean | string;
}

const isNotWip = (answers: SW.CzCustomAnswers) =>
  answers.type.toLowerCase() !== "wip";

async function buildAndExecQuestions(
  config: SW.CzCustom,
): Promise<SW.CzCustomAnswers> {
  const messages = config.messages;

  let questions: Question[] = [
    {
      type: "select",
      name: "type",
      message: messages.type,
      choices: config.types,
    },
    {
      type: "select",
      name: "scope",
      message: messages.scope,
      choices: config.scopes,
      when(answers) {
        return isNotWip(answers);
      },
    },
    {
      type: "input",
      name: "scope",
      message: messages.customScope,
      when(answers) {
        return answers.scope === "custom";
      },
    },
    {
      type: "input",
      name: "subject",
      message: messages.subject,
      validate(value) {
        const limit = config.subjectLimit || 100;
        if (value.length > limit) {
          return `Exceed limit: ${limit}`;
        }
        return true;
      },
    },
    {
      type: "input",
      name: "body",
      message: messages.body,
    },
    {
      type: "input",
      name: "breaking",
      message: messages.breaking,
      when(answers) {
        return config.allowBreakingChanges.includes(answers.type);
      },
    },
    {
      type: "input",
      name: "footer",
      message: messages.footer,
      when: isNotWip,
    },
    {
      type: "expand",
      name: "confirmCommit",
      choices: [
        { key: "y", name: "Yes", value: "yes" },
        { key: "n", name: "Abort commit", value: "no" },
        { key: "e", name: "Edit message", value: "edit" },
      ],
      default: "y",
      message(answers) {
        const SEP =
          "###--------------------------------------------------------###";
        console.info(
          `\n${SEP}\n${formatCommitMessage(answers, config)}\n${SEP}\n`,
        );
        return messages.confirmCommit;
      },
    },
  ];
  questions = questions.filter(
    (item) => !config.skipQuestions.includes(item.name),
  );

  const answers = {} as SW.CzCustomAnswers;

  for (const question of questions) {
    let { type, message, when, ...rest } = question;
    if (when && !when(answers)) {
      continue;
    }
    if (message instanceof Function) {
      message = message(answers);
    }

    await import(`@inquirer/prompts`).then(({ [type]: prompt }) => {
      // @ts-ignore
      return prompt({ message, ...rest }).then((answer) => {
        answers[question.name] = answer;
      });
    });
  }

  return answers;
}

export default buildAndExecQuestions;
