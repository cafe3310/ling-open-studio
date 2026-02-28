# 修复 apps/studio 编译错误：import 语句中的 .ts 扩展名问题

## 背景
用户在进行项目构建时，`apps/studio` 包报告了 TypeScript 编译错误。

## 问题描述
在 `apps/studio/src/lib/prompts/assistants/web-architect/style-library/index.ts` 文件中，所有导入语句都显式包含了 `.ts` 扩展名。

错误信息：
`Type error: An import path can only end with a '.ts' extension when 'allowImportingTsExtensions' is enabled.`

## 解决方案
根据 TypeScript 和 Next.js 的常规实践，在导入 TypeScript 文件时应省略扩展名。
将 `import ... from './File.md.ts';` 改为 `import ... from './File.md';`。

## 影响范围
- `apps/studio/src/lib/prompts/assistants/web-architect/style-library/index.ts`

## 验证计划
1. 修改代码。
2. 在 `apps/studio` 目录下运行 `pnpm run build` 验证编译是否通过。
