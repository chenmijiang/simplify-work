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
    output: {
      // file: "dist/index.esm.js",
      dir: "dist",
      format: "esm",
      sourcemap: true,
    },
    plugins: [
      json(),
      resolve(), // 先解析 node_modules
      commonjs({
        ignoreDynamicRequires: false, // 允许解析动态 require
      }),
      dynamicImportVars(), // 解析动态导入
      typescript(), // 将 TypeScript 转为 JavaScript
      babel({
        babelHelpers: "bundled",
        presets: ["@babel/preset-env"],
        exclude: "node_modules/**",
      }),
    ],
  },
  // {
  //   input: "src/index.ts",
  //   output: [
  //     {
  //       // file: "dist/index.esm.js",
  //       dir: "dist/esm",
  //       format: "esm",
  //       sourcemap: true,
  //     },
  //     {
  //       dir: "dist/cjs",
  //       format: "cjs",
  //       sourcemap: true,
  //     },
  //   ],
  //   plugins: [
  //     json(),
  //     resolve(), // 先解析 node_modules
  //     commonjs({
  //       ignoreDynamicRequires: false, // 允许解析动态 require
  //     }),
  //     dynamicImportVars(), // 解析动态导入
  //     typescript(), // 将 TypeScript 转为 JavaScript
  //     babel({
  //       babelHelpers: "bundled",
  //       presets: ["@babel/preset-env"],
  //       exclude: "node_modules/**",
  //     }),
  //   ],
  // },
]);
