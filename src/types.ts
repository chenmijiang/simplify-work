import { Separator, type Theme } from "@inquirer/core";
import type { PartialDeep } from "@inquirer/type";

export declare namespace SW {
  type SelectTheme = {
    icon: {
      cursor: string;
    };
    style: {
      disabled: (text: string) => string;
      description: (text: string) => string;
    };
    helpMode: "always" | "never" | "auto";
  };
  type Choice<Value> = {
    value: Value;
    name?: string;
    description?: string;
    short?: string;
    disabled?: boolean | string;
    type?: never;
  };

  interface Option {
    name: string;
    value?: string | boolean;
  }

  interface Operation<Value = string> {
    message: string;
    choices:
      | readonly (string | Separator)[]
      | readonly (Separator | Choice<Value>)[];
    pageSize?: number | undefined;
    loop?: boolean | undefined;
    default?: unknown;
    theme?: PartialDeep<Theme<SelectTheme>> | undefined;
  }

  interface CzCustomMessages {
    type?: string;
    scope?: string;
    customScope?: string;
    subject?: string;
    body?: string;
    breaking?: string;
    footer?: string;
    confirmCommit?: string;
  }

  interface CzCustomAnswers {
    type: string;
    scope?: string;
    subject: string;
    body?: string;
    breaking?: string;
    footer?: string;
    confirmCommit?: string;
  }

  interface CzCustom<Value = any> {
    types?:
      | readonly (string | Separator)[]
      | readonly (Separator | Choice<Value>)[];
    scopes?:
      | readonly (string | Separator)[]
      | readonly (Separator | Choice<Value>)[];
    messages?: CzCustomMessages;
    allowBreakingChanges?: string[];
    skipQuestions?: string[];
    breakingPrefix?: string;
    footerPrefix?: string;
    subjectLimit?: number;
    subjectSeparator?: string;
    typePrefix?: string;
    typeSuffix?: string;
    breaklineChar?: string;
  }

  /**
   * @description config
   */
  interface Config {
    operation: Operation;
    "git-commit": CzCustom;
  }
  /**
   * @description execute function type
   */
  type ExecBashFunction = (config?: Config) => Promise<void>;
}
