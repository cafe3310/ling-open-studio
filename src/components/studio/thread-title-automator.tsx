"use client";

import { useEffect, useRef } from "react";
import { useThread, useAssistantRuntime } from "@assistant-ui/react";

export const ThreadTitleAutomator = () => {
  const messages = useThread((state) => state.messages);
  const runtime = useAssistantRuntime();
  
  // Use a ref to track if naming is in progress or completed for this thread
  const processedThreadId = useRef<string | null>(null);

  useEffect(() => {
    const threadState = runtime.threads.getState();
    const currentThreadId = threadState.mainThreadId;
    const currentThreadItem = threadState.threadItems[currentThreadId];

    // Reset ref if thread ID changes
    if (processedThreadId.current !== currentThreadId) {
      processedThreadId.current = null;
    }

    // Trigger naming if:
    // 1. We haven't processed this thread yet
    // 2. We have exactly one round of conversation (User + Assistant)
    // 3. The last message is from assistant and is completed
    // 4. The current title is missing or default
    const isFirstRoundComplete = 
      messages.length >= 2 && 
      messages[0].role === 'user' && 
      messages[1].role === 'assistant' && 
      messages[1].status.type !== 'running';

    const isDefaultTitle = !currentThreadItem?.title || currentThreadItem.title === "New Chat";

    if (isFirstRoundComplete && isDefaultTitle && !processedThreadId.current) {
      processedThreadId.current = currentThreadId;

      const generateName = async () => {
        try {
          // Set temporary state
          const mainItem = runtime.threads.mainItem;
          await mainItem.rename("Naming...");

          const response = await fetch("/api/naming", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              messages: messages.slice(0, 2).map(m => ({
                role: m.role,
                content: m.content
              }))
            }),
          });

          if (!response.ok) throw new Error("Naming failed");
          
          const { title } = await response.json();
          if (title) {
            await mainItem.rename(title);
          }
        } catch (error) {
          console.error("Auto-naming error:", error);
          // Revert to default if failed
          await runtime.threads.mainItem.rename("New Chat");
        }
      };

      generateName();
    }
  }, [messages, runtime]);

  return null;
};
