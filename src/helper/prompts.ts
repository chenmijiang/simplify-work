import {
  editor,
  select,
  confirm,
  input,
  number,
  expand,
  rawlist,
  password,
  search,
  checkbox,
} from "@inquirer/prompts";

export { Separator } from "@inquirer/prompts";

export interface Prompts {
  select: typeof select;
  editor: typeof editor;
  confirm: typeof confirm;
  input: typeof input;
  number: typeof number;
  expand: typeof expand;
  rawlist: typeof rawlist;
  password: typeof password;
  search: typeof search;
  checkbox: typeof checkbox;
}

export const prompts: Readonly<Prompts> = Object.freeze({
  select,
  editor,
  confirm,
  input,
  number,
  expand,
  rawlist,
  password,
  search,
  checkbox,
});

// 插件交互流程
// 编写配置文件，调用 传入的 prompts 完成交互
