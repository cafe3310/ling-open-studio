export type FileType = 
  | 'text'      // md, txt, xml
  | 'code'      // js, ts, py, html, css
  | 'json'      // json
  | 'image'     // png, jpg, svg (base64)
  | 'binary';   // other

export interface VirtualFile {
  id: string;           // UUID
  threadId: string;     // 所属线程 ID
  path: string;         // 完整路径，必须以 /workspace/ 或 /system/ 开头
  name: string;         // 文件名 (path.split('/').pop())
  
  content: string | ArrayBuffer; // 内容
  
  type: FileType;       // 抽象类型
  mimeType: string;     // 具体 MIME (e.g., "application/javascript")
  size: number;         // 字节数
  
  createdAt: number;    // 时间戳
  updatedAt: number;    // 时间戳
  
  metadata: {
    lastModifiedBy: 'agent' | 'user'; // 标记最后修改者
    isTransient?: boolean;           // 是否为不落库的内存文件
    [key: string]: any;              // 扩展元数据
  };
  
  isReadOnly?: boolean; // 辅助标记，用于 UI 展示锁图标
}

export interface IVirtualFileSystem {
  init(): Promise<void>;

  /**
   * 写入文件
   * @param source 'agent' | 'user' - 默认为 'agent'
   * @throws PermissionError 如果 agent 尝试写入受保护区域
   */
  writeFile(threadId: string, path: string, content: string | ArrayBuffer, source?: 'agent' | 'user'): Promise<VirtualFile>;

  readFile(threadId: string, path: string): Promise<VirtualFile>;

  exists(threadId: string, path: string): Promise<boolean>;

  deleteFile(threadId: string, path: string, source?: 'agent' | 'user'): Promise<void>;

  renameFile(threadId: string, oldPath: string, newPath: string, source?: 'agent' | 'user'): Promise<VirtualFile>;
  
  stat(threadId: string, path: string): Promise<Omit<VirtualFile, 'content'>>;

  /**
   * 列出指定前缀下的文件
   * @param dirPath 例如 "/workspace/src/"
   */
  listDir(threadId: string, dirPath?: string): Promise<VirtualFile[]>;

  /**
   * 递归清空目录
   */
  deleteDir(threadId: string, dirPath: string, source?: 'agent' | 'user'): Promise<void>;
  
  /**
   * 清空整个线程的工作区
   */
  clearThread(threadId: string): Promise<void>;

  /**
   * 监听该线程下任何文件的变更
   */
  subscribe(threadId: string, callback: () => void): () => void;
}

export class PermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PermissionError';
  }
}
