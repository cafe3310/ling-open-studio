# 2026-02-22-22-11-设计-ModelWrite写作助手State全量梳理

## 1. 核心会话状态 (WriteSessionState)
这是持久化到 VFS (`/workspace/sessions/${threadId}/state.json`) 的真相来源。

```typescript
interface WriteSessionState {
  metadata: {
    title: string;
    summary: string; // 故事全局大纲
  };
  
  // 文档状态：采用片段化设计，支持异步预处理
  document: {
    segments: TextSegment[];
    cursorOffset: number;
    selection: { start: number; end: number } | null;
    activeSegmentId: string | null;
  };

  // 知识库：统一条目管理
  knowledgeBase: {
    worldSettings: KnowledgeEntry[];
    characters: KnowledgeEntry[];
    concepts: KnowledgeEntry[];
  };

  // 运行时临时状态（非持久化）
  runtime: {
    activeInspirationIds: string[]; // 选中的灵感卡片
    ghostText: string | null;      // 当前预测的幻影文字
    isGenerating: boolean;         // 推理中阻塞标志
    statusMessage: string;         // 展示在 StatusViewer 的简讯
    preprocessorQueue: string[];   // 待处理段落队列
  };
}
```

## 2. 片段数据结构 (TextSegment)
```typescript
interface TextSegment {
  id: string;
  content: string;
  // raw (书写中), processing (计算中), completed (已索引)
  status: 'raw' | 'processing' | 'completed';
  
  // 预处理产物 (衍生数据)
  preprocessed: {
    summary: string | null;      // 单句摘要
    extractedEntities: string[]; // 检测到的实体名数组
  } | null;
}
```

## 3. 知识条目结构 (KnowledgeEntry)
```typescript
interface KnowledgeEntry {
  id: string;
  name: string;
  definition: string;
  isAuto: boolean;               // 是否为 AI 自动识别
  isApproved: boolean;           // 是否经用户转正
  suggestions: string[];         // AI 提供的建议碎片
  lastDetectedAt: number;        // 时间戳，用于排序
}
```

## 4. 推理上下文 (Derived Context)
在触发 LLM 时由前端临时构造，不保存：
*   **Sliding Window (滑动窗口)**: 最近 3 个 `TextSegment`。
*   **Compressed History (压缩历史)**: 所有已完成片段的 `preprocessed.summary` 拼接。
*   **Active Lore**: 当前活跃灵感的内容 + 匹配到的 KnowledgeEntry。
