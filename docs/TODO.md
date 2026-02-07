# TODO: ling-open-studio (InclusionAI Demo)

## 第一阶段：本地环境跑通 (Local Setup) <!-- id: 0 -->
- [x] **环境配置**：创建 `.env.local` 并配置必要的 API Key (`LANGCHAIN_API_KEY` 等) <!-- id: 1 -->
- [x] **依赖安装**：运行 `pnpm install` 确保所有库正确安装 <!-- id: 2 -->
- [x] **启动开发服务器**：运行 `pnpm dev` 并在浏览器验证初始页面渲染 <!-- id: 3 -->

## 第二阶段：Hugging Face 部署流水线 (Deployment Pipeline) <!-- id: 4 -->
- [x] **配置 Standalone 模式**：在 `next.config.ts` 中开启 `output: 'standalone'` <!-- id: 5 -->
- [x] **创建部署 Dockerfile**：新建 `Dockerfile.hf`，编写基于 copy 模式的运行配置 (适配 7860 端口, 非 root 用户) <!-- id: 6 -->
- [x] **本地构建验证**： <!-- id: 7 -->
    - 执行 `pnpm build`
    - 整理 standalone 产物 (复制 public, .next/static)
    - 使用 `docker build -f Dockerfile.hf` 验证镜像能否启动
- [x] **GitHub Actions 配置**：编写 `.github/workflows/deploy.yml` 实现自动构建并推送到 HF Space <!-- id: 8 -->
- [x] **HF Space 初始化**：(用户操作) 在 Hugging Face 创建 Space 并配置 Secrets <!-- id: 20 -->

## 第三阶段：核心架构与 LangGraph 对接 (Core Architecture & LangGraph) <!-- id: 9 -->
- [x] **多 Tab 切换架构实现**： <!-- id: 10 -->
    - 在主界面实现 Chat, Web, Write 三个 Tab 的切换逻辑
    - 除 Chat Tab 外，其余 Tab 暂时留空（显示 Placeholder）
- [x] **LangGraph Chat 对接**： <!-- id: 12 -->
    - 参考 `ling-model-judge` 实现简单的 LangGraph 适配器
    - 在第一个 Tab (Chat) 中跑通基于 LangGraph 的基础对话流程
- [x] **视觉系统集成 (Open Intelligence)**： <!-- id: 11 -->
    - 在功能跑通后，引入 `brand-bg`, `brand-dark` 等色彩定义
    - 配置 Playfair Display 等字体并应用到全局 Layout

## 第四阶段：功能细节完善 (Feature Refinement) <!-- id: 13 -->
- [x] **模型参数绑定 (Model Config Binding)**： <!-- id: 21 -->
    - 创建 Zustand Store 管理模型参数
    - 实现 Model Config 面板的参数绑定与首条消息后禁用逻辑
    - 更新后端以支持动态模型选择与 System Prompt 注入
- [ ] **消息状态行 (Message Status Line)**： (由于元数据透传技术限制，暂时回退) <!-- id: 22 -->
    - 在消息顶部增加显示 `[model_name] [latency]` 的状态行
- [x] **思考过程 (Reasoning) 支持**： <!-- id: 23 -->
    - 实现 `ReasoningSplitter` 解析 `<think>` 标签
    - 集成 `assistant-ui` 的 `Reasoning` 组件展示思考流
- [x] **Chat 线程自动命名 (Auto-Naming)**： <!-- id: 24 -->
    - 实现 `chat_name_generator` Graph (Ling-Mini)
    - 实现 `/api/naming` 接口
    - 前端集成：首轮对话后触发，显示 "Naming..." 并更新标题
- [x] **浏览器端虚拟文件系统 (Browser VFS)**： <!-- id: 25 -->
    - [x] 实现 `lib/vfs/database.ts` (IndexedDB 包装)
    - [x] 实现 `lib/vfs/index.ts` (VFS 核心逻辑)
    - [x] 提供 `useVFS` Hook 供前端使用
    - [x] **Filesystem UI 交互功能**：实现文件/文件夹增删改查、上传下载及详情查看
- [ ] **Model Web (网页生成) 内容填充**： <!-- id: 15 -->
    - [x] **静态 UI 框架**：实现 Chat/Preview/Config 三栏布局与交互
    - [x] **Agent Tooling**：封装 VFS 操作为 LangChain Tools (`vfs_write_file` 等)
    - [x] **Graph 逻辑**：实现 `WebGenGraph` (Initial Gen & Refine)
    - [ ] **全链路集成**：对接 Graph 与 UI，实现端到端生成预览
- [ ] **Model Write (辅助写作) 内容填充**： <!-- id: 16 -->
    - 集成编辑器与灵感推荐卡片

## Debug & Tracing
- [ ] 实现 `lib/model-tracer.ts` 封装模型调用日志输出
- [ ] 在 `assistants/general-chat/graph.ts` 中应用 `tracedInvoke`
- [ ] 验证服务端控制台原始上下文日志输出
- [ ] (后续) 集成 `dispatchCustomEvent` 将日志传输至前端 ContextViewer

## 核心功能 (ModelWeb) <!-- id: 17 -->
- [ ] **性能优化**：针对移动端进行适配，优化代码生成产物的渲染速度 <!-- id: 18 -->
- [ ] **最终测试**：进行全流程的功能回归测试 <!-- id: 19 -->
