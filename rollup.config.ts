import typescript from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import dynamicImportVars from "@rollup/plugin-dynamic-import-vars";
import dts from "rollup-plugin-dts";
import { defineConfig } from "rollup";

export default defineConfig([
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
      format: "esm",
    },
    // output: [
    //   {
    //     dir: "dist/esm",
    //     format: "esm",
    //   },
    //   {
    //     dir: "dist/cjs",
    //     format: "cjs",
    //   },
    // ],
    plugins: [
      json(),
      resolve(),
      commonjs({
        ignoreDynamicRequires: false,
      }),
      dynamicImportVars(),
      typescript({
        tsconfig: "tsconfig.json",
      }),
      babel({
        babelHelpers: "bundled",
        presets: ["@babel/preset-env"],
        exclude: "node_modules/**",
      }),
    ],
    external: ["@inquirer/prompts", "find-config"],
  },
  {
    input: "dist/types/src/types.d.ts", // 类型声明入口文件
    output: {
      file: "dist/types/index.d.ts", // 输出的类型声明文件
    },
    plugins: [dts()],
  },
]);
