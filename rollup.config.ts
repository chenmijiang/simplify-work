import typescript from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import dynamicImportVars from "@rollup/plugin-dynamic-import-vars";
import { defineConfig } from "rollup";

export default defineConfig([
  {
    input: "src/index.ts",
    output: [
      {
        dir: "dist/esm",
        format: "esm",
        sourcemap: true,
      },
      {
        dir: "dist/cjs",
        format: "cjs",
        sourcemap: true,
      },
    ],
    plugins: [
      json(),
      resolve(),
      commonjs({
        ignoreDynamicRequires: false,
      }),
      dynamicImportVars(),
      typescript({
        tsconfig: "./tsconfig.json",
      }),
      babel({
        babelHelpers: "bundled",
        presets: ["@babel/preset-env"],
        exclude: "node_modules/**",
      }),
    ],
  },
]);
