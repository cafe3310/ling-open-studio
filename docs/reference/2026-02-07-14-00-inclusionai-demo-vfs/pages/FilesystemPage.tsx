import React, { useState } from 'react';
import { PageContainer, Sidebar, MainContent, Button, SectionTitle, SubTitle, cn, Card } from '../components/DesignSystem';
import { 
  Folder, FolderOpen, FileCode, FileText, Image as ImageIcon, 
  Lock, RefreshCw, Upload, Plus, MoreHorizontal, Download, 
  Trash2, Save, Info, ChevronRight, ChevronDown, HardDrive
} from 'lucide-react';

// --- Types ---
type FileType = 'folder' | 'code' | 'text' | 'image' | 'binary';

interface FileNode {
  id: string;
  name: string;
  type: FileType;
  children?: FileNode[];
  content?: string; // Mock content
  isSystem?: boolean; // If true, it's read-only for agent
  isOpen?: boolean; // For folders
}

// --- Mock Data ---
const initialData: FileNode[] = [
  {
    id: 'root-system',
    name: 'system',
    type: 'folder',
    isSystem: true,
    isOpen: true,
    children: [
      { id: 'sys-1', name: 'agent_rules.md', type: 'text', isSystem: true, content: '# Agent Operational Protocols\n\n1. Do not harm humans.\n2. Prioritize accuracy.\n3. Output formatted JSON.' },
      { id: 'sys-2', name: 'memory_core.bin', type: 'binary', isSystem: true },
      { 
        id: 'sys-prompts', 
        name: 'prompts', 
        type: 'folder', 
        isSystem: true,
        children: [
            { id: 'sys-p-1', name: 'persona_creative.txt', type: 'text', isSystem: true, content: 'You are a helpful creative writing assistant.' }
        ]
      }
    ]
  },
  {
    id: 'root-workspace',
    name: 'workspace',
    type: 'folder',
    isOpen: true,
    children: [
      { id: 'ws-1', name: 'index.html', type: 'code', content: '<!DOCTYPE html>\n<html>\n  <body>\n    <h1>Hello World</h1>\n  </body>\n</html>' },
      { id: 'ws-2', name: 'style.css', type: 'code', content: 'body { background: #f0f0f0; }' },
      { id: 'ws-3', name: 'script.js', type: 'code', content: 'console.log("Agent loaded");' },
      { 
        id: 'ws-assets', 
        name: 'assets', 
        type: 'folder', 
        children: [
           { id: 'ws-img-1', name: 'logo.png', type: 'image', content: 'placeholder' }
        ]
      }
    ]
  }
];

