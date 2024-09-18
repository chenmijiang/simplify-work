import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import dynamicImportVars from "@rollup/plugin-dynamic-import-vars";
import typescript from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import { defineConfig } from "rollup";

export default defineConfig([
  {
    input: "src/index.ts",
    output: {
      dir: "bin",
      format: "cjs",
      banner: "#!/usr/bin/env node",
    },
    plugins: [
      resolve(),
      commonjs({
        include: /node_modules/,
        sourceMap: false,
      }),
      dynamicImportVars(),
      typescript(),
      babel({
        babelHelpers: "bundled",
        exclude: "node_modules/**",
      }),
      terser(),
    ],
    external: ["@inquirer/prompts", "cosmiconfig", "fs", "path", "os"],
  },
  {
    input: "src/types.ts",
    output: {
      file: "./types.d.ts",
      format: "es",
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        declaration: true,
        declarationDir: "./",
        include: ["src/types.ts"],
      }),
    ],
    external: ["@inquirer/prompts", "cosmiconfig", "fs", "path", "os"],
  },
]);
