"use client";

import { useMemo } from "react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import {
  useChatRuntime,
  AssistantChatTransport,
} from "@assistant-ui/react-ai-sdk";
import { useModelStore } from "@/lib/store";
import { WebChat } from "@/components/web/web-chat";
import { WebPreview } from "@/components/web/web-preview";
import { WebConfig } from "@/components/web/web-config";
import { ThreadTitleAutomator } from "@/components/studio/thread-title-automator";

export const WebArchitectAssistant = () => {
  const { modelId, temperature, designId, techStackId } = useModelStore();

  const runtime = useChatRuntime({
    transport: useMemo(() => new AssistantChatTransport({
      api: "/api/chat/web",
      body: {
        config: {
          modelId,
          temperature,
          designId,
          techStackId,
          toolParadigm: 'xml', // Switched to 'xml' for better compatibility with Ling-2.5
        }
      }
    }), [modelId, temperature, designId, techStackId]),
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
