"use client";

import React, { useMemo } from 'react';
import { WebChat } from './web-chat';
import { WebPreview } from './web-preview';
import { WebConfig } from './web-config';
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime, AssistantChatTransport } from "@assistant-ui/react-ai-sdk";
import { useModelStore } from "@/lib/store";

export const WebTab: React.FC = () => {
  const { modelId, systemPrompt, temperature } = useModelStore();

  // Web Generation specific runtime
  // In the future, this will point to /api/web-gen or similar with a specialized graph
  const runtime = useChatRuntime({
    transport: useMemo(() => new AssistantChatTransport({
      api: "/api/chat", // Temporary reuse of chat API
      body: {
        config: {
          modelId,
          systemPrompt: "You are an expert web developer. Focus on creating beautiful, functional web pages using HTML and Tailwind CSS.",
          temperature,
          mode: 'web-gen' // Metadata to trigger specialized behavior in backend
        }
      }
    }), [modelId, temperature]),
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="flex h-full w-full overflow-hidden bg-white">
        {/* Left: Chat Collaboration */}
        <WebChat />

        {/* Middle: Preview Stage */}
        <WebPreview />

        {/* Right: Styles & Config */}
        <WebConfig />
      </div>
    </AssistantRuntimeProvider>
  );
};
