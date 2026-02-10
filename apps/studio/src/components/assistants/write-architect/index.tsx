"use client";

import React, { useMemo } from "react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import {
  useChatRuntime,
  AssistantChatTransport,
} from "@assistant-ui/react-ai-sdk";
import { useModelStore } from "@/lib/store";
import { WriteLeftSidebar } from "./write-left-sidebar";
import { WriteCanvas } from "./write-canvas";
import { WriteRightSidebar } from "./write-right-sidebar";

export const WriteArchitectAssistant = () => {
  const { modelId, temperature } = useModelStore();

  // Create a minimal runtime for the Write assistant
  const runtime = useChatRuntime({
    transport: useMemo(() => new AssistantChatTransport({
      api: "/api/chat/general", // Temporary placeholder
      body: {
        config: {
          modelId,
          temperature,
        }
      }
    }), [modelId, temperature]),
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="flex h-full w-full overflow-hidden bg-white">
        {/* Left column: Context & Controls */}
        <WriteLeftSidebar />

        {/* Middle column: Immersive Canvas */}
        <WriteCanvas />

        {/* Right column: AI Intelligence */}
        <WriteRightSidebar />
      </div>
    </AssistantRuntimeProvider>
  );
};
