"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Monitor, Smartphone, RotateCcw, FolderOpen, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FilesystemTab } from "@/components/filesystem/filesystem-tab";
import { useAuiState } from "@assistant-ui/react";
import { useVFS } from "@/lib/vfs/hooks";

export const WebPreview: React.FC = () => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile' | 'files'>('desktop');
  const threadId = useAuiState((s) => s.threads.mainThreadId);
  const isGenerating = useAuiState((s) => s.thread.isRunning);

  // We use the global scope for VFS but access thread-specific paths
  // The logic in client-executor maps / to /workspace/sessions/${threadId}/
  // So we should list the global VFS but filtered by threadId if necessary,
  // OR just use the useVFS hook with threadId = "global" and manually check paths.
  // BUT the state.ts now passes taskId (which is threadId) to the graph.
  // And the graph's write_file uses the delimited protocol.
  // Let's assume the preview should look at the session-specific folder.

  // We use "global" for the VFS event scope to match client-executor
  const { files, readFile, isLoading } = useVFS("global");
  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  useEffect(() => {
    const loadPreview = async () => {
      if (!threadId) return;
      try {
        // Important: We must use the same physical path mapping as the agent
        const physicalPath = `/workspace/sessions/${threadId}/index.html`;
        const file = await readFile(physicalPath);
        if (file && typeof file.content === 'string') {
          setHtmlContent(file.content);
        } else {
          setHtmlContent(null);
        }
      } catch (e) {
        setHtmlContent(null);
      }
    };

    loadPreview();
  }, [threadId, files, readFile]);

  // Patch script to handle anchor links within srcDoc iframe
  const patchedHtml = useMemo(() => {
    if (!htmlContent) return null;

    const patchScript = `
      <script>
        document.addEventListener('click', function(e) {
          const anchor = e.target.closest('a');
          if (anchor && anchor.getAttribute('href') && anchor.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const id = anchor.getAttribute('href').slice(1);
            const target = document.getElementById(id);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }, true);
      </script>
    `;

    // Inject before </body> if exists, otherwise append
    if (htmlContent.includes('</body>')) {
      return htmlContent.replace('</body>', `${patchScript}</body>`);
    }
    return htmlContent + patchScript;
  }, [htmlContent]);

  return (
    <div className="flex-1 flex flex-col h-full bg-brand-bg relative p-6">
      {/* Device Toggle Toolbar */}
      <div className="flex justify-center mb-6 shrink-0">
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
                <FilesystemTab threadId={threadId || "global"} />
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
            {patchedHtml ? (
              <iframe
                srcDoc={patchedHtml}
                className="w-full h-full border-none bg-white"
                title="Web Preview"
                sandbox="allow-scripts allow-forms allow-modals"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400 gap-4 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                  <Monitor className="w-8 h-8 opacity-20" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-600 mb-1 tracking-tight">No Preview Available</h3>
                  <p className="text-[11px] max-w-[200px] leading-relaxed">
                    Once the Agent generates your index.html, it will appear here.
                  </p>
                </div>
              </div>
            )}

            {(isGenerating || isLoading) && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center z-50 transition-all">
                  <div className="flex flex-col items-center gap-4 bg-white/90 p-6 rounded-2xl shadow-xl border border-brand-border">
                      <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
                      <span className="font-medium text-brand-dark text-sm">Designing and Generating</span>
                  </div>
                </div>
            )}
            </div>
        )}
      </div>
    </div>
  );
};
