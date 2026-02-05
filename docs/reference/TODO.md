# TODO

## 第一阶段：技术分析 (Analysis)
- [x] **整体架构分析** <!-- id: 0 -->
    - [x] 1. 确认使用的库、UI 框架 (Tailwind/Radix/Monaco) 和存储方案 (IndexedDB vs SQLite)
    - [x] 2. 定位 LLM API 对接代码与实现方式 (`lib/llm`, `app/api/generate`)
    - [x] 3. 梳理所有页面路由 (`app/*`) 和 API 路由 (`app/api/*`)
    - [x] 4. 分析上下文管理与 Skills 实现 (是否使用 LangChain? 代码位置?)
- [x] **构建与部署分析** <!-- id: 1 -->
    - [x] 5. 分析构建流程与产物 (Next.js Standalone mode)
    - [x] 6. 分析 GitHub 到 Hugging Face 的同步与部署机制 (确认为 Standalone 产物同步模式)

## 第二阶段：新 Demo 特性设计 (Iterative Design)
- [ ] **核心目标与定位确认** <!-- id: 4 -->
- [ ] **功能特性讨论与定义** (逐步产出特性清单) <!-- id: 5 -->
- [ ] **UI/UX 方案设计** (交互模式与视觉风格) <!-- id: 6 -->
- [ ] **技术方案剪裁** (基于 OSW 架构决定保留/删除哪些模块) <!-- id: 7 -->
- [ ] **产出完整的设计文档 (Blueprint)** <!-- id: 8 -->

## 第三阶段：开发与部署 (Implementation)
- [ ] 搭建新项目的工程基础 (基于 standalone 模式) <!-- id: 9 -->
- [ ] 实现核心 LLM 调用逻辑 <!-- id: 10 -->
- [ ] 适配 Hugging Face 部署环境 (Dockerfile & server.js) <!-- id: 11 -->
- [ ] 最终测试与交付 <!-- id: 12 -->