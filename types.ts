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

  interface Operation<Value = any> {
    message: string;
    choices:
      | readonly (string | Separator)[]
      | readonly (Separator | Choice<Value>)[];
    pageSize?: number | undefined;
    loop?: boolean | undefined;
    default?: unknown;
    theme?: PartialDeep<Theme<SelectTheme>> | undefined;
  }

  /**
   * @description config
   */
  interface Config {
    operation: Operation;
  }
  /**
   * @description execute function type
   */
  type ExecBashFunction = (config?: Config) => Promise<void>;
}
