import React, { useState } from 'react';
import { Palette, X, Search, ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { PRESET_STYLES } from '@/lib/prompts/assistants/web-architect/style-library';
import { useModelStore } from '@/lib/store';

interface StyleLibraryDialogProps {
  trigger: React.ReactNode;
}

export const StyleLibraryDialog: React.FC<StyleLibraryDialogProps> = ({ trigger }) => {
  const [search, setSearch] = useState('');
  const { designId, setDesignId, setPresetStylePrompt } = useModelStore();
  const [open, setOpen] = useState(false);

  const filteredStyles = PRESET_STYLES.filter(style => 
    style.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (style: typeof PRESET_STYLES[0]) => {
    setDesignId('preset');
    setPresetStylePrompt(style.prompt);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0 overflow-hidden border-none bg-transparent shadow-none">
        <div className="flex-1 flex flex-col bg-white/80 backdrop-blur-2xl rounded-2xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1),inset_0_0_0_1px_rgba(255,255,255,0.5)] overflow-hidden">
          
          <DialogHeader className="p-6 pb-2 border-b border-black/5">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-bold text-brand-dark flex items-center gap-2">
                  <Palette className="w-5 h-5 text-brand-blue" />
                  Design Style Library
                </DialogTitle>
                <p className="text-xs text-brand-gray mt-1">Explore 31 curated design systems for your web project.</p>
              </div>
            </div>
            
            <div className="relative mt-4 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray group-focus-within:text-brand-blue transition-colors" />
              <input 
                type="text" 
                placeholder="Search styles..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black/5 border border-black/5 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:bg-white/50 transition-all"
              />
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 hide-scrollbar">
            <div className="grid grid-cols-2 gap-4 pb-4">
              {filteredStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleSelect(style)}
                  className={cn(
                    "group relative flex flex-col text-left p-4 rounded-xl transition-all duration-300",
                    "bg-white/40 border border-white/60",
                    "hover:bg-white/80 hover:border-brand-blue/30 hover:shadow-[0_8px_20px_rgba(0,0,0,0.05),inset_0_0_0_1px_rgba(255,255,255,0.8)]",
                    "active:scale-[0.98]"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-white/80 border border-white/50 shadow-sm group-hover:bg-brand-blue/10 group-hover:border-brand-blue/20 transition-colors">
                        <Palette className="w-4 h-4 text-brand-blue" />
                      </div>
                      <span className="text-[10px] text-brand-gray/60 font-medium uppercase tracking-tight">designprompts.dev</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-brand-gray opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </div>
                  <h4 className="text-sm font-bold text-brand-dark">{style.name}</h4>
                  <p className="text-[11px] text-brand-gray mt-1 line-clamp-1 leading-relaxed">
                    Professional curated design system
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 px-6 border-t border-black/5 bg-black/5 flex items-center justify-between">
            <div className="text-[10px] text-brand-gray uppercase tracking-widest font-bold">
              Select a preset to skip style generation
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-medium text-brand-dark">{PRESET_STYLES.length} Styles Available</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
