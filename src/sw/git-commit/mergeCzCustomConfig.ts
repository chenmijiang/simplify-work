import { Separator } from "@inquirer/prompts";
import SW from "@/types";

export const mergeCzCustomConfig = (czCustom: SW.CzCustom): SW.CzCustom => {
  const messages = czCustom.messages || {};
  const scopes = czCustom.scopes || [];
  return {
    ...czCustom,
    types: czCustom.types || [],
    // @ts-ignore
    scopes: [
      ...scopes,
      new Separator(),
      {
        name: "empty",
        value: false,
      },
      {
        name: "custom",
        value: "custom",
      },
    ],
    messages: {
      type:
        messages.type || "Select the type of change that you're committing:",
      scope: messages.scope || "\nDenote the SCOPE of this change (optional):",
      customScope: messages.customScope || "Denote the SCOPE of this change:",
      subject:
        messages.subject ||
        "Write a SHORT, IMPERATIVE tense description of the change:\n",
      body:
        messages.body ||
        'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
      breaking: messages.breaking || "List any BREAKING CHANGES (optional):\n",
      footer:
        messages.footer ||
        "List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n",
      confirmCommit:
        messages.confirmCommit ||
        "Are you sure you want to proceed with the commit above?",
    },
    skipQuestions: czCustom.skipQuestions || [],
    allowBreakingChanges: czCustom.allowBreakingChanges || [],
    subjectLimit: czCustom.subjectLimit || 100,
    subjectSeparator: czCustom.subjectSeparator || ": ",
    breaklineChar: czCustom.breaklineChar || "|",
  };
};
