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
            - [x] **上下文工程与 Boilerplates**：
                - [ ] 创建 `lib/boilerplates/index.ts` 定义 HTML/React 模板
                - [ ] 定义 `Aesthetic Definitions` 美学风格库
                - [x] **新增视觉风格扩展与优化** (Glassmorphism, Flat VTuber, Bento Modern, 29+ Preset Styles) <!-- id: 30 -->
                    - [x] 在 `designs.ts` 中添加风格定义 (含 Flat VTuber 饱和度与装饰优化) <!-- id: 31 -->
                    - [x] 在 `WebConfig` 中集成新图标并适配 UI (修复了 Code 图标导入错误) <!-- id: 32 -->
                    - [x] **集成 29+ 预设风格库 (Select More)**: 实现从 `designprompts.dev` 批量导入并支持跨模型 Prompt 适配。
        - [x] **Graph 逻辑实现 (双 Graph 架构)**：
            - [x] 实现 `InitialGenGraph` (Idea Expander -> Style Director -> Code Generator)
            - [x] 支持预设风格注入逻辑 (Style Director 解释执行模式)
            - [ ] 实现 `RefineGraph` (Editor Node)
    
    - [ ] **全链路集成**：
        - [ ] 在 `WebPreview` 中实现基于 `useVFS` 的 `iframe` 实时渲染
        - [ ] 实现 Graph 路由逻辑 (Initial vs Refine)
- [ ] **Model Write (辅助写作) 内容填充**： <!-- id: 16 -->
    - 集成编辑器与灵感推荐卡片

## Debug & Tracing
- [x] 实现 `lib/model-tracer.ts` 封装模型调用日志输出 (服务端已实现)
- [x] 在 `assistants/general-chat/graph.ts` 中应用 `tracedInvoke`
- [x] 验证服务端控制台原始上下文日志输出
- [ ] ~~集成 `dispatchCustomEvent` 将日志传输至前端 ContextViewer~~ (已放弃，转向工具调用)

## 工具调用 (Tool Calling)
- [x] 扩展 `lib/store.ts` 增加 `enabledTools` 和 `toolParadigm` 状态
- [x] 修改 `ModelConfig` UI，增加工具开关与范式选择
- [x] 重构工具定义为简化结构 (`lib/tools/index.ts`)
- [x] 实现 `ToolContextDef` 范式策略 (JSON/XML)
- [x] 在 `app/api/chat/route.ts` 中集成 `ToolContextBuilder` 动态注入系统提示词
- [x] 实现前端 `ToolCallRenderer` 拦截并渲染 JSON/XML 调用块
- [x] 实现 `browser_js_eval` 工具在前端的执行逻辑 (修复了结果展示问题)
- [x] 实现 VFS 工具 (list/read/write) 在前端的执行逻辑 (修复了数据库初始化报错)
    - [x] 实现半自动 Loop 结果回填逻辑 (将结果作为 User 消息发送)

## 第五阶段：Model Write (写作助手) 核心实现 <!-- id: 26 -->
- [x] **UI 架构复刻与重构**： <!-- id: 27 -->
    - [x] 恢复 `badge.tsx` 等 UI 组件并优化视觉风格
    - [x] 实现 `WriteLeftSidebar` (书名、大纲管理) <!-- id: 33 -->
    - [x] 实现 `WriteCanvas` (基于段落的片段化编辑器内核) <!-- id: 34 -->
    - [x] 实现 `Knowledge Base` (模块化 UI、Store 及双栏编辑 Dialog) <!-- id: 35 -->
- [x] **智能体驱动与后端闭环**： <!-- id: 28 -->
    - [x] **SegmentPreprocessor**: 实现段落摘要与实体自动提取 <!-- id: 36 -->
    - [x] **PhantomWeaver**: 实现 500ms 停顿触发的行内续写 (Ghost Text) <!-- id: 37 -->
    - [x] **LoreKeeper**: 实现知识库条目自动发现与画像生成 (二段式转正) <!-- id: 38 -->
    - [x] **全链路联调**: 实现 `/api/chat/write/precompute` 和 `/api/chat/write/predict` 接口 <!-- id: 39 -->
- [x] **叙事流与创作产出 (NarrativeFlow)**： <!-- id: 29 -->
    - [x] 实现 `WriteRightSidebar` 基础布局与动作按钮 <!-- id: 40 -->
    - [x] 实现 `NarrativeFlow` Graph (Ling_2_5_1T 流式创作) <!-- id: 41 -->
    - [x] 实现 "/api/chat/write/generate" 接口并支持段落回填 <!-- id: 42 -->
- [x] **灵感与辅助工具 (MuseWhisper & Tools)**： <!-- id: 43 -->
    - [x] 实现 `MuseWhisper` Graph (生成 Plot/Atmosphere/Dialogue 灵感卡片) <!-- id: 44 -->
    - [x] 实现灵感卡片激活逻辑及其对续写指令的注入 <!-- id: 45 -->
    - [x] 实现 `Selection Tools` (选中文字后的 Rewrite/Expand/Refine) <!-- id: 46 -->
    - [x] 优化 `WriteStatusViewer` 支持全局 Log 预览与全量状态对接 <!-- id: 47 -->

## 核心功能 (ModelWeb) <!-- id: 17 -->
- [x] **多模型配置支持** (设计模型 vs 代码模型，修复了 API 透传与类型错误)
- [ ] **性能优化**：针对移动端进行适配，优化代码生成产物的渲染速度 <!-- id: 18 -->
- [ ] **最终测试**：进行全流程的功能回归测试 <!-- id: 19 -->
