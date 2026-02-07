# 设计 - Agent Tooling 与 WebGen Graph 架构 (更新版)

## 1. 背景
在完成“助手中心化”架构重构后，项目已具备清晰的逻辑分层。为了让 `Web Architect` 能够真正操作文件系统并生成网页，我们需要构建一套工具链（Tooling System）和编排逻辑（Graph）。

## 2. 工具链设计 (Tooling Architecture)

### 2.1 目标
在浏览器端（Local-First）环境中，提供一套标准化的接口，使 Agent 能够：
1.  **感知**: 知道有哪些工具可用（Schema 定义）。
2.  **操作**: 执行具体动作（如写文件、读文件）。
3.  **反馈**: 获取操作结果。

### 2.2 Tool Helpers (`lib/tools/`)
我们需要开发一套 Helper Library 来简化 Tool 的定义。我们将复用 LangChain 的标准 Tool 接口，但针对我们的 VFS 进行适配。

*   **`lib/tools/vfs-tools.ts`**: 
    *   `vfs_write_file`: 写入文件（支持文本/代码）。
    *   `vfs_read_file`: 读取文件内容。
    *   `vfs_list_dir`: 列出目录结构。
    *   `vfs_delete_item`: 删除文件或目录。

## 3. WebGen Graph 设计 (Web Generation Orchestrator)

为了实现“初次生成”和“后续迭代”的区分，我们将在 `assistants/web-architect/` 下设计协同工作的 Graph。

### 3.1 路由架构 (`assistants/registry.ts`)
在后端，根据前端传来的 `config.mode` 进行路由分发：
*   `mode: 'chat'` -> `assistants/general-chat/graph.ts`
*   `mode: 'web-gen'` -> `assistants/web-architect/` 下的逻辑

### 3.2 网页生成子图架构
`Web Architect` 将包含以下关键组件：

#### A. Initial Generation Graph (`initial-gen.ts`)
*   **触发条件**: `taskId` 为空或用户要求“新建项目”。
*   **流程**:
    1.  **Analyst**: 分析用户 Prompt，确定页面结构。
    2.  **Scaffolder**: 创建基础文件 (`index.html`, `styles.css`)。
    3.  **Coder**: 生成高质量 HTML/Tailwind 代码。
*   **产物**: 存储于 VFS 的 `/workspace/webapp/<taskId>/` 目录下。

#### B. Refinement Graph (`refine-gen.ts`)
*   **触发条件**: 针对已有 `taskId` 的修改建议。
*   **流程**:
    1.  **Inspector**: 使用 `vfs_read_file` 读取当前代码。
    2.  **Planner**: 分析修改点。
    3.  **Coder**: 执行局部或全量更新。

## 4. 实施计划 (TODO)

### Phase 1: Tooling Infrastructure
- [ ] **VFS Tools**: 实现 `lib/tools/vfs-tools.ts`。
- [ ] **Schema Definition**: 使用 Zod 定义工具参数。

### Phase 2: WebGen Graph Logic
- [ ] **State Definition**: 定义 `WebGenState` (包含 `taskId`, `files`, `requirements`)。
- [ ] **Initial Implementation**: 实现基础的生成逻辑。
- [ ] **Refine Implementation**: 实现基于现有文件的修改逻辑。

### Phase 3: Integration
- [ ] **Registry Update**: 将新 Graph 注册到 `assistants/registry.ts`。
- [ ] **VFS Persistence**: 确保 Agent 写入的是 `threadId="global"` 或特定任务隔离的存储。