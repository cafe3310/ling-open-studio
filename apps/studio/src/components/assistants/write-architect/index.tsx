"use client";

import React from "react";
import { WriteCanvas } from "./write-canvas";
import { WriteLeftSidebar } from "./write-left-sidebar";
import { WriteRightSidebar } from "./write-right-sidebar";

export const WriteArchitectAssistantV2 = () => {
  return (
    <div className="flex h-full w-full overflow-hidden bg-white relative">
      {/* Left Sidebar */}
      <WriteLeftSidebar />

      {/* Middle Canvas */}
      <WriteCanvas />

      {/* Right Sidebar */}
      <WriteRightSidebar />
    </div>
  );
};
