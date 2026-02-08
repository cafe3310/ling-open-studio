"use client";

import { useMemo } from "react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import {
  useChatRuntime,
  AssistantChatTransport,
} from "@assistant-ui/react-ai-sdk";
import { Thread } from "./thread";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThreadListSidebar } from "@/components/assistant-ui/threadlist-sidebar";
import { Separator } from "@/components/ui/separator";
import { ModelConfig } from "@/components/studio/model-config";
import { useModelStore } from "@/lib/store";
import { ThreadTitleAutomator } from "@/components/studio/thread-title-automator";

export const GeneralChatAssistant = () => {
  const { modelId, systemPrompt, temperature, enabledTools, toolParadigm } = useModelStore();

  const runtime = useChatRuntime({
    transport: useMemo(() => new AssistantChatTransport({
      api: "/api/chat/general",
      body: {
        config: {
          modelId,
          systemPrompt,
          temperature,
          enabledTools,
          toolParadigm,
        }
      }
    }), [modelId, systemPrompt, temperature, enabledTools, toolParadigm]),
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <ThreadTitleAutomator />
      <SidebarProvider className="h-full w-full" style={{ minHeight: '0' }}>
        <div className="flex h-full w-full overflow-hidden">
          <ThreadListSidebar />
          <SidebarInset className="h-full flex flex-col bg-white overflow-hidden relative">
            <header className="flex h-12 shrink-0 items-center gap-2 px-4 border-b border-brand-border">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <span className="text-sm font-medium font-sans text-brand-dark">Chat Session</span>
            </header>
            <div className="flex-1 overflow-hidden">
              <Thread />
            </div>
          </SidebarInset>
          <ModelConfig />
        </div>
      </SidebarProvider>
    </AssistantRuntimeProvider>
  );
};
