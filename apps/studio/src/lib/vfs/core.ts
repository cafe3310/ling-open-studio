import { v4 as uuidv4 } from 'uuid';
import { 
  IVirtualFileSystem, 
  VirtualFile, 
  PermissionError, 
  FileType 
} from './types';
import { VFSDatabase } from './db';
import { 
  normalizePath, 
  getFileName, 
  getFileTypeInfo 
} from './utils';

export class VirtualFileSystem implements IVirtualFileSystem {
  private db: VFSDatabase;
  private listeners: Map<string, Set<() => void>> = new Map();
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.db = new VFSDatabase();
  }

  async init(): Promise<void> {
    if (this.initPromise) return this.initPromise;
    this.initPromise = (async () => {
      console.log('[VFS] Initializing database...');
      await this.db.init();
      console.log('[VFS] Database initialized.');
    })();
    return this.initPromise;
  }

  private async ensureInit(): Promise<void> {
    if (!this.initPromise) {
      await this.init();
    } else {
      await this.initPromise;
    }
  }

  private notify(threadId: string) {
    console.log(`[VFS] Notifying listeners for thread: ${threadId}`);
    const threadListeners = this.listeners.get(threadId);
    if (threadListeners) {
      threadListeners.forEach(cb => cb());
    }
  }

  private checkPermission(path: string, source: 'agent' | 'user' = 'agent') {
    const normalized = normalizePath(path);
    // Agent 只能写入 /workspace/
    if (source === 'agent' && !normalized.startsWith('/workspace/')) {
      console.error(`[VFS] Permission Denied: Agent attempted to write to ${normalized}`);
      throw new PermissionError(`Agent is not allowed to write to: ${normalized}`);
    }
  }

  async writeFile(
    threadId: string, 
    path: string, 
    content: string | ArrayBuffer, 
    source: 'agent' | 'user' = 'agent'
  ): Promise<VirtualFile> {
    await this.ensureInit();
    const normalizedPath = normalizePath(path);
    console.log(`[VFS] Writing file: ${normalizedPath} (source: ${source}, thread: ${threadId})`);
    this.checkPermission(normalizedPath, source);

    const fileName = getFileName(normalizedPath);
    const { mimeType, type } = getFileTypeInfo(fileName);
    const size = typeof content === 'string' ? new Blob([content]).size : content.byteLength;
    
    const existingFile = await this.db.getByPath(threadId, normalizedPath);
    
    const file: VirtualFile = {
      id: existingFile?.id || uuidv4(),
      threadId,
      path: normalizedPath,
      name: fileName,
      content,
      type,
      mimeType,
      size,
      createdAt: existingFile?.createdAt || Date.now(),
      updatedAt: Date.now(),
      metadata: {
        lastModifiedBy: source,
      },
      isReadOnly: normalizedPath.startsWith('/system/')
    };

    await this.db.put(file);
    this.notify(threadId);
    return file;
  }

  async readFile(threadId: string, path: string): Promise<VirtualFile> {
    await this.ensureInit();
    const normalizedPath = normalizePath(path);
    console.log(`[VFS] Reading file: ${normalizedPath} (thread: ${threadId})`);
    const file = await this.db.getByPath(threadId, normalizedPath);
    if (!file) {
      console.warn(`[VFS] File not found: ${normalizedPath}`);
      throw new Error(`File not found: ${normalizedPath}`);
    }
    return file;
  }

  async exists(threadId: string, path: string): Promise<boolean> {
    await this.ensureInit();
    const normalizedPath = normalizePath(path);
    const file = await this.db.getByPath(threadId, normalizedPath);
    return !!file;
  }

  async deleteFile(threadId: string, path: string, source: 'agent' | 'user' = 'user'): Promise<void> {
    await this.ensureInit();
    const normalizedPath = normalizePath(path);
    console.log(`[VFS] Deleting file: ${normalizedPath} (source: ${source})`);
    this.checkPermission(normalizedPath, source);

    const file = await this.db.getByPath(threadId, normalizedPath);
    if (file) {
      await this.db.delete(file.id);
      this.notify(threadId);
    }
  }

  async renameFile(
    threadId: string, 
    oldPath: string, 
    newPath: string, 
    source: 'agent' | 'user' = 'user'
  ): Promise<VirtualFile> {
    await this.ensureInit();
    const normalizedOld = normalizePath(oldPath);
    const normalizedNew = normalizePath(newPath);
    console.log(`[VFS] Renaming: ${normalizedOld} -> ${normalizedNew}`);
    
    this.checkPermission(normalizedOld, source);
    this.checkPermission(normalizedNew, source);

    const file = await this.readFile(threadId, normalizedOld);
    
    // 如果目标路径已存在文件，先删除
    const targetFile = await this.db.getByPath(threadId, normalizedNew);
    if (targetFile) {
      await this.db.delete(targetFile.id);
    }

    const updatedFile: VirtualFile = {
      ...file,
      path: normalizedNew,
      name: getFileName(normalizedNew),
      updatedAt: Date.now(),
      metadata: {
        ...file.metadata,
        lastModifiedBy: source,
      }
    };

    await this.db.put(updatedFile);
    await this.db.delete(file.id);
    
    this.notify(threadId);
    return updatedFile;
  }

  async stat(threadId: string, path: string): Promise<Omit<VirtualFile, 'content'>> {
    await this.ensureInit();
    const file = await this.readFile(threadId, path);
    const { content, ...rest } = file;
    return rest;
  }

  async listDir(threadId: string, dirPath: string = '/'): Promise<VirtualFile[]> {
    await this.ensureInit();
    let normalizedDir = normalizePath(dirPath);
    if (normalizedDir !== '/' && !normalizedDir.endsWith('/')) {
      normalizedDir += '/';
    }
    
    return this.db.listFiles(threadId, normalizedDir === '/' ? '' : normalizedDir);
  }

  async deleteDir(threadId: string, dirPath: string, source: 'agent' | 'user' = 'user'): Promise<void> {
    await this.ensureInit();
    let normalizedDir = normalizePath(dirPath);
    if (normalizedDir !== '/' && !normalizedDir.endsWith('/')) {
      normalizedDir += '/';
    }
    
    this.checkPermission(normalizedDir, source);
    await this.db.deleteFilesByPrefix(threadId, normalizedDir);
    this.notify(threadId);
  }

  async clearThread(threadId: string): Promise<void> {
    await this.ensureInit();
    await this.db.deleteFilesByPrefix(threadId, '');
    this.notify(threadId);
  }

  subscribe(threadId: string, callback: () => void): () => void {
    if (!this.listeners.has(threadId)) {
      this.listeners.set(threadId, new Set());
    }
    this.listeners.get(threadId)!.add(callback);
    
    return () => {
      const threadListeners = this.listeners.get(threadId);
      if (threadListeners) {
        threadListeners.delete(callback);
        if (threadListeners.size === 0) {
          this.listeners.delete(threadId);
        }
      }
    };
  }
}

// 单例导出
export const vfs = new VirtualFileSystem();
