"use client";

import { useEffect, useRef } from "react";
import { useAui, useAuiState } from "@assistant-ui/react";

export const ThreadTitleAutomator = () => {
  const messages = useAuiState((s) => s.thread.messages);
  const threadId = useAuiState((s) => s.threads.mainThreadId);
  const threadTitle = useAuiState((s) => s.threads.threadItems[s.threads.mainThreadId as any as number]?.title);
  const aui = useAui();

  // Use a ref to track if naming is in progress or completed for this thread
  const processedThreadId = useRef<string | null>(null);

  useEffect(() => {
    // Reset ref if thread ID changes
    if (processedThreadId.current !== threadId) {
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

    const isDefaultTitle = !threadTitle || threadTitle === "New Chat";

    if (isFirstRoundComplete && isDefaultTitle && !processedThreadId.current) {
      processedThreadId.current = threadId;

      const generateName = async () => {
        try {
          // Set temporary state
          await aui.threadListItem().rename("Naming...");

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
            await aui.threadListItem().rename(title);
          }
        } catch (error) {
          console.error("Auto-naming error:", error);
          // Revert to default if failed
          await aui.threadListItem().rename("New Chat");
        }
      };

      generateName();
    }
  }, [messages, threadId, threadTitle, aui]);

  return null;
};
