# TODO: ling-open-studio (InclusionAI Demo)

## 第一阶段：本地环境跑通 (Local Setup) <!-- id: 0 -->
- [ ] **环境配置**：创建 `.env.local` 并配置必要的 API Key (`LANGCHAIN_API_KEY` 等) <!-- id: 1 -->
- [ ] **依赖安装**：运行 `pnpm install` 确保所有库正确安装 <!-- id: 2 -->
- [ ] **启动开发服务器**：运行 `pnpm dev` 并在浏览器验证初始页面渲染 <!-- id: 3 -->

## 第二阶段：Hugging Face 部署流水线 (Deployment Pipeline) <!-- id: 4 -->
- [ ] **配置 Standalone 模式**：在 `next.config.ts` 中开启 `output: 'standalone'` <!-- id: 5 -->
- [ ] **创建部署脚本**：参考 `osw-studio` 实现 `Dockerfile` 和 `server.js` (适配 HF 的 7860 端口) <!-- id: 6 -->
- [ ] **构建产物验证**：在本地运行 `pnpm build` 并尝试用 Docker 运行构建后的产物 <!-- id: 7 -->
- [ ] **HF Space 部署**：在 Hugging Face 创建 Space，配置 Secrets，手动或通过 CI 推送代码并跑通 <!-- id: 8 -->

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
