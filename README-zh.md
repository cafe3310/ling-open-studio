Ling OpenStudio 是一个专为快速验证 Ling 系列 LLM 在真实场景中能力设计的交互式 Playground 基座。

[English](./README.md)

> [!IMPORTANT]
> 这是一个在 Hugging Face Spaces 上托管的的非官方项目，主要面向非中文用户。它为我们验证模型各项能力的产品 Demo 提供了一个基座。
> 
> 你可以在 Hugging Face 上访问： [Hugging Face Spaces: Ling OpenStudio](https://huggingface.co/spaces/cafe3310/ling-open-studio)。
>
> 当前状态非常早期且粗糙。如果希望获得稳定且专业的试用体验，建议访问官方网站：**[https://www.ant-ling.com/](https://www.ant-ling.com/)**。

题外话：我打算在 Spaces 上放一个「这玩意挂了」的按钮，点一下就开 issue...

## 当前功能

当前版本包含三个主要的验证场景：

- **Model Chat**：验证基础推理、各种 pattern 的指令遵循和工具调用。
- **Model Web**（网页架构师）：验证复杂代码生成、UI/UX 推理，设计能力，以及结构化输出。
- **Model Write**（写作助手）：验证创意写作、长上下文一致性以及快速行内预测。

也包含一些辅助机制：

- **Virtural File System**：一个基于 IndexedDB 的浏览器端虚拟文件系统，供 Agent 在对话中读写。
- **多种 Tool Calling 范式**：包括各种不同格式的工具调用（JSON, XML, Markdown，也会包括 API 上的 `tools`），以观察模型对不同格式的适应能力。

## 后续计划

后续可能会增加这些部分：

- 搜索和 Grounding：验证模型在需要外部知识时的检索和信息整合能力。
- 学习助手：你想学点儿啥？模型给你找资料、总结、出题、讲解，验证模型在教学和学习辅助方面的能力。
- 图像生成与编辑：验证 Ming-Omni 在视觉理解和生成方面的能力。
- 播客编辑器：类似 VoiceVox 的语音合成与编辑，验证 Ming-Omni 在语音处理方面的能力。
- Agent Skills Coding Playground：上传目录并集成超轻量级 Coding Agent，验证模型在更复杂代码理解和生成方面的能力。
- 类似 nanobot 的对接能力：在浏览器里创建一个基于 Ling Series 模型的 nanobot。

## 问题反馈

任何问题或有建议都可以 [提交 Issue](https://github.com/cafe3310/ling-open-studio/issues/new) ，我会查看这些反馈（但不一定能及时响应）。

## Agent Skill

这个项目使用的 Agent Skill 都在 [cafe3310's Public Agent Skills](https://github.com/cafe3310/public-agent-skills) 这个仓库里。感兴趣的话可以试试看，比如 `doc-todo-log-loop`。

## 技术栈

- **框架**: Next.js 16 (App Router)
- **Agent 编排**: [LangGraph](https://langchain-ai.github.io/langgraph/)
- **UI 组件**: [assistant-ui](https://github.com/Yonom/assistant-ui), Tailwind CSS 4, Radix UI
- **运行时**: 浏览器端虚拟文件系统 (IndexedDB)
