# 2026-02-23-20-56-设计-写作助手叙事流续写-NarrativeFlow-流式开发计划

## 1. 背景 (Background)
用户需要实现 "Continue Writing" 功能的核心闭环：点击按钮后，AI 基于全局大纲、知识库、已激活灵感及近期历史，流式生成高质量的后续段落，并实时回填至编辑器画布。

## 2. 来源文档 (Source)
- [[write-architect-v2-core.md]]
- [[2026-02-22-22-12-设计-ModelWrite智能体架构与Graph流程全量梳理.md]]

## 3. 目标 (Objective)
实现高质量、流式的续写体验，深度遵循故事设定。

## 4. 上下文工程 (Context Engineering)
续写功能对上下文的“忠实度”要求极高。我们将采用以下 Prompt 结构：

### 4.1 核心指令集
*   **Base Directive**: “你是一位才华横溢的小说家，请接续下文进行创作。保持文风一致，逻辑严密。”
*   **Active Inspirations (强约束)**: “【特别注意】当前的创作方向需深度参考以下灵感：{activeInspirations}”。
*   **Knowledge Context**: 注入当前语境中相关的角色与世界观设定。

### 4.2 XML 封装结构
```xml
<story_foundation>
  {storySummary}
</story_foundation>
<narrative_memory>
  {historySummaries}
</narrative_memory>
<active_lore>
  {approvedLore}
</active_lore>
<current_manuscript>
  {recentText}
</current_manuscript>
<creative_directives>
  {activeInspirations}
</creative_directives>
```

## 5. 实施步骤 (Implementation Steps)

### 第一阶段：后端 NarrativeFlow Graph 模块
1.  **`flow/state.ts`**:
    *   定义输入：`storySummary`, `historySummaries`, `recentText`, `activeLore`, `activeInspirations`。
    *   定义输出：`generatedText` (流式)。
2.  **`flow/nodes.ts`**:
    *   `ContextSynthesizer`: 负责拼装上述 XML 上下文。
    *   `NarrativeWriter`: 调用 `Ling_2_5_1T` (Flagship)。设置 `stream: true`, `temperature: 0.8`。
3.  **`flow/graph.ts`**: 编排简单的线性链路。

### 第二阶段：流式 API 路由
1.  **`app/api/chat/write/generate/route.ts`**:
    *   接收前端发送的完整上下文包。
    *   使用标准流式返回模式，将 `NarrativeFlow` 的产物实时推送至前端。

### 第三阶段：前端 Store 与 画布联动
1.  **Store (`store.ts`)**:
    *   增加 `isGenerating` 全局状态，用于禁用按钮并显示加载态。
2.  **Canvas 逻辑 (`WriteCanvas.tsx`)**:
    *   点击 Continue 后，在 `segments` 数组末尾 `push` 一个 `status: 'raw'` 的空段落。
    *   利用 `TextDecoder` 监听响应。
    *   **实时更新**: 随着流数据的到来，调用 `updateSegment` 增量填充内容。
    *   **自动收尾**: 流结束后，自动对该新段落调用一次 `triggerPreprocessing` (生成摘要/识别实体)。

## 6. 验证与测试 (Verification & Testing)
1.  **灵感一致性**: 激活“暴雨”灵感，验证生成的文字是否包含相关环境描写。
2.  **角色忠实度**: 验证生成的对话是否符合知识库中该角色的定义。
3.  **流式稳定性**: 验证在生成过程中再次点击按钮是否被正确拦截（锁状态）。
