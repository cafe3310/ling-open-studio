# ling-open-studio

## 项目概述

`ling-open-studio` 是一个专为 Ling 系列 LLM 设计的一站式 Playground 应用。

它是一个将 [assistant-ui](https://github.com/Yonom/assistant-ui) 与 [LangGraph](https://langchain-ai.github.io/langgraph/) 集成的项目。

该应用提供了一个基于 React 和 Next.js 构建的现代多 Tab 聊天界面（Chat, Web, Write），并通过 LangGraph 后端来管理 Agent 的状态和执行。

## Agent 协作指南

### 沟通规范

- Agent 与用户使用中文进行沟通。
- 表达应简洁、直接且技术化。避免任何寒暄或废话。

### Agent Skill

- 本项目使用 `doc-todo-log-loop` 技能（本地技能，[在线版本](https://github.com/cafe3310/public-agent-skills)）进行任务管理和过程追踪。
- 在完成一个有意义的工作块后，必须记录开发日志。

### 关键目录

本项目使用 monorepo 结构，主要目录包括：

`根目录`: 项目配置和文档。
- `./docs/` : 存放设计文档、开发日志和研究资料。
- `./.github/` : GitHub 相关配置（如工作流、Issue 模板等）。

`./apps/studio/`: 主应用 package。

### 文档规范

- 文件名格式使用: `%Y-%m-%d-%H-%M-<标题>.md`。
- 在新文档开始处引用来源文档，以保持知识的可追溯性。
- Inbox 目录: `docs/inbox/` 目录作为用户提供文件（文档、图片等）的存放位置，供 Agent 读取和处理。处理之前应移动文件至 `docs/` 并合理重命名。

### 项目架构与背景

- 后端架构: 采用模块化 LangGraph 实现。基于 assistant 身份功能纵向切分目录，每个 Agent 拥有独立的子目录（如 `src/assistants/write-architect/preprocessor/`）。
- 前端架构: 使用 Zustand 进行状态管理，`assistant-ui` 处理聊天交互，自定义组件实现特定领域的写作/网页画布，同样基于 assisatnt 身份进行功能划分。
- 存储: IndexedDB (浏览器端 VFS)。

### 技术栈

整体遵循 Tailwind CSS 4, React 19 (Next.js 16) 和 LangGraph 模式。

- 框架: Next.js 16 (App Router) - Standalone 输出模式
- 语言: TypeScript
- UI 组件: React 19, Tailwind CSS 4, Radix UI, Shadcn UI
- AI/聊天接口: `@assistant-ui/react`, `@assistant-ui/react-ai-sdk`, `@assistant-ui/react-langgraph`

验证机制: 每一项变更都必须经过实证验证。对于 Bug 修复，需先复现失败场景。

### 参考 API 文档

- **assistant-ui 文档**: [https://www.assistant-ui.com/docs/api-reference/overview](https://www.assistant-ui.com/docs/api-reference/overview)
- **AI SDK 参考**: [https://ai-sdk.dev/docs/reference](https://ai-sdk.dev/docs/reference)
- **LangGraph 文档**: [https://langchain-ai.github.io/langgraph/](https://langchain-ai.github.io/langgraph/)

## 构建与运行

### 前置要求

确保已安装 Node.js 和 pnpm。

在 `apps/studio` 目录下创建一个 `.env.local` 文件，参考 `.env.example` 来配置 OpenAI 兼容 API 密钥和其他相关设置。

```env
OPENAI_API_KEY=your_openai_compatible_api_key
OPENAI_API_BASE=your_api_endpoint
... 还有更多配置
```

常用命令

*   **安装依赖:** `pnpm install`
*   **启动开发服务器:** `pnpm run dev`
*   **代码 Lint 检查:** `pnpm run lint`
*   **代码格式化:** `pnpm run prettier:fix`
