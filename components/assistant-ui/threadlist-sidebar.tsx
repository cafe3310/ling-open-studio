import * as React from "react";
import { Github, MessagesSquare } from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ThreadList } from "@/components/assistant-ui/thread-list";

export function ThreadListSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} className="border-r border-brand-border bg-brand-bg/50">
      <SidebarHeader className="mb-2 border-b border-brand-border p-4 bg-transparent">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold text-brand-dark tracking-tight">History</h2>
          <SidebarMenuButton size="sm" className="w-8 h-8 p-0 flex items-center justify-center rounded-lg hover:bg-white transition-colors text-brand-dark">
             <MessagesSquare className="size-5" />
          </SidebarMenuButton>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 bg-transparent">
        <ThreadList />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
