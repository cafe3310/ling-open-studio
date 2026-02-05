# TODO: ling-open-studio (InclusionAI Demo)

## 第一阶段：本地环境跑通 (Local Setup) <!-- id: 0 -->
- [x] **环境配置**：创建 `.env.local` 并配置必要的 API Key (`LANGCHAIN_API_KEY` 等) <!-- id: 1 -->
- [x] **依赖安装**：运行 `pnpm install` 确保所有库正确安装 <!-- id: 2 -->
- [x] **启动开发服务器**：运行 `pnpm dev` 并在浏览器验证初始页面渲染 <!-- id: 3 -->

## 第二阶段：Hugging Face 部署流水线 (Deployment Pipeline) <!-- id: 4 -->
- [ ] **配置 Standalone 模式**：在 `next.config.ts` 中开启 `output: 'standalone'` <!-- id: 5 -->
- [ ] **创建部署 Dockerfile**：新建 `Dockerfile.hf`，编写基于 copy 模式的运行配置 (适配 7860 端口, 非 root 用户) <!-- id: 6 -->
- [x] **本地构建验证**： <!-- id: 7 -->
    - 执行 `pnpm build`
    - 整理 standalone 产物 (复制 public, .next/static)
    - 使用 `docker build -f Dockerfile.hf` 验证镜像能否启动
- [ ] **GitHub Actions 配置**：编写 `.github/workflows/deploy.yml` 实现自动构建并推送到 HF Space <!-- id: 8 -->
- [ ] **HF Space 初始化**：(用户操作) 在 Hugging Face 创建 Space 并配置 Secrets <!-- id: 20 -->

## 第三阶段：视觉规范与基础设施 (Infrastructure & Design) <!-- id: 9 -->
- [ ] **集成设计系统**：配置 Tailwind 4，引入 `InclusionAI` 的色彩、字体和组件样式 <!-- id: 10 -->
- [ ] **重构全局布局 (Layout)**：实现支持双侧边栏的响应式布局框架 <!-- id: 11 -->
- [ ] **LangGraph 后端接入**：在 `/api/graph/[_path]` 路由中实现与 LangGraph 的状态同步逻辑 <!-- id: 12 -->

## 第四阶段：核心功能模块实现 (Feature Implementation) <!-- id: 13 -->
- [ ] **Model Chat (基础对话)**： <!-- id: 14 -->
    - 实现历史记录列表、消息流式展示、模型参数调节面板
- [ ] **Model Web (网页生成)**： <!-- id: 15 -->
    - 实现代码生成对话区、实时 HTML/React 预览组件
- [ ] **Model Write (辅助写作)**： <!-- id: 16 -->
    - 集成编辑器、实现后台实体提取任务、开发灵感推荐卡片组件

## 第五阶段：优化与交付 (Polishing) <!-- id: 17 -->
- [ ] **性能优化**：针对移动端进行适配，优化代码生成产物的渲染速度 <!-- id: 18 -->
- [ ] **最终测试**：进行全流程的功能回归测试 <!-- id: 19 -->