const FilesystemPage: React.FC = () => {
  const [files, setFiles] = useState<FileNode[]>(initialData);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [activePath, setActivePath] = useState<string>('');

  // --- Recursive Tree Renderer ---
  const toggleFolder = (id: string, nodes: FileNode[]): FileNode[] => {
    return nodes.map(node => {
      if (node.id === id) {
        return { ...node, isOpen: !node.isOpen };
      }
      if (node.children) {
        return { ...node, children: toggleFolder(id, node.children) };
      }
      return node;
    });
  };

  const handleNodeClick = (node: FileNode, path: string) => {
    if (node.type === 'folder') {
      setFiles(prev => toggleFolder(node.id, prev));
    } else {
      setSelectedFile(node);
      setActivePath(path);
    }
  };

  const renderTree = (nodes: FileNode[], currentPath: string = '') => {
    return (
      <ul className="pl-2 space-y-0.5">
        {nodes.map(node => {
            const isSelected = selectedFile?.id === node.id;
            const fullPath = `${currentPath}/${node.name}`;
            
            return (
                <li key={node.id}>
                    <div 
                        onClick={() => handleNodeClick(node, fullPath)}
                        className={cn(
                            "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-sm transition-colors group select-none",
                            isSelected 
                                ? "bg-brand-blue/10 text-brand-blue font-medium" 
                                : "text-brand-gray hover:text-brand-dark hover:bg-black/5"
                        )}
                    >
                        {/* Toggle Icon or Spacer */}
                        {node.type === 'folder' ? (
                            <button className="text-gray-400 hover:text-brand-dark">
                                {node.isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                            </button>
                        ) : (
                            <span className="w-3.5" />
                        )}

                        {/* File/Folder Icon */}
                        {node.type === 'folder' ? (
                            node.isOpen ? <FolderOpen className="w-4 h-4 text-brand-blue" /> : <Folder className="w-4 h-4 text-brand-blue" />
                        ) : (
                            <>
                                {node.type === 'code' && <FileCode className="w-4 h-4 text-brand-cyan" />}
                                {node.type === 'text' && <FileText className="w-4 h-4 text-gray-400" />}
                                {node.type === 'image' && <ImageIcon className="w-4 h-4 text-brand-slate" />}
                                {node.type === 'binary' && <HardDrive className="w-4 h-4 text-brand-slate" />}
                            </>
                        )}

                        {/* Name */}
                        <span className="truncate flex-1">{node.name}</span>

                        {/* System Lock Icon */}
                        {node.isSystem && <Lock className="w-3 h-3 text-brand-slate opacity-50" />}
                    </div>

                    {/* Children */}
                    {node.type === 'folder' && node.isOpen && node.children && (
                        <div className="border-l border-brand-border ml-4">
                            {renderTree(node.children, fullPath)}
                        </div>
                    )}
                </li>
            );
        })}
      </ul>
    );
  };

  return (
    <PageContainer>
      {/* --- Left Sidebar: Explorer --- */}
      <Sidebar position="left" className="bg-brand-bg/50 w-[300px]">
        {/* Header */}
        <div className="p-4 border-b border-brand-border flex items-center justify-between">
            <SectionTitle className="mb-0 text-lg">Filesystem</SectionTitle>
            <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="p-1 h-8 w-8 text-brand-gray" title="Refresh">
                    <RefreshCw className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-1 h-8 w-8 text-brand-gray" title="Upload">
                    <Upload className="w-4 h-4" />
                </Button>
            </div>
        </div>
        
        {/* Tree View */}
        <div className="flex-1 overflow-y-auto p-2">
            {renderTree(files)}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-brand-border flex gap-2">
             <Button variant="secondary" size="sm" className="w-full justify-center">
                 <Plus className="w-4 h-4" /> New Folder
             </Button>
        </div>
      </Sidebar>

      {/* --- Right Content: Stage --- */}
      <MainContent className="bg-brand-bg">
        {selectedFile ? (
            <div className="flex flex-col h-full">
                {/* File Header */}
                <div className="h-14 bg-white border-b border-brand-border px-6 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center text-sm text-brand-gray">
                            <HardDrive className="w-4 h-4 mr-2" />
                            <span className="font-mono">{activePath}</span>
                        </div>
                        {selectedFile.isSystem && (
                            <span className="px-2 py-0.5 rounded-full bg-brand-slate/10 text-brand-slate text-[10px] font-bold uppercase tracking-wider border border-brand-slate/20">
                                Read Only
                            </span>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                         <span className="text-xs text-brand-gray mr-4">
                            {selectedFile.isSystem ? "Last modified by System" : "Unsaved changes"}
                         </span>
                         <Button variant="ghost" size="sm" title="File Info">
                            <Info className="w-4 h-4" />
                         </Button>
                         <Button variant="ghost" size="sm" className="text-brand-error hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                         </Button>
                         {!selectedFile.isSystem && (
                            <Button variant="primary" size="sm">
                                <Save className="w-4 h-4" /> Save
                            </Button>
                         )}
                         {selectedFile.isSystem && (
                             <Button variant="secondary" size="sm">
                                <Download className="w-4 h-4" /> Download
                             </Button>
                         )}
                    </div>
                </div>

                {/* Editor / Preview Area */}
                <div className="flex-1 overflow-hidden relative">
                    {selectedFile.type === 'image' ? (
                         <div className="w-full h-full flex items-center justify-center bg-[#e5e7eb] p-8" style={{backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'}}>
                            <div className="bg-white p-2 shadow-lg rounded max-w-full max-h-full">
                                <div className="w-64 h-64 bg-brand-bg flex items-center justify-center text-brand-gray flex-col gap-2 border border-brand-border">
                                    <ImageIcon className="w-12 h-12 opacity-20" />
                                    <span className="text-xs font-mono">Image Preview</span>
                                </div>
                            </div>
                         </div>
                    ) : selectedFile.type === 'binary' ? (
                        <div className="w-full h-full flex flex-col items-center justify-center text-brand-gray">
                            <div className="w-16 h-16 bg-brand-slate/10 rounded-full flex items-center justify-center mb-4 text-brand-slate">
                                <HardDrive className="w-8 h-8" />
                            </div>
                            <h3 className="font-serif text-xl text-brand-dark mb-2">Binary File</h3>
                            <p className="text-sm max-w-xs text-center">This file content cannot be displayed in the editor.</p>
                            <Button variant="secondary" className="mt-6">Download File</Button>
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col">
                            {/* Simple Code Editor Simulation */}
                            <textarea 
                                className="flex-1 w-full h-full resize-none p-6 font-mono text-sm bg-brand-bg/30 text-brand-dark outline-none leading-relaxed"
                                defaultValue={selectedFile.content}
                                readOnly={selectedFile.isSystem}
                                spellCheck={false}
                            />
                        </div>
                    )}
                </div>
            </div>
        ) : (
            // --- Empty State ---
            <div className="w-full h-full flex items-center justify-center p-8">
                <div className="max-w-md text-center">
                    <div className="w-20 h-20 bg-brand-bg rounded-2xl border border-brand-border mx-auto mb-6 flex items-center justify-center shadow-sm">
                        <HardDrive className="w-10 h-10 text-brand-slate" />
                    </div>
                    <SectionTitle className="text-3xl mb-4">Agent Filesystem</SectionTitle>
                    <p className="text-brand-gray mb-8 leading-relaxed">
                        This is a visual representation of the AI's Virtual Filesystem (VFS). 
                        It allows you to inspect what the agent is reading and creating in real-time.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-left">
                        <Card className="border-brand-blue/20 bg-brand-blue/5">
                            <div className="flex items-center gap-2 mb-2 font-bold text-brand-blue text-xs uppercase tracking-wide">
                                <Folder className="w-3 h-3" /> Workspace
                            </div>
                            <p className="text-xs text-brand-dark">
                                The Agent's workbench. It has full read/write access here to generate code, assets, and logs.
                            </p>
                        </Card>
                        <Card className="border-brand-slate/20 bg-brand-slate/5">
                             <div className="flex items-center gap-2 mb-2 font-bold text-brand-slate text-xs uppercase tracking-wide">
                                <Lock className="w-3 h-3" /> System
                            </div>
                            <p className="text-xs text-brand-dark">
                                Protected memory and knowledge base. The Agent can read these instructions but cannot modify them.
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        )}
      </MainContent>
    </PageContainer>
  );
};

export default FilesystemPage;