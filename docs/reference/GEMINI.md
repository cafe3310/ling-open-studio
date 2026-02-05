# Gemini 上下文指南 (OSW Studio)

## 项目章程
**工作模式：** 严格遵循 `doc-todo-log-loop` 技能的工作流。
**工作目录：** 所有开发日志和设计文档存放在 `worklog/` 目录（注意：不要使用项目自带的 `docs/` 目录）。
**主要目标：**
1.  分析本项目 (`osw-studio`) 的技术栈和部署方案。
2.  开发一个类似的项目，用于团队在 Hugging Face 上演示语言模型。

## 项目概述
**OSW Studio (Open Source Web Studio)** 是一个 AI 驱动的开发平台，允许用户通过自然语言对话构建和维护网站。

*   **核心概念：** 一个“代理 AI (Agentic AI)”在虚拟文件系统中运行，根据用户提示生成代码、管理文件并构建静态网站。
*   **双模式：**
    *   **浏览器模式 (默认)：** 完全在客户端运行，使用 IndexedDB。网站导出为 ZIP 文件。无需后端。
    *   **服务器模式：** 通过 `NEXT_PUBLIC_SERVER_MODE=true` 激活。增加 SQLite 持久化、后台管理认证、网站发布、Edge Functions 和分析功能。
*   **目标受众：** 开发者（快速原型设计）、非技术用户（网站维护）和团队（通过服务器模式）。

## 技术栈
*   **框架：** Next.js 15 (App Router)
*   **语言：** TypeScript
*   **样式：** Tailwind CSS v4, Radix UI Primitives
*   **编辑器：** Monaco Editor (@monaco-editor/react)
*   **状态/查询：** TanStack Query
*   **数据库 (服务器模式)：** Better SQLite3
*   **模板：** Handlebars
*   **AI 集成：** 多供应商支持 (OpenAI, Anthropic, Google, Ollama 等)，位于 `lib/llm`

## 关键指令
*   **开发：** `npm run dev` (启动于 http://localhost:3000)
*   **构建：** `npm run build`
*   **启动：** `npm run start`
*   **Lint：** `npm run lint`
*   *注意：未检测到显式的测试脚本。内部测试可能使用 `app/test-generation/`。*

## 项目结构
*   `app/`: Next.js App Router 页面和 API 路由。
    *   `page.tsx`: 入口点。渲染 `StudioApp` (浏览器模式) 或重定向到 `/admin` (服务器模式)。
    *   `admin/`: 服务器模式后台管理界面。
    *   `api/`: 后端 API 路由 (认证, 分析, 代理)。
*   `components/`: React UI 组件。
    *   `studio-app/`: 主应用程序外壳。
    *   `editor/`: Monaco 编辑器集成。
    *   `preview/`: 实时网站预览。
    *   `chat-panel/`: AI 交互界面。
*   `lib/`: 核心逻辑和工具。
    *   `vfs/`: 虚拟文件系统实现 (IndexedDB/InMemory)。
    *   `llm/`: AI 编排、工具执行和供应商适配器。
    *   `compiler/`: 代码编译逻辑。
*   `docs/`: 全面的项目文档。
*   `public/`: 静态资源。

## 开发规范
*   **路径别名：** 使用 `@/*` 映射到项目根目录 (例如 `import { ... } from '@/lib/utils'`)。
*   **React：** 使用 Hooks 的函数式组件。客户端组件需显式标记 `'use client'`。
*   **样式：** 优先使用 Tailwind 工具类，而非自定义 CSS。
*   **服务器模式感知：** 代码通常检查 `process.env.NEXT_PUBLIC_SERVER_MODE` 以有条件地渲染功能或重定向。
*   **AI 工具：** 代理使用定义在 `lib/llm` 中的特定工具 (`shell`, `json_patch`, `evaluation`)。修改这些工具会影响 AI 构建网站的方式。

## 重要文档
*   `docs/README.md`: 主文档中心。
*   `docs/SERVER_MODE.md`: 关于自托管和服务器功能的详细信息。
*   `docs/SKILLS.md`: 关于用于自定义 AI 行为的“技能 (Skills)”系统的信息。

## 部署上下文 (Hugging Face)
*   **同级目录：** `../osw-studio-hf` 是 Hugging Face Spaces 的部署仓库。
*   **构建类型：** 这是一个 Next.js "standalone" 构建产物。
*   **关键文件：**
    *   `Dockerfile`: 定义了基于 `node:20-alpine` 的运行环境，端口 `7860`。
    *   `server.js`: 自定义入口脚本，用于启动 Next.js 独立服务器。
    *   `README.md`: 包含 Hugging Face 元数据 (YAML frontmatter)。
*   **用途：** 用于将预构建的应用推送到 HF Spaces，而不是直接部署源码。
