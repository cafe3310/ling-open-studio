import { VirtualFile } from './types';

const DB_NAME = 'ling-vfs-db';
const DB_VERSION = 1;
const STORE_NAME = 'files';

export class VFSDatabase {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    if (this.db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          
          // 索引：threadId 用于隔离不同会话
          store.createIndex('threadId', 'threadId', { unique: false });
          
          // 复合索引：[threadId, path] 用于唯一路径检查和范围查询
          store.createIndex('threadId_path', ['threadId', 'path'], { unique: true });
          
          // 索引：type 用于快速过滤
          store.createIndex('type', 'type', { unique: false });
        }
      };
    });
  }

  private getStore(mode: IDBTransactionMode = 'readonly'): IDBObjectStore {
    if (!this.db) throw new Error('Database not initialized');
    const transaction = this.db.transaction(STORE_NAME, mode);
    return transaction.objectStore(STORE_NAME);
  }

  async put(file: VirtualFile): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('readwrite');
      const request = store.put(file);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async get(id: string): Promise<VirtualFile | undefined> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('readonly');
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getByPath(threadId: string, path: string): Promise<VirtualFile | undefined> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('readonly');
      const index = store.index('threadId_path');
      const request = index.get([threadId, path]);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('readwrite');
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async listFiles(threadId: string, pathPrefix?: string): Promise<VirtualFile[]> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('readonly');
      const index = store.index('threadId_path');
      
      let range: IDBKeyRange;
      if (pathPrefix) {
        // 使用范围查询：[threadId, prefix] 到 [threadId, prefix + '\uffff']
        range = IDBKeyRange.bound([threadId, pathPrefix], [threadId, pathPrefix + '\uffff']);
      } else {
        range = IDBKeyRange.bound([threadId, ''], [threadId, '\uffff']);
      }

      const request = index.getAll(range);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteFilesByPrefix(threadId: string, pathPrefix: string): Promise<void> {
    const files = await this.listFiles(threadId, pathPrefix);
    if (files.length === 0) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      for (const file of files) {
        store.delete(file.id);
      }

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}
