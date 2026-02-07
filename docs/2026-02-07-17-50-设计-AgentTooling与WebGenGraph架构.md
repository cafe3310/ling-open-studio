# 设计 - Agent Tooling 与 WebGen Graph 架构

## 1. 背景
目前 `ling-open-studio` 已具备完善的前端 UI 和基础 VFS 能力。为了让 Agent 能够真正操作文件系统并生成网页，我们需要构建一套工具链（Tooling System）和编排逻辑（Graph）。

## 2. 工具链设计 (Tooling Architecture)

### 2.1 目标
在浏览器端（Local-First）或服务端环境中，提供一套标准化的接口，使 Agent 能够：
1.  **感知**: 知道有哪些工具可用（Schema 定义）。
2.  **操作**: 执行具体动作（如写文件、读文件）。
3.  **反馈**: 获取操作结果。

### 2.2 Tool Helpers (`lib/tools/`)
我们需要开发一套 Helper Library 来简化 Tool 的定义和解析。由于我们使用 LangChain/LangGraph，我们将复用其标准 Tool 接口，但针对我们的 VFS 进行适配。

*   **`createVFSTool`**: 一个工厂函数，用于将 VFS 的 API (`writeFile`, `readFile`) 包装成 LangChain 可识别的 `DynamicStructuredTool`。
*   **工具清单**:
    *   `vfs_write_file`: 写入文件（支持文本/代码）。
    *   `vfs_read_file`: 读取文件内容。
    *   `vfs_list_dir`: 列出目录结构。
    *   `vfs_delete_item`: 删除文件或目录。

## 3. WebGen Graph 设计 (Web Generation Orchestrator)

为了实现“初次生成”和“后续迭代”的区分，我们将设计两个协同工作的 Graph。

### 3.1 路由架构 (`MainRouter`)
在后端 (`/api/chat`)，根据前端传来的 `config.mode` 进行路由分发：
*   `mode: 'chat'` -> `SimpleGraph` (通用对话)
*   `mode: 'web-gen'` -> `WebGenRouter` (网页生成)

### 3.2 网页生成子图 (`WebGenRouter`)
该 Router 负责维护网页生成的长期状态（`taskId`），并根据当前状态决定进入哪个子流程：

#### A. Initial Generation Graph (初次生成)
*   **触发条件**: 用户首次请求生成，或显式要求“重新开始”。
*   **流程**:
    1.  **Analyst**: 分析用户 Prompt，拆解为 `requirements.md`。
    2.  **Designer**: 输出 `design-system.json` (颜色、字体)。
    3.  **Scaffolder**: 创建目录结构 (`index.html`, `style.css`)。
    4.  **Coder**: 并行或串行编写具体代码。
*   **产物**: `/workspace/webapp/<taskId>/` 下的完整代码。

#### B. Refinement Graph (后续迭代)
*   **触发条件**: 针对已有 `taskId` 的后续对话。
*   **流程**:
    1.  **Inspector**: 读取当前 VFS 中的相关代码。
    2.  **Planner**: 决定修改策略（改哪个文件，怎么改）。
    3.  **Coder**: 调用 `vfs_write_file` 覆盖更新。

## 4. 实施计划 (TODO)

### Phase 1: Tooling Infrastructure
- [ ] **Tool Helper**: 实现 `lib/tools/vfs-tools.ts`，封装 VFS 操作。
- [ ] **Schema Definition**: 定义工具的 Zod Schema，确保 LLM 输出参数准确。

### Phase 2: Graph Logic
- [ ] **Router Node**: 实现根据 `config.mode` 分发请求的逻辑。
- [ ] **State Schema**: 定义 `WebGenState`，包含 `taskId`、`requirements` 等字段。
- [ ] **Initial Graph**: 实现 Analyst -> Coder 的简单链路。
- [ ] **Refine Graph**: 实现读取 -> 修改链路。

### Phase 3: Integration
- [ ] **API Endpoint**: 更新 `/api/chat/route.ts` 以支持新的 Graph。
- [ ] **UI Integration**: 确保 WebTab 的请求能正确触发 WebGen Graph。
