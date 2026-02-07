# ling-open-studio

## 项目概述

`ling-open-studio` 是一个专为 "ling 系列 LLM" 设计的一站式 Playground 应用。

它是一个将 [assistant-ui](https://github.com/Yonom/assistant-ui) 与 [LangGraph](https://langchain-ai.github.io/langgraph/) 集成的项目。

该应用提供了一个基于 React 和 Next.js 构建的现代多 Tab 聊天界面（Chat, Web, Write），并通过 LangGraph 后端来管理 Agent 的状态和执行。

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

### 技术栈

*   **框架:** Next.js 16 (App Router) - Standalone 输出模式
*   **语言:** TypeScript
*   **UI 组件:** React 19, Tailwind CSS 4, Radix UI, Shadcn UI
*   **AI/聊天接口:** `@assistant-ui/react`, `@assistant-ui/react-ai-sdk`, `@assistant-ui/react-langgraph`
*   **Agent 编排:** `@langchain/langgraph` (Local Graph Definition)
*   **存储:** IndexedDB (浏览器端 VFS)

## 构建与运行

### 前置要求

确保已安装 Node.js 和 pnpm。

### 环境配置

在根目录下创建一个 `.env.local` 文件，并添加以下配置项：

```env
OPENAI_API_KEY=your_openai_compatible_api_key
OPENAI_API_BASE=your_api_endpoint
```

### 脚本命令

*   **安装依赖:** `pnpm install`
*   **启动开发服务器:** `pnpm run dev` (运行于 `http://localhost:3000`)
*   **生产环境构建:** `pnpm run build`
*   **启动生产服务器:** `pnpm run start`
*   **代码 Lint 检查:** `pnpm run lint`
*   **代码格式化:** `pnpm run prettier:fix`

## 项目结构与关键文件

本项目采用“以助手为中心”的垂直切分架构：

*   **`app/`**: Next.js 路由层 (Server Components)。仅负责路由分发和基础布局。
    *   `page.tsx`: 主入口，渲染 `StudioShell`。
    *   `layout.tsx`: 全局根布局。
*   **`assistants/`**: 业务助手层 (Server Logic)。
    *   `registry.ts`: 助手注册表，根据请求模式路由到不同的 Graph。
    *   `general-chat/`: 通用对话助手逻辑。
    *   `web-architect/`: 网页生成助手逻辑。
    *   `naming/`: 标题自动命名逻辑。
*   **`components/`**: UI 组件层 (Client Components)。
    *   `studio/`: 全局 Studio 框架组件（`StudioShell`, `TopNavigation`, `ModelConfig`）。
    *   `web/`: Model Web 专属 UI 模块。
    *   `assistant-ui/`: 聊天界面基础组件。
    *   `filesystem/`: 虚拟文件系统可视化组件。
*   **`lib/`**: 共享基础设施。
    *   `vfs/`: 浏览器端虚拟文件系统核心。
    *   `tools/`: Agent Tool 调用解析与 VFS 工具集。
    *   `assistant-utils/`: 推理过程解析等通用助手工具。
    *   `model.ts`: 模型工厂配置。

## 开发规范

*   **样式:** 使用 Tailwind CSS v4。
*   **状态管理:** 前端使用 Zustand (`lib/store.ts`) 管理模型参数，后端依赖 LangGraph 状态机。
*   **隔离性:** 不同 Tab 使用独立的 `AssistantRuntime` 实例，通过 `StudioShell` 统一调度。
*   **持久化:** 所有生成的文件均存储在浏览器 IndexedDB 中，支持跨会话访问。