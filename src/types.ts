import { Separator, type Theme } from "@inquirer/core";
import type { PartialDeep } from "@inquirer/type";

namespace SW {
  export type SelectTheme = {
    icon: {
      cursor: string;
    };
    style: {
      disabled: (text: string) => string;
      description: (text: string) => string;
    };
    helpMode: "always" | "never" | "auto";
  };
  export type Choice<Value> = {
    value: Value;
    name?: string;
    description?: string;
    short?: string;
    disabled?: boolean | string;
    type?: never;
  };

  export interface Option {
    name: string;
    value?: string | boolean;
  }

  export interface Operation<Value = string> {
    message: string;
    choices:
      | readonly (string | Separator)[]
      | readonly (Separator | Choice<Value>)[];
    pageSize?: number | undefined;
    loop?: boolean | undefined;
    default?: unknown;
    theme?: PartialDeep<Theme<SelectTheme>> | undefined;
  }

  export interface CzCustomMessages {
    type?: string;
    scope?: string;
    customScope?: string;
    subject?: string;
    body?: string;
    breaking?: string;
    footer?: string;
    confirmCommit?: string;
  }

  export interface CzCustomAnswers {
    type: string;
    scope?: string;
    subject: string;
    body?: string;
    breaking?: string;
    footer?: string;
    confirmCommit?: string;
  }

  export interface CzCustom<Value = any> {
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

  export interface BranchConfig {
    default: string;
    branch: {
      name: string;
      value: string;
    }[];
  }

  /**
   * @description config
   */
  export interface Config {
    operation: Operation;
    plugins: {
      "git-commit": CzCustom;
      "git-branch": BranchConfig;
    };
  }
  /**
   * @description execute function type
   */
  export type ExecBashFunction<T = any> = (
    config?: T,
    AllConfig?: Config,
  ) => Promise<void>;
}

export default SW;
