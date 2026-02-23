# Ling OpenStudio

**Ling OpenStudio** is an interactive playground base designed to rapidly verify the capabilities of the **Ling series LLMs** in real-world scenarios.

[[中文]](./README-zh.md)

> [!IMPORTANT]
> This is an unofficial project hosted on Hugging Face Spaces, primarily targeting non-Chinese users. It serves as a foundation for product demos to verify various model capabilities.
> 
> You can access it on Hugging Face: **[Hugging Face Spaces: Ling OpenStudio](https://huggingface.co/spaces/cafe3310/ling-open-studio)**.
>
> The project is currently in a **very early and experimental state**. For a stable and professional experience, please visit the official website: **[https://www.ant-ling.com/](https://www.ant-ling.com/)**.

*Aside: I'm planning to add a "This thing is broken" button on Spaces that opens an issue with one click...*

## Current Features

The current version includes three main verification scenarios:

- **Model Chat**: Verifies base reasoning, instruction following across various patterns, and tool calling.
- **Model Web** (Web Architect): Verifies complex code generation, UI/UX reasoning, design capabilities, and structured output.
- **Model Write** (Write Architect): Verifies creative writing, long-context consistency, and fast inline prediction.

It also includes helper mechanisms:

- **Virtual File System**: An IndexedDB-based browser-side virtual file system for Agents to read and write during conversations.
- **Multiple Tool Calling Paradigms**: Supports various tool calling formats (JSON, XML, Markdown, and standard API `tools`) to observe the model's adaptability to different formats.

## Future Plans

The following features may be added in the future:

- **Search & Grounding**: Verifying the model's retrieval and information integration capabilities when external knowledge is required.
- **Learning Assistant**: Want to learn something? The model finds materials, summarizes, generates quizzes, and explains concepts, verifying its teaching and learning assistance capabilities.
- **Image Generation & Editing**: Verifying Ming-Omni's capabilities in visual understanding and generation.
- **Podcast Editor**: TTS and editing (similar to VoiceVox) to verify Ming-Omni's audio processing capabilities.
- **Agent Skills Coding Playground**: Uploading directories and integrating an ultra-lightweight Coding Agent to verify the model's capabilities in complex code understanding and generation.
- **Nanobot-like Integration**: Creating a nanobot interface directly in the browser based on Ling Series models.

## Feedback

Feel free to [submit an Issue](https://github.com/cafe3310/ling-open-studio/issues/new) if you have any questions or suggestions. I will review them, though I may not be able to respond immediately.

## Agent Skills

The Agent Skills used in this project are located in the [cafe3310's Public Agent Skills](https://github.com/cafe3310/public-agent-skills) repository. If you're interested, you can try them out, such as `doc-todo-log-loop`.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Agent Orchestration**: [LangGraph](https://langchain-ai.github.io/langgraph/)
- **UI Components**: [assistant-ui](https://github.com/Yonom/assistant-ui), Tailwind CSS 4, Radix UI
- **Runtime**: Browser-side VFS (IndexedDB)
