# 2026-02-07-18-20-开发日志-完成StudioShell重构与UI分层优化

## 1. 背景 (Background)
在完成了 Assistant 后端逻辑的重构后，前端 `app/` 目录下的组件属性（Server vs Client）及其与业务助手的归属关系需要进一步理清。为了遵循 Next.js App Router 的最佳实践，今日对 UI 层级进行了精细化调整。

## 2. 完成的工作 (Accomplishments)

### 2.1 UI Shell 状态提升与重命名
- **移动并重命名**: 将 `app/assistant.tsx` 移动至 `components/studio/studio-shell.tsx`。
- **职责明确**: 将该组件重命名为 `StudioShell`。它作为整个 Studio 的 **UI 总调度器**（客户端组件），负责管理多个 Runtime（Chat/Web）和 Tab 切换逻辑。
- **清理 `app/` 目录**: 现在的 `app/` 目录仅保留路由定义（`page.tsx`）、根结构（`layout.tsx`）和全局样式（`globals.css`），回归了其作为 Next.js “管道”代码的本质。

### 2.2 Studio 相关组件归口
- 建立了 `components/studio/` 目录，统一存放跨助手的全局 Studio 组件：
    - `model-config.tsx` (模型配置侧边栏)
    - `top-navigation.tsx` (主导航栏)
    - `thread-title-automator.tsx` (标题自动命名监听器)
- 这种做法确保了 `components/` 下的子目录（如 `web/`, `assistant-ui/`, `filesystem/`）具有清晰的业务边界。

### 2.3 引用修复
- 更新了 `app/page.tsx`，使其从新路径引入 `StudioShell`。
- 修复了 `StudioShell` 内部对 Moved 组件的相对路径引用。

## 3. 架构分层结果
1.  **Framework Layer (`app/`)**: 纯服务端组件，负责路由与 SEO。
2.  **UI Shell Layer (`components/studio/`)**: 核心客户端组件，负责全局布局与状态调度。
3.  **Assistant Brain Layer (`assistants/`)**: 纯服务端逻辑，包含 LangGraph 与 Tools。
4.  **Business UI Layer (`components/web/` 等)**: 业务专属 UI 模块。

## 4. 后续计划
- **Tool Calling Helper**: 在 `lib/tools/` 开发 Tool 调用支持。
- **VFS Tools**: 实现 Agent 对文件系统的操作能力。
- **WebGen Graph**: 开始编写正式的网页生成流程。
