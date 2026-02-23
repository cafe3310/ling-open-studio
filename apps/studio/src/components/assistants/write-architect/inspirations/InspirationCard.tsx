"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, ChevronRight, RotateCcw, Sparkles, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { InspirationCard as InspirationCardType } from "../store";

interface InspirationCardProps {
  card: InspirationCardType;
  isActive: boolean;
  onClick: () => void;
}

const typeConfig = {
  Plot: { icon: RotateCcw, label: 'Plot' },
  Atmosphere: { icon: Sparkles, label: 'Atmosphere' },
  Dialogue: { icon: MessageSquare, label: 'Dialogue' },
};

export const InspirationCard = ({ card, isActive, onClick }: InspirationCardProps) => {
  const { icon: Icon, label } = typeConfig[card.type] || typeConfig.Plot;

  return (
    <Card 
      onClick={onClick}
      className={cn(
        "p-5 cursor-pointer border transition-all duration-300 relative group overflow-hidden rounded-xl",
        isActive 
          ? "bg-brand-blue/[0.04] border-brand-blue/30 shadow-[0_4px_16px_rgba(59,130,246,0.08)] scale-[1.02]" 
          : "bg-white border-brand-border/50 shadow-sm hover:shadow-md hover:border-brand-blue/20"
      )}
    >
      {isActive && (
        <div className="absolute top-0 right-0 p-2">
          <Zap className="w-3 h-3 text-brand-blue fill-brand-blue" />
        </div>
      )}
      
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-bold text-brand-blue uppercase tracking-widest">
          <Icon className="w-3 h-3" />
          {label}
        </div>
        <div className="space-y-2">
          <div className="text-xs font-bold text-brand-dark tracking-tight flex items-center justify-between">
            {card.title}
            <ChevronRight className={cn("w-3 h-3 opacity-0 group-hover:opacity-40 transition-all", isActive && "opacity-40 rotate-90")} />
          </div>
          <p className={cn(
            "text-[12px] leading-relaxed font-serif italic transition-colors",
            isActive ? "text-brand-dark" : "text-brand-dark/60"
          )}>
            "{card.content}"
          </p>
        </div>
        
        {isActive && (
          <div className="pt-2 animate-in fade-in slide-in-from-bottom-1 duration-300">
             <Badge variant="secondary" className="bg-brand-blue/10 text-brand-blue border-none text-[9px] font-bold px-2 py-0">GUIDING GENERATION</Badge>
          </div>
        )}
      </div>
    </Card>
  );
};
