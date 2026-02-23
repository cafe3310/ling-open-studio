"use client";

import React from "react";
import { Globe, Users, Zap } from "lucide-react";
import { useWriteStore } from "../store";
import { KnowledgeSection } from "./KnowledgeSection";

export const KnowledgeBase = () => {
  const { knowledgeBase } = useWriteStore();

  return (
    <div className="space-y-8">
      <KnowledgeSection 
        title="World Settings" 
        category="worldSettings" 
        entries={knowledgeBase.worldSettings} 
        icon={<Globe className="w-3 h-3" />}
      />
      
      <KnowledgeSection 
        title="Key Concepts" 
        category="concepts" 
        entries={knowledgeBase.concepts} 
        icon={<Zap className="w-3 h-3" />}
      />
      
      <KnowledgeSection 
        title="Characters" 
        category="characters" 
        entries={knowledgeBase.characters} 
        icon={<Users className="w-3 h-3" />}
      />
    </div>
  );
};
