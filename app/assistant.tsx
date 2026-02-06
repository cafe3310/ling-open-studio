"use client";

import { useState } from "react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import {
  useChatRuntime,
  AssistantChatTransport,
} from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThreadListSidebar } from "@/components/assistant-ui/threadlist-sidebar";
import { Separator } from "@/components/ui/separator";
import { TopNavigation, Tab } from "@/components/top-navigation";

export const Assistant = () => {
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: "/api/chat",
    }),
  });

  return (
    <div className="flex flex-col h-dvh w-full bg-background">
      <TopNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'chat' && (
          <AssistantRuntimeProvider runtime={runtime}>
            <SidebarProvider className="h-full w-full" style={{ minHeight: '0' }}>
              <div className="flex h-full w-full">
                <ThreadListSidebar />
                <SidebarInset className="h-full flex flex-col">
                  <header className="flex h-12 shrink-0 items-center gap-2 px-4 border-b">
                    <SidebarTrigger />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <span className="text-sm font-medium">Chat Session</span>
                  </header>
                  <div className="flex-1 overflow-hidden">
                    <Thread />
                  </div>
                </SidebarInset>
              </div>
            </SidebarProvider>
          </AssistantRuntimeProvider>
        )}

        {activeTab === 'web' && (
          <div className="flex items-center justify-center h-full text-muted-foreground bg-muted/20">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Model Web</h3>
              <p className="text-sm">Web generation workspace coming soon.</p>
            </div>
          </div>
        )}

        {activeTab === 'write' && (
          <div className="flex items-center justify-center h-full text-muted-foreground bg-muted/20">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Model Write</h3>
              <p className="text-sm">Writing assistant workspace coming soon.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};