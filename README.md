# Ling OpenStudio (Unofficial Playground)

[[中文]](./README-zh.md)

Welcome to **Ling OpenStudio**, an open-source, interactive playground designed for the **Ling series LLMs**. 

> [!IMPORTANT]
> This is a **temporarily unofficial** community-driven project hosted on Hugging Face, primarily targeting non-Chinese users. It serves as a base for product demos to verify various model capabilities.
>
> The project is currently in a **very early and experimental (even "sloppy") state**. For a professional and stable experience, please visit the official website: **[https://www.ant-ling.com/](https://www.ant-ling.com/)**.

## 🚀 Vision & Roadmap

Beyond basic chat, this studio aims to explore the boundaries of Ling models:
- **Agentic File System**: Integrating browser-based Virtual FS for agent skills and complex file operations.
- **Multi-modal Integration**: Future support for multi-modal capabilities, including voice (e.g., VoiceVox-like integration) and vision.
- **Deep Collaboration**: Moving from "AI as a tool" to "AI as a co-creator" in specialized domains like web development and creative writing.

## 🛠 Features (Capability Verification)

| Feature | Verification Goal |
| :--- | :--- |
| **Model Chat** | Verifies base reasoning, instruction following, and multilingual support. |
| **Model Web** (Web Architect) | Verifies complex code generation, UI/UX reasoning, and structured output. |
| **Model Write** (Write Architect) | Verifies creative writing, long-context consistency, and ultra-fast latent prediction (Ghost Text). |

## 🐞 Issues & Feedback

Feel free to submit an **Issue** if you encounter any bugs or have suggestions. While I will review them, please understand that response times may vary and might not be immediate.

## 🏗 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Agent Orchestration**: [LangGraph](https://langchain-ai.github.io/langgraph/)
- **UI Components**: [assistant-ui](https://github.com/Yonom/assistant-ui), Tailwind CSS 4, Radix UI
- **Runtime**: Browser-side VFS (IndexedDB)

---
*Created by the Ling community for the world.*
