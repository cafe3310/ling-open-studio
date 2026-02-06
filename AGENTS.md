# ling-open-studio

## 项目概述

`ling-open-studio` 是一个专为 "ling 系列 LLM" 设计的一站式 Playground 应用。

它是一个将 [assistant-ui](https://github.com/Yonom/assistant-ui) 与 [LangGraph](https://langchain-ai.github.io/langgraph/) 集成的项目。

该应用提供了一个基于 React 和 Next.js 构建的现代聊天界面，并通过 LangGraph 后端来管理 Agent 的状态和执行。

## 项目技能 (Agent Skills)

本项目使用 `doc-todo-log-loop` Agent Skill 进行任务管理和日志记录。

## 文档规范

本项目文档

- 本项目的文档都在 `docs/` 目录下，文件名规范 `%Y-%m-%d-%H-%M-<title>.md`。
- 开发日志文档的命名格式为 `%Y-%m-%d-%H-%M-开发日志.md`。

参考项目文档

- 本项目在启动阶段参考了其他本地项目和开源项目，在分析过程中创建的文档在 `docs/reference/` 目录下。
- 参考项目: `ling-model-judge` 和 `osw-studio`

Inbox 目录

- `docs/inbox/` 目录作为用户提供文件（文档、图片等）的存放位置，供 Agent 读取和处理。
- Agent 处理内容后应该将结果存放到 `docs/` 中并按项目文档命名格式重命名。

### 初始技术栈

*   **框架:** Next.js 16 (App Router)
*   **语言:** TypeScript
*   **UI 组件:** React 19, Tailwind CSS 4, Radix UI
*   **AI/聊天接口:** `@assistant-ui/react`, `@assistant-ui/react-langgraph`
*   **Agent 编排:** `@langchain/langgraph-sdk`

## 构建与运行

### 前置要求

确保已安装 Node.js。此外，你需要有访问 LangGraph API 的权限。

### 环境配置

在根目录下创建一个 `.env.local` 文件，并添加以下配置项：

```env
LANGCHAIN_API_KEY=your_langchain_api_key
LANGGRAPH_API_URL=your_langgraph_api_url
```

### 脚本命令

*   **安装依赖:** `pnpm install`
*   **启动开发服务器:** `pnpm run dev` (运行于 `http://localhost:3000`)
*   **生产环境构建:** `pnpm run build`
*   **启动生产服务器:** `pnpm run start`
*   **代码 Lint 检查:** `pnpm run lint`
*   **代码格式化:** `pnpm run prettier:fix`

## 初始项目结构与关键文件

*   **`app/`**: 包含 Next.js App Router 的页面和布局。
    *   `page.tsx`: 主入口文件，渲染 `Assistant` 组件。
    *   `assistant.tsx`: 使用 `useLangGraphRuntime` 配置 `AssistantRuntimeProvider`。它将 UI 与后端 API 函数进行绑定。
    *   `globals.css`: 全局样式和 Tailwind 引入。
*   **`components/`**: 可复用的 UI 组件。
    *   `assistant-ui/`: 聊天界面专用的组件 (Thread, Attachment, Reasoning 等)。
    *   `ui/`: 通用 UI 组件 (Avatar, Button, Dialog 等)。
*   **`lib/`**: 工具函数和 API 封装。
    *   `chatApi.ts`: 处理与 LangGraph SDK 的直接通信 (创建会话线程、获取状态、发送消息)。
*   **`next.config.ts`**: Next.js 配置文件。
*   **`package.json`**: 项目依赖和脚本配置。

## 初始开发规范

*   **样式:** 使用 Tailwind CSS 进行样式设计。
*   **格式化:** 配置了 Prettier 进行代码格式化。运行 `pnpm run prettier` 进行检查，运行 `pnpm run prettier:fix` 进行修复。
*   **Linting:** 使用 ESLint 进行代码质量检查。
*   **状态管理:** 应用依赖 `assistant-ui` 的运行时和 LangGraph 来管理对话状态。
