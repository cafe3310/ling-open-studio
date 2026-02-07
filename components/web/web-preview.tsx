"use client";

import React, { useState } from 'react';
import { Monitor, Smartphone, RotateCcw, FolderOpen } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FilesystemTab } from "@/components/filesystem/filesystem-tab";

interface WebPreviewProps {
  taskId?: string;
}

export const WebPreview: React.FC<WebPreviewProps> = ({ taskId }) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile' | 'files'>('desktop');
  const [isGenerating, setIsGenerating] = useState(false);

  // TODO: Link to VFS to get the actual content
  const mockContent = `
    <div class="w-full h-full flex flex-col font-sans bg-white">
      <nav class="p-6 border-b flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <span class="font-serif font-bold text-2xl tracking-tight text-zinc-900">Bean & Leaf</span>
        <div class="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
          <a href="#" class="hover:text-zinc-900 transition-colors">Menu</a>
          <a href="#" class="hover:text-zinc-900 transition-colors">Locations</a>
          <button class="bg-zinc-900 text-white px-5 py-2 rounded-full hover:bg-zinc-800 transition-all shadow-sm">Order Now</button>
        </div>
      </nav>
      
      <div class="flex-1 flex flex-col items-center justify-center text-center p-12 bg-gradient-to-b from-stone-50 to-white">
        <div class="max-w-3xl">
          <span class="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-widest mb-6">Roasted in Downtown</span>
          <h1 class="text-5xl md:text-7xl font-serif font-bold text-zinc-900 mb-8 leading-tight italic">Morning Rituals</h1>
          <p class="text-lg md:text-xl text-zinc-600 mb-10 leading-relaxed max-w-2xl mx-auto font-light">
            Artisanal coffee sourced directly from family farms, roasted in small batches to reveal the unique character of every bean.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button class="w-full sm:w-auto bg-zinc-900 text-white px-10 py-4 rounded-full font-medium hover:bg-zinc-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">View the Menu</button>
            <button class="w-full sm:w-auto border border-zinc-200 bg-white text-zinc-900 px-10 py-4 rounded-full font-medium hover:bg-zinc-50 transition-all">Find a Shop</button>
          </div>
        </div>
      </div>
      
      <div class="p-12 bg-white">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="group cursor-pointer">
            <div class="aspect-[4/5] bg-stone-100 rounded-2xl mb-4 overflow-hidden relative">
              <div class="absolute inset-0 bg-zinc-900/0 group-hover:bg-zinc-900/5 transition-colors"></div>
            </div>
            <h3 class="font-serif font-bold text-lg text-zinc-900">Seasonal Blend #01</h3>
            <p class="text-sm text-zinc-500 font-light">Available for limited time only.</p>
          </div>
          <div class="group cursor-pointer">
            <div class="aspect-[4/5] bg-stone-100 rounded-2xl mb-4 overflow-hidden relative">
              <div class="absolute inset-0 bg-zinc-900/0 group-hover:bg-zinc-900/5 transition-colors"></div>
            </div>
            <h3 class="font-serif font-bold text-lg text-zinc-900">Seasonal Blend #02</h3>
            <p class="text-sm text-zinc-500 font-light">Available for limited time only.</p>
          </div>
          <div class="group cursor-pointer">
            <div class="aspect-[4/5] bg-stone-100 rounded-2xl mb-4 overflow-hidden relative">
              <div class="absolute inset-0 bg-zinc-900/0 group-hover:bg-zinc-900/5 transition-colors"></div>
            </div>
            <h3 class="font-serif font-bold text-lg text-zinc-900">Seasonal Blend #03</h3>
            <p class="text-sm text-zinc-500 font-light">Available for limited time only.</p>
          </div>
        </div>
      </div>
    </div>
  `;

  return (
    <div className="flex-1 flex flex-col h-full bg-brand-bg relative p-6">
      {/* Device Toggle Toolbar */}
      <div className="flex justify-center mb-6">
        <div className="bg-white/80 backdrop-blur-sm p-1 rounded-xl border border-brand-border shadow-sm flex items-center gap-1">
          <Button
            variant={viewMode === 'desktop' ? 'secondary' : 'ghost'}
            size="icon-sm"
            onClick={() => setViewMode('desktop')}
            className={cn(viewMode === 'desktop' && "bg-brand-bg text-brand-blue shadow-none")}
            title="Desktop View"
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'mobile' ? 'secondary' : 'ghost'}
            size="icon-sm"
            onClick={() => setViewMode('mobile')}
            className={cn(viewMode === 'mobile' && "bg-brand-bg text-brand-blue shadow-none")}
            title="Mobile View"
          >
            <Smartphone className="w-4 h-4" />
          </Button>
          <div className="w-px h-4 bg-brand-border mx-1" />
          <Button
            variant={viewMode === 'files' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('files')}
            className={cn("gap-2 px-3", viewMode === 'files' && "bg-brand-bg text-brand-blue shadow-none")}
            title="Project Files"
          >
            <FolderOpen className="w-4 h-4" />
            <span className="text-xs font-medium">Files</span>
          </Button>
          <div className="w-px h-4 bg-brand-border mx-1" />
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-brand-gray"
            onClick={() => {}}
            title="Refresh Preview"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        {viewMode === 'files' ? (
            <div className="w-full h-full rounded-2xl overflow-hidden border border-brand-border shadow-lg bg-white">
                {/* 
                    Ideally, we would pass a specific root directory to FilesystemTab here, 
                    e.g., rootPath={`/workspace/webapp/${taskId}`} 
                    But FilesystemTab currently shows everything. 
                    For Phase 1, showing the global VFS is acceptable.
                */}
                <FilesystemTab threadId="global" />
            </div>
        ) : (
            <div
            className={cn(
                "bg-white shadow-2xl border border-brand-border transition-all duration-500 overflow-hidden relative",
                viewMode === 'mobile' 
                ? "w-[375px] h-[667px] rounded-[40px] border-[12px] border-zinc-900" 
                : "w-full h-full rounded-2xl"
            )}
            >
            {/* We'll use an iframe for real VFS rendering later */}
            <div className="w-full h-full overflow-auto hide-scrollbar">
                <div dangerouslySetInnerHTML={{ __html: mockContent }} />
            </div>

            {isGenerating && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex items-center justify-center z-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin" />
                    <span className="font-serif italic text-brand-dark animate-pulse text-lg">Refining pixels...</span>
                </div>
                </div>
            )}
            </div>
        )}
      </div>
    </div>
  );
};
