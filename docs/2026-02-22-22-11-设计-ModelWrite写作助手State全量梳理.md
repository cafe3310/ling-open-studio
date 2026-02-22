# 2026-02-22-22-11-设计-ModelWrite写作助手State全量梳理

## 1. 核心会话状态 (WriteSessionState)
这是持久化到 VFS (`/workspace/sessions/${threadId}/state.json`) 的真相来源，也是驱动 UI 渲染的全局 Store。

```typescript
interface WriteSessionState {
  // 作品基础信息 (参考 write-left-sidebar.tsx)
  metadata: {
    title: string;
    summary: string; // 故事全局大纲，对应 Dialog 中的编辑内容
  };
  
  // 文档状态：采用片段化设计 (参考 write-canvas.tsx: Segment[])
  document: {
    segments: TextSegment[];
    cursorOffset: number;
    selection: { start: number; end: number } | null;
    activeSegmentId: string | null;
  };

  // 知识库：统一条目管理 (参考 write-left-sidebar.tsx: EntryDialog props)
  knowledgeBase: {
    worldSettings: KnowledgeEntry[];
    characters: KnowledgeEntry[];
    concepts: KnowledgeEntry[];
  };

  // 运行时临时状态 (参考 write-right-sidebar.tsx & write-status-viewer.tsx)
  runtime: {
    activeInspirationIds: string[]; // 选中的灵感卡片 ID
    ghostText: string | null;      // 当前预测的占位文本
    isGenerating: boolean;         // 全局推理阻塞标志
    
    // 监控状态 (对应 WriteStatusViewer)
    graphStates: Record<string, {
      status: 'idle' | 'running' | 'success' | 'error';
      progress?: number;
      lastResult?: string;
    }>;
    
    preprocessorQueue: string[];   // 待处理段落 ID 队列
  };
}
```

## 2. 片段数据结构 (TextSegment)
**代码引用**: `src/components/assistants/write-architect-ref/write-canvas.tsx` 中的 `interface Segment`。

```typescript
interface TextSegment {
  id: string;
  content: string;
  // 状态机颜色映射: raw(#1A1A1A), processing(#D97706), completed(#312E81)
  status: 'raw' | 'processing' | 'completed';
  
  // 预处理产物 (衍生数据，驱动 Insight Margin 渲染)
  preprocessed: {
    summary: string | null;      // 单句摘要
    extractedEntities: string[]; // 检测到的实体名数组 (对应 Entity Pills)
  } | null;
}
```

## 3. 知识条目结构 (KnowledgeEntry)
**代码引用**: `src/components/assistants/write-architect-ref/write-left-sidebar.tsx` 中的 `EntryDialog` 及 `CharacterItem` 属性。

```typescript
interface KnowledgeEntry {
  id: string;
  name: string;
  definition: string;            // 用户正式定义 (Dialog 左侧内容)
  type: 'manual' | 'auto';       // manual(实色/手动), auto(虚线/AI 识别)
  isApproved: boolean;           // 是否经用户点击 "Approve Entry" 转正
  suggestions: string[];         // AI 提供的建议碎片 (Dialog 右侧内容)
  lastDetectedAt?: number;       // 最后一次在正文中被检测到的时间
}
```

## 4. 灵感卡片结构 (InspirationCard)
**代码引用**: `src/components/assistants/write-architect-ref/write-right-sidebar.tsx` 中的 `InspirationCard` 属性。

```typescript
interface InspirationCard {
  id: string;
  type: 'Plot' | 'Atmosphere' | 'Dialogue';
  title: string;
  content: string;               // 核心灵感文本 (带引号展示)
  isActive: boolean;             // 对应 activeInspirations 数组
}
```

## 5. 推理上下文 (Derived Context)
在触发各 Agent Graph (如 NarrativeFlow) 时，由前端 `useMemo` 或 `selector` 动态计算，不直接存储。

*   **Semantic Window**: 
    *   `historySummaries`: 拼接所有 `completed` 片段的 `preprocessed.summary`。
    *   `currentContext`: `segments[N-1].content` + `segments[N].content` (光标前)。
*   **Active Lore**: 
    *   `loreItems`: 过滤 `knowledgeBase` 中所有 `isApproved === true` 且在当前 Context 中出现的条目。
    *   `activeInspirationContent`: 获取 `activeInspirationIds` 对应的卡片内容。
