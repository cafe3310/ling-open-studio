import { useState, useEffect, useCallback } from 'react';
import { vfs } from './core';
import { VirtualFile } from './types';

export function useVFS(threadId: string | undefined) {
  const [files, setFiles] = useState<VirtualFile[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 初始化 VFS
  useEffect(() => {
    vfs.init().then(() => {
      setIsInitialized(true);
    });
  }, []);

  // 加载当前线程的文件列表
  const refresh = useCallback(async () => {
    if (!threadId || !isInitialized) return;
    setIsLoading(true);
    try {
      const allFiles = await vfs.listDir(threadId, '/');
      setFiles(allFiles);
    } catch (error) {
      console.error('[VFS Hook] Failed to list files:', error);
    } finally {
      setIsLoading(false);
    }
  }, [threadId, isInitialized]);

  // 监听 VFS 变更
  useEffect(() => {
    if (!threadId || !isInitialized) return;

    // 初始加载
    refresh();

    // 订阅变更
    const unsubscribe = vfs.subscribe(threadId, () => {
      console.log(`[VFS Hook] Change detected for thread ${threadId}, refreshing...`);
      refresh();
    });

    return unsubscribe;
  }, [threadId, isInitialized, refresh]);

  const writeFile = useCallback(async (path: string, content: string | ArrayBuffer, source?: 'agent' | 'user') => {
    if (!threadId) return;
    return await vfs.writeFile(threadId, path, content, source);
  }, [threadId]);

  const readFile = useCallback(async (path: string) => {
    if (!threadId) return null;
    return await vfs.readFile(threadId, path);
  }, [threadId]);

  const deleteFile = useCallback(async (path: string, source?: 'agent' | 'user') => {
    if (!threadId) return;
    return await vfs.deleteFile(threadId, path, source);
  }, [threadId]);

  const deleteDir = useCallback(async (path: string, source?: 'agent' | 'user') => {
    if (!threadId) return;
    return await vfs.deleteDir(threadId, path, source);
  }, [threadId]);

  const renameFile = useCallback(async (oldPath: string, newPath: string, source?: 'agent' | 'user') => {
    if (!threadId) return;
    return await vfs.renameFile(threadId, oldPath, newPath, source);
  }, [threadId]);

  const listDir = useCallback(async (path: string = '/') => {
    if (!threadId) return [];
    return await vfs.listDir(threadId, path);
  }, [threadId]);

  return {
    files,
    isLoading,
    isInitialized,
    refresh,
    writeFile,
    readFile,
    deleteFile,
    deleteDir,
    renameFile,
    listDir,
  };
}
