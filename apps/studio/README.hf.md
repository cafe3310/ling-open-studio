---
title: Ling Open Studio
emoji: 🎙️
colorFrom: purple
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
license: mit
tags:
  - ai
  - chat
  - agent
  - inclusion-ai
  - ling
short_description: All-in-one playground for Ling series LLMs
---

# Ling Open Studio

**All-in-one playground for Ling series LLMs.**

Ling Open Studio (InclusionAI Demo) is an AI-powered platform designed to showcase the capabilities of the "Ling" series Large Language Models. It provides a unified interface for chat, web generation, and assisted writing.

## Features

- **Model Chat**: Standard AI conversation interface with streaming support.
- **Model Web**: Describe what you want and an AI agent generates real-time HTML/React previews.
- **Model Write**: AI-assisted writing with entity extraction and inspiration recommendation.

## Quick Start

1. **Deploy**: This Space runs a Dockerized Next.js application in standalone mode.
2. **Configure**: Ensure you have configured the necessary environment variables (API Keys).
3. **Interact**: Use the sidebar to switch between different model modes.

## Technical Details

Built with:
- **Assistant UI**: For the core chat experience.
- **LangGraph**: For orchestrating complex agentic workflows.
- **Next.js 15**: App Router with Standalone output.
- **Tailwind CSS v4**: For the InclusionAI design system.

---

*This project is part of the InclusionAI ecosystem.*
