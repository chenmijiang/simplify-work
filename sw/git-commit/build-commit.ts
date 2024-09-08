import { SW } from "types";
import wrap from "word-wrap";

type Config = SW.CzCustom;
type Answers = SW.CzCustomAnswers;

const addScope = (scope: string | undefined, config: Config): string => {
  const separator = config["subjectSeparator"];
  if (!scope) return separator;
  return `(${scope.trim()})${separator}`;
};

const addSubject = (subject: string): string => subject.trim();

const addType = (type: string, config: Config): string => {
  const prefix = config["typePrefix"] || "";
  const suffix = config["typeSuffix"] || "";
  return `${prefix}${type}${suffix}`;
};

const addBreaklinesIfNeeded = (value: string, breaklineChar: string): string =>
  value.split(breaklineChar).join("\n");

const addFooter = (footer: string, config: Config): string => {
  if (config && config.footerPrefix === "") return `\n\n${footer}`;
  const footerPrefix = config.footerPrefix
    ? config.footerPrefix
    : "ISSUES CLOSED:";
  return `\n\n${footerPrefix} ${addBreaklinesIfNeeded(footer, config.breaklineChar)}`;
};

const escapeSpecialChars = (result: string): string => {
  const specialChars = ["`", '"', "\\$", "!", "<", ">", "&"];
  let newResult = result;

  specialChars.forEach((item) => {
    newResult = newResult.replace(new RegExp(item, "g"), `\\${item}`);
  });

  return newResult;
};

function formatCommitMessage(answers: Answers, config: Config): string {
  const wrapOptions = {
    trim: true,
    newline: "\n",
    indent: "",
    width: 100,
  };

  const head =
    addType(answers.type, config) +
    addScope(answers.scope, config) +
    addSubject(answers.subject.slice(0, config.subjectLimit));

  let body = answers.body
    ? addBreaklinesIfNeeded(answers.body, config.breaklineChar)
    : "";
  body = body ? wrap(body, wrapOptions) : "";

  const breaking = wrap(answers.breaking || "", wrapOptions);
  const footer = wrap(answers.footer || "", wrapOptions);

  let result = head;
  if (body) result += `\n\n${body}`;
  if (breaking)
    result += `\n\n${config.breakingPrefix || "BREAKING CHANGE:"}\n${breaking}`;
  if (footer) result += addFooter(footer, config);

  return escapeSpecialChars(result);
}

export default formatCommitMessage;
