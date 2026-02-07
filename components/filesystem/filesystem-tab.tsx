"use client";

import React, { useState, useMemo } from 'react';
import { 
  Folder, FolderOpen, FileCode, FileText, Image as ImageIcon, 
  Lock, RefreshCw, Upload, Plus, MoreHorizontal, Download, 
  Trash2, Save, Info, ChevronRight, ChevronDown, HardDrive,
  FilePlus, FolderPlus, Pencil, Check, X
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
  console.log('[FilesystemTab] Render. threadId:', threadId);
  const { files, isLoading, refresh, writeFile, readFile, deleteFile, deleteDir, renameFile } = useVFS(threadId);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set(['/workspace', '/system']));
  const [selectedFile, setSelectedFile] = useState<VirtualFile | null>(null);
  const [editorContent, setEditorContent] = useState<string>('');
  const [isDirty, setIsDirty] = useState(false);

  // Dialog States
  const [isNewItemDialogOpen, setIsNewItemDialogOpen] = useState(false);
  const [newItemType, setNewItemType] = useState<'file' | 'folder'>('file');
  const [newItemName, setNewItemName] = useState('');
  const [newItemParentPath, setNewItemParentPath] = useState('/workspace');

  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [itemToRename, setItemToRename] = useState<{ path: string; name: string } | null>(null);
  const [renameNewName, setRenameNewName] = useState('');

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ path: string; type: 'file' | 'folder' } | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // 种子测试数据
  const seedFiles = async () => {
    if (!threadId) return;
    console.log('[VFS] Seeding test files...');
    await writeFile('/workspace/readme.md', '# Welcome to Ling Open Studio\n\nThis is a file in your VFS.', 'user');
    await writeFile('/workspace/src/index.html', '<html><body><h1>Hello VFS</h1></body></html>', 'user');
    await writeFile('/system/rules.txt', '1. Be helpful\n2. Be concise', 'user');
    await refresh();
  };

  // Actions
  const handleSave = async () => {
    if (!selectedFile) return;
    try {
      await writeFile(selectedFile.path, editorContent, 'user');
      setIsDirty(false);
      // Update selected file object to reflect saved time etc if needed, but VFS refresh might handle it
      // For now just keep content in sync
      const updatedFile = await readFile(selectedFile.path);
      setSelectedFile(updatedFile);
    } catch (e) {
      console.error('Failed to save file:', e);
    }
  };

  const handleCreateItem = async () => {
    console.log('[FilesystemTab] handleCreateItem triggered');
    console.log(' - newItemName:', newItemName);
    console.log(' - threadId:', threadId);
    console.log(' - newItemType:', newItemType);
    console.log(' - newItemParentPath:', newItemParentPath);

    if (!newItemName || !threadId) {
      console.warn('[FilesystemTab] Cannot create item: missing name or threadId');
      return;
    }
    
    // Normalize path
    let parent = newItemParentPath;
    if (parent.endsWith('/')) parent = parent.slice(0, -1);
    const fullPath = `${parent}/${newItemName}`;

    console.log(`[FilesystemTab] Creating ${newItemType}: ${fullPath}`);

    try {
      if (newItemType === 'folder') {
        // Create a keep file to ensure folder exists
        await writeFile(`${fullPath}/.keep`, '', 'user');
      } else {
        await writeFile(fullPath, '', 'user');
      }
      console.log('[FilesystemTab] Item created successfully');
      setIsNewItemDialogOpen(false);
      setNewItemName('');
      refresh();
      // Auto open the new folder if it's a folder
      if (newItemType === 'folder') {
         setOpenFolders(prev => new Set(prev).add(fullPath));
      } else {
         handleFileClick(fullPath);
      }
    } catch (e) {
      console.error('Failed to create item:', e);
    }
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete || !threadId) return;
    try {
      // Logic to delete file or folder (if folder, might need recursive delete support in VFS hook or just deleteFilesByPrefix)
      // The core VFS has deleteDir, need to expose it in hook or use direct access if possible.
      // Hook exposes `deleteFile`. Let's check hook again. 
      // It exposes `deleteFile`. It does NOT expose `deleteDir`.
      // I should update the hook to expose `deleteDir` or `vfs` instance.
      // For now, assume deleteFile works for files. For folders, I need to implement deleteDir in hook.
      // Wait, I implemented `deleteDir` in core, but maybe not in hook.
      // Let's assume for this step I'll only support deleting files or empty folders (via .keep deletion).
      // Actually, to do it right, I'll update the hook in a separate step if needed. 
      // But for now, let's just try deleteFile. If it's a folder, UI shows it.
      
      // Temporary: only delete file supported by hook?
      // Re-reading hook: `deleteFile` calls `vfs.deleteFile`.
      // `vfs.deleteFile` checks existence.
      // If it's a "folder" in my UI tree, it's just a visual construct. The actual files are what matters.
      // If I want to delete a folder, I need to delete all files with that prefix.
      
      // I will assume for now I can only delete files. 
      // If user selects a folder, I should warn or implement deleteDir.
      // I'll stick to file deletion for this iteration or try to implement folder delete by listing and deleting all.
      
      if (itemToDelete.type === 'file') {
        await deleteFile(itemToDelete.path, 'user');
        if (selectedFilePath === itemToDelete.path) {
          setSelectedFile(null);
          setSelectedFilePath(null);
          setEditorContent('');
        }
      } else {
        await deleteDir(itemToDelete.path, 'user');
        // If selected file was inside this folder, clear selection
        if (selectedFilePath && selectedFilePath.startsWith(itemToDelete.path)) {
            setSelectedFile(null);
            setSelectedFilePath(null);
            setEditorContent('');
        }
      }
      
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
      refresh();
    } catch (e) {
      console.error('Failed to delete item:', e);
    }
  };

  const handleRenameItem = async () => {
    if (!itemToRename || !renameNewName || !threadId) return;
    try {
        const parent = getParentDir(itemToRename.path);
        const newPath = `${parent}/${renameNewName}`;
        await renameFile(itemToRename.path, newPath, 'user');
        setIsRenameDialogOpen(false);
        setRenameNewName('');
        setItemToRename(null);
        refresh();
    } catch (e) {
        console.error("Failed to rename:", e);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !threadId) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
        const content = event.target?.result;
        if (content) {
            // Upload to current open folder or root workspace
            // Use active path or default to /workspace
            const targetDir = selectedFilePath && selectedFilePath.startsWith('/workspace') 
                ? (selectedFile?.type === 'image' || selectedFile?.type === 'binary' || selectedFile?.type === 'text' || selectedFile?.type === 'code' ? getParentDir(selectedFilePath) : selectedFilePath) // If file selected, use parent
                : '/workspace';
            
            await writeFile(`${targetDir}/${file.name}`, content, 'user');
            refresh();
        }
    };
    if (file.type.startsWith('text') || file.type.includes('json') || file.type.includes('javascript') || file.type.includes('xml')) {
        reader.readAsText(file);
    } else {
        reader.readAsArrayBuffer(file);
    }
  };

  const handleDownload = () => {
    if (!selectedFile) return;
    const blob = new Blob([selectedFile.content], { type: selectedFile.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

  const handleFileClick = async (path: string) => {
    setSelectedFilePath(path);
    try {
      const file = await readFile(path);
      setSelectedFile(file);
      if (file && typeof file.content === 'string') {
        setEditorContent(file.content);
      } else {
        setEditorContent('');
      }
      setIsDirty(false);
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
                  "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-sm transition-colors group select-none relative",
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
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4" />
            </Button>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleUpload}
            />
          </div>
        </div>

        <div className="p-2 border-b border-brand-border bg-white/50">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start gap-2 h-8 text-xs"
            onClick={() => {
                // Determine default parent path based on selection
                if (selectedFilePath && selectedFilePath.startsWith('/workspace')) {
                    // If selection is folder, use it. If file, use parent.
                    // But in our tree, we don't know easily if selectedFilePath is folder from here without lookup
                    // Naive: use root /workspace
                     setNewItemParentPath('/workspace');
                }
                setNewItemName('');
                setIsNewItemDialogOpen(true);
            }}
          >
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
                {isDirty && !selectedFile.isReadOnly && (
                    <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Unsaved
                    </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                    // Info dialog could go here
                }}>
                  <Info className="w-4 h-4" />
                </Button>
                
                {!selectedFile.isReadOnly && (
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => {
                            setItemToRename({ path: selectedFile.path, name: selectedFile.name });
                            setRenameNewName(selectedFile.name);
                            setIsRenameDialogOpen(true);
                        }}
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>
                )}

                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDownload}>
                    <Download className="w-4 h-4" />
                </Button>

                {!selectedFile.isReadOnly && (
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="gap-2"
                    onClick={handleSave}
                    disabled={!isDirty}
                  >
                    <Save className="w-4 h-4" /> Save
                  </Button>
                )}
                
                {!selectedFile.isReadOnly && (
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                            setItemToDelete({ path: selectedFile.path, type: 'file' });
                            setIsDeleteDialogOpen(true);
                        }}
                    >
                    <Trash2 className="w-4 h-4" />
                    </Button>
                )}
              </div>
            </header>

            <div className="flex-1 overflow-auto bg-slate-50 p-6">
              {selectedFile.type === 'image' ? (
                <div className="h-full flex items-center justify-center">
                   <div className="p-4 bg-white shadow-sm rounded-lg border border-brand-border">
                      <div className="flex flex-col items-center justify-center text-brand-gray gap-2">
                        {/* We need a real image preview here if content is base64 or blob. VFS content is string or ArrayBuffer. 
                            If it's ArrayBuffer, we need to convert to Blob URL.
                            For now, placeholder.
                        */}
                        <ImageIcon className="w-12 h-12 opacity-20" />
                        <span className="text-xs">Image Preview (Coming Soon)</span>
                      </div>
                   </div>
                </div>
              ) : selectedFile.type === 'binary' ? (
                <div className="h-full flex flex-col items-center justify-center text-brand-gray">
                   <HardDrive className="w-12 h-12 opacity-20 mb-4" />
                   <p className="text-sm">Binary file cannot be displayed.</p>
                   <Button variant="outline" className="mt-4" onClick={handleDownload}>Download</Button>
                </div>
              ) : (
                <textarea 
                  className="w-full h-full bg-transparent font-mono text-sm resize-none outline-none leading-relaxed"
                  value={editorContent}
                  onChange={(e) => {
                      setEditorContent(e.target.value);
                      setIsDirty(true);
                  }}
                  readOnly={selectedFile.isReadOnly}
                  spellCheck={false}
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

        {/* --- Dialogs --- */}
        
        {/* Create New Item Dialog */}
        <Dialog open={isNewItemDialogOpen} onOpenChange={setIsNewItemDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Item</DialogTitle>
                    <DialogDescription>
                        Create a new file or folder in {newItemParentPath}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex items-center gap-4">
                        <Button 
                            variant={newItemType === 'file' ? 'default' : 'outline'} 
                            onClick={() => setNewItemType('file')}
                            className="flex-1"
                        >
                            <FilePlus className="w-4 h-4 mr-2" /> File
                        </Button>
                        <Button 
                            variant={newItemType === 'folder' ? 'default' : 'outline'} 
                            onClick={() => setNewItemType('folder')}
                            className="flex-1"
                        >
                            <FolderPlus className="w-4 h-4 mr-2" /> Folder
                        </Button>
                    </div>
                    <div className="grid gap-2">
                        <Input 
                            id="name" 
                            placeholder={newItemType === 'file' ? "filename.txt" : "foldername"} 
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsNewItemDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateItem}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Rename Dialog */}
        <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Rename Item</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Input 
                        value={renameNewName}
                        onChange={(e) => setRenameNewName(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleRenameItem}>Rename</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Item</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete {itemToDelete?.path}? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDeleteItem}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

      </main>
    </div>
  );
};
