import { FileType } from './types';

/**
 * 规范化路径：确保以 / 开头，移除重复的 /
 */
export function normalizePath(path: string): string {
  let p = path.replace(/\/+/g, '/');
  if (!p.startsWith('/')) {
    p = '/' + p;
  }
  // 移除末尾的 /，除非是根路径 /
  if (p.length > 1 && p.endsWith('/')) {
    p = p.slice(0, -1);
  }
  return p;
}

/**
 * 获取文件名
 */
export function getFileName(path: string): string {
  return normalizePath(path).split('/').pop() || '';
}

/**
 * 获取父目录路径
 */
export function getParentDir(path: string): string {
  const parts = normalizePath(path).split('/');
  parts.pop();
  return parts.join('/') || '/';
}

/**
 * 根据文件名检测 MIME 类型和 FileType
 */
export function getFileTypeInfo(fileName: string): { mimeType: string; type: FileType } {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  const mimeMap: Record<string, { mimeType: string; type: FileType }> = {
    // Code
    js: { mimeType: 'application/javascript', type: 'code' },
    jsx: { mimeType: 'text/jsx', type: 'code' },
    ts: { mimeType: 'application/typescript', type: 'code' },
    tsx: { mimeType: 'text/tsx', type: 'code' },
    py: { mimeType: 'text/x-python', type: 'code' },
    html: { mimeType: 'text/html', type: 'code' },
    css: { mimeType: 'text/css', type: 'code' },
    sql: { mimeType: 'application/sql', type: 'code' },
    sh: { mimeType: 'application/x-sh', type: 'code' },
    
    // JSON
    json: { mimeType: 'application/json', type: 'json' },
    
    // Text
    md: { mimeType: 'text/markdown', type: 'text' },
    txt: { mimeType: 'text/plain', type: 'text' },
    xml: { mimeType: 'application/xml', type: 'text' },
    
    // Image
    png: { mimeType: 'image/png', type: 'image' },
    jpg: { mimeType: 'image/jpeg', type: 'image' },
    jpeg: { mimeType: 'image/jpeg', type: 'image' },
    gif: { mimeType: 'image/gif', type: 'image' },
    svg: { mimeType: 'image/svg+xml', type: 'image' },
    webp: { mimeType: 'image/webp', type: 'image' },
  };

  return mimeMap[ext] || { mimeType: 'application/octet-stream', type: 'binary' };
}
