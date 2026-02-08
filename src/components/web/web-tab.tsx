"use client";

import React, { useMemo } from 'react';
import { WebChat } from './web-chat';
import { WebPreview } from './web-preview';
import { WebConfig } from './web-config';
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime, AssistantChatTransport } from "@assistant-ui/react-ai-sdk";
import { useModelStore } from "@/lib/store";

export const WebTab: React.FC = () => {
  return (
    <div className="flex h-full w-full overflow-hidden bg-white">
      {/* Left: Chat Collaboration */}
      <WebChat />

      {/* Middle: Preview Stage */}
      <WebPreview />

      {/* Right: Styles & Config */}
      <WebConfig />
    </div>
  );
};
