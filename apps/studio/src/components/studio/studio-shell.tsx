"use client";

import { useState } from "react";
import { TopNavigation, Tab } from "./top-navigation";
import { FilesystemTab } from "@/components/filesystem/filesystem-tab";
import { GeneralChatAssistant } from "@/components/assistants/general-chat";
import { WebArchitectAssistant } from "@/components/assistants/web-architect";
import { WriteArchitectAssistant } from "@/components/assistants/write-architect";

export const StudioShell = () => {
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  return (
    <div className="flex flex-col h-dvh w-full bg-brand-bg">
      <TopNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'chat' && (
          <GeneralChatAssistant />
        )}

        {activeTab === 'web' && (
          <WebArchitectAssistant />
        )}

        {activeTab === 'write' && (
          <WriteArchitectAssistant />
        )}

        {activeTab === 'filesystem' && (
          <FilesystemTab threadId="global" />
        )}
      </main>
    </div>
  );
};