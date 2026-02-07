"use client";

import React, { useState, useMemo } from 'react';
import { 
  Folder, FolderOpen, FileCode, FileText, Image as ImageIcon, 
  Lock, RefreshCw, Upload, Plus, MoreHorizontal, Download, 
  Trash2, Save, Info, ChevronRight, ChevronDown, HardDrive
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useVFS } from "@/lib/vfs/hooks";
import { VirtualFile } from "@/lib/vfs/types";
import { getParentDir } from "@/lib/vfs/utils";

interface FileNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  fileType?: string;
  children?: FileNode[];
  path: string;
  isSystem?: boolean;
  isOpen?: boolean;
  file?: VirtualFile;
}

interface FilesystemTabProps {
  threadId: string;
}

export const FilesystemTab: React.FC<FilesystemTabProps> = ({ threadId }) => {
  const { files, isLoading, refresh, writeFile, readFile, deleteFile } = useVFS(threadId);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set(['/workspace', '/system']));

  // 种子测试数据
  const seedFiles = async () => {
    if (!threadId) return;
    console.log('[VFS] Seeding test files...');
    await writeFile('/workspace/readme.md', '# Welcome to Ling Open Studio\n\nThis is a file in your VFS.', 'user');
    await writeFile('/workspace/src/index.html', '<html><body><h1>Hello VFS</h1></body></html>', 'user');
    await writeFile('/system/rules.txt', '1. Be helpful\n2. Be concise', 'user');
    await refresh();
  };

  // 将扁平化的文件列表转换为树形结构
  const fileTree = useMemo(() => {
    const root: FileNode[] = [
      { id: 'workspace', name: 'workspace', type: 'folder', path: '/workspace', isOpen: openFolders.has('/workspace'), children: [] },
      { id: 'system', name: 'system', type: 'folder', path: '/system', isSystem: true, isOpen: openFolders.has('/system'), children: [] }
    ];

    const findOrCreateDir = (path: string, nodes: FileNode[]): FileNode[] => {
      const parts = path.split('/').filter(Boolean);
      let currentLevel = nodes;
      let currentPath = '';

      for (const part of parts) {
        currentPath += '/' + part;
        let node = currentLevel.find(n => n.name === part && n.type === 'folder');
        if (!node) {
          node = {
            id: currentPath,
            name: part,
            type: 'folder',
            path: currentPath,
            isOpen: openFolders.has(currentPath),
            children: [],
            isSystem: currentPath.startsWith('/system')
          };
          currentLevel.push(node);
        }
        currentLevel = node.children!;
      }
      return currentLevel;
    };

    files.forEach(file => {
      const parentPath = getParentDir(file.path);
      const container = findOrCreateDir(parentPath, root);
      container.push({
        id: file.id,
        name: file.name,
        type: 'file',
        fileType: file.type,
        path: file.path,
        isSystem: file.path.startsWith('/system'),
        file: file
      });
    });

    return root;
  }, [files, openFolders]);

  const [selectedFile, setSelectedFile] = useState<VirtualFile | null>(null);

  const handleFileClick = async (path: string) => {
    setSelectedFilePath(path);
    try {
      const file = await readFile(path);
      setSelectedFile(file);
    } catch (e) {
      console.error('Failed to read file:', e);
    }
  };

  const toggleFolder = (path: string) => {
    setOpenFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const renderTree = (nodes: FileNode[]) => {
    return (
      <ul className="pl-2 space-y-0.5">
        {nodes.sort((a, b) => {
          if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
          return a.name.localeCompare(b.name);
        }).map(node => {
          const isSelected = selectedFilePath === node.path;
          
          return (
            <li key={node.id}>
              <div 
                onClick={() => node.type === 'folder' ? toggleFolder(node.path) : handleFileClick(node.path)}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-sm transition-colors group select-none",
                  isSelected 
                    ? "bg-brand-blue/10 text-brand-blue font-medium" 
                    : "text-brand-gray hover:text-brand-dark hover:bg-black/5"
                )}
              >
                {node.type === 'folder' ? (
                  <button className="text-gray-400">
                    {openFolders.has(node.path) ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                ) : (
                  <span className="w-3.5" />
                )}

                {node.type === 'folder' ? (
                  openFolders.has(node.path) ? <FolderOpen className="w-4 h-4 text-brand-blue" /> : <Folder className="w-4 h-4 text-brand-blue" />
                ) : (
                  <>
                    {node.fileType === 'code' && <FileCode className="w-4 h-4 text-brand-cyan" />}
                    {node.fileType === 'text' && <FileText className="w-4 h-4 text-gray-400" />}
                    {node.fileType === 'image' && <ImageIcon className="w-4 h-4 text-brand-slate" />}
                    {node.fileType === 'binary' && <HardDrive className="w-4 h-4 text-brand-slate" />}
                  </>
                )}

                <span className="truncate flex-1">{node.name}</span>
                {node.isSystem && <Lock className="w-3 h-3 text-brand-slate opacity-50" />}
              </div>

              {node.type === 'folder' && openFolders.has(node.path) && node.children && node.children.length > 0 && (
                <div className="border-l border-brand-border ml-4">
                  {renderTree(node.children)}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-white">
      {/* Left Sidebar */}
      <aside className="w-[300px] border-r border-brand-border flex flex-col bg-brand-bg/30">
        <div className="p-4 border-b border-brand-border flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-brand-dark">Filesystem</h2>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={refresh}>
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Upload className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-2 border-b border-brand-border bg-white/50">
          <Button variant="outline" size="sm" className="w-full justify-start gap-2 h-8 text-xs">
            <Plus className="w-3.5 h-3.5" /> New Item
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {renderTree(fileTree)}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {selectedFile ? (
          <div className="flex flex-col h-full">
            <header className="h-14 border-b border-brand-border px-6 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-brand-gray">{selectedFile.path}</span>
                {selectedFile.isReadOnly && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase border border-slate-200">
                    Read Only
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="w-4 h-4" />
                </Button>
                {!selectedFile.isReadOnly && (
                  <Button variant="default" size="sm" className="gap-2">
                    <Save className="w-4 h-4" /> Save
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </header>

            <div className="flex-1 overflow-auto bg-slate-50 p-6">
              {selectedFile.type === 'image' ? (
                <div className="h-full flex items-center justify-center">
                   <div className="p-4 bg-white shadow-sm rounded-lg border border-brand-border">
                      <div className="w-64 h-64 flex flex-col items-center justify-center text-brand-gray gap-2">
                        <ImageIcon className="w-12 h-12 opacity-20" />
                        <span className="text-xs">Image Preview</span>
                      </div>
                   </div>
                </div>
              ) : selectedFile.type === 'binary' ? (
                <div className="h-full flex flex-col items-center justify-center text-brand-gray">
                   <HardDrive className="w-12 h-12 opacity-20 mb-4" />
                   <p className="text-sm">Binary file cannot be displayed.</p>
                   <Button variant="outline" className="mt-4">Download</Button>
                </div>
              ) : (
                <textarea 
                  className="w-full h-full bg-transparent font-mono text-sm resize-none outline-none leading-relaxed"
                  value={typeof selectedFile.content === 'string' ? selectedFile.content : 'Binary content'}
                  readOnly={selectedFile.isReadOnly}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="max-w-md text-center">
              <div className="w-20 h-20 bg-brand-bg rounded-2xl border border-brand-border mx-auto mb-6 flex items-center justify-center">
                <HardDrive className="w-10 h-10 text-brand-slate" />
              </div>
              <h1 className="font-serif text-3xl font-bold text-brand-dark mb-4">Agent Filesystem</h1>
              <p className="text-brand-gray mb-8">
                Explore and manage the files the AI agent is working with. 
                Inspect generated code, assets, and system configurations.
              </p>
              <div className="flex justify-center mb-8">
                <Button onClick={seedFiles} variant="secondary">Seed Test Files</Button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-left">
                <Card className="p-4 bg-blue-50/50 border-blue-100">
                  <h3 className="text-xs font-bold text-blue-600 uppercase mb-2">Workspace</h3>
                  <p className="text-xs text-brand-dark">Agent can read and write files here.</p>
                </Card>
                <Card className="p-4 bg-slate-50/50 border-slate-100">
                  <h3 className="text-xs font-bold text-slate-600 uppercase mb-2">System</h3>
                  <p className="text-xs text-brand-dark">Read-only instructions and knowledge.</p>
                </Card>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
