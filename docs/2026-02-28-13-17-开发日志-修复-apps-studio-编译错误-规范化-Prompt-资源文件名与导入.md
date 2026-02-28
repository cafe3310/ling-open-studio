# 开发日志 - 修复 apps/studio 编译错误 - 规范化 Prompt 资源文件名与导入

## 背景
在执行 `pnpm run build` 时，`apps/studio` 包报告了 TypeScript 编译错误。原因是 `style-library` 中的导入语句包含 `.ts` 扩展名，且文件名包含双重扩展名 `.md.ts`，不符合 TypeScript 编译规范及项目的 `moduleResolution: bundler` 配置。

来源文档：
- `docs/2026-02-28-13-14-修复-apps-studio-编译错误-import-ts-扩展名问题.md`

## 实现细节
1. **文件名重命名**：
    - 将 `apps/studio/src/lib/prompts/assistants/web-architect/style-library/` 目录下所有以 `.md.ts` 结尾的文件重命名为 `.ts`（例如：`Newsprint.md.ts` -> `Newsprint.ts`）。
    - 此操作通过以下 shell 脚本完成：
      ```bash
      for f in *.md.ts; do mv "$f" "${f%.md.ts}.ts"; done
      ```
2. **代码修改**：
    - 更新 `apps/studio/src/lib/prompts/assistants/web-architect/style-library/index.ts`。
    - 移除了所有导入语句中的 `.md.ts` 后缀，改为不带扩展名的标准导入方式。

## 验证结果
- 在 `apps/studio` 目录下运行 `pnpm run build`，编译顺利通过。
- 确认全量 31 个预设风格文件均已重命名且导入正确。

## 结论
该问题已修复，CI/CD 构建流水线应可恢复正常。
