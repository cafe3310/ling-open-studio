# Ling OpenStudio (非官方 Playground)

欢迎来到 **Ling OpenStudio**，这是一个专为 **Ling 系列 LLM** 设计的开源交互式 Playground。

[English](./README.md)

> [!IMPORTANT]
> 这是一个在 Hugging Face 上托管的**临时非官方**社区驱动项目，主要面向非中文用户。它为我们验证模型各项能力的产品 Demo 提供了一个基座。
>
> 当前状态非常早期且草率。如果您希望获得稳定且专业的试用体验，建议访问官方网站：**[https://www.ant-ling.com/](https://www.ant-ling.com/)**。

## 🚀 愿景与路线图

除了基础对话，本项目旨在探索 Ling 模型的边界：
- **智能体文件系统 (Agentic FS)**：集成基于浏览器的虚拟文件系统 (Virtual FS)，支持 Agent 技能与复杂的文件操作。
- **多模态对接**：未来可能加入对多模态能力的支持，包括语音（类似 VoiceVox 的对接）和视觉。
- **深度协同**：在网页开发和创意写作等专业领域，将 AI 从“工具”提升为“共创者”。

## 🛠 功能模块 (模型能力验证)

| 功能 | 验证目标 |
| :--- | :--- |
| **Model Chat** | 验证基础推理、指令遵循以及多语言支持。 |
| **Model Web** (网页架构师) | 验证复杂代码生成、UI/UX 推理以及结构化输出。 |
| **Model Write** (写作助手) | 验证创意写作、长上下文一致性以及极速行内预测 (Ghost Text)。 |

## 🐞 问题反馈

如果您发现任何问题或有建议，欢迎提交 **Issue**。我会查看这些反馈（但不一定能及时响应）。

## 🏗 技术栈

- **框架**: Next.js 16 (App Router)
- **Agent 编排**: [LangGraph](https://langchain-ai.github.io/langgraph/)
- **UI 组件**: [assistant-ui](https://github.com/Yonom/assistant-ui), Tailwind CSS 4, Radix UI
- **运行时**: 浏览器端虚拟文件系统 (IndexedDB)

---
*由 Ling 社区为全球用户打造。*
