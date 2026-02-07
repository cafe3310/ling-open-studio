# 2026-02-07-23-21-参考-AssistantUI-useMessage-Hook-深度解析

在 `assistant-ui` 开发中，`useMessage` 是最核心的 Hook 之一，用于在 `MessagePrimitive.Root` 上下文中访问当前消息的状态。本文档记录了其真实的数据结构和正确用法。

## 1. 核心用法 (Usage)

`useMessage` 必须在 `MessagePrimitive.Root` 或其子组件中使用。

```typescript
import { useMessage } from "@assistant-ui/react";

const MyComponent = () => {
  // 推荐：使用 selector 以优化性能
  const role = useMessage((m) => m.role);
  const isRunning = useMessage((m) => m.status.type === 'running');
  
  // 或者获取整个消息对象
  const message = useMessage();
  
  // ...
}
```

## 2. 消息对象结构 (Message Object Structure)

通过实际抓包确认，`useMessage` 返回的对象（或其 selector 参数）结构如下：

```json
{
  "id": "UBwyFXwax42rOM5W",         // 唯一消息 ID
  "role": "assistant",              // 角色: "assistant" | "user" | "system"
  "content": [                      // 内容数组 (MessagePart)
    {
      "type": "text",
      "text": "Hello world"
    },
    {
      "type": "reasoning",          // 思考过程内容
      "reasoning": "I should say hello."
    }
  ],
  "status": {
    "type": "complete",             // 状态: "running" | "complete" | "error"
    "reason": "unknown"             // 结束原因
  },
  "metadata": {
    "unstable_data": [],            // 自定义数据 (如 Trace)
    "steps": [],                    // 工具调用步骤
    "custom": {}
  },
  "index": 1,                       // 在 Thread 中的索引
  "isLast": true,                   // 是否为当前 Thread 的最后一条消息
  "parentId": "...",                // 父消息 ID (用于分支)
  "branchNumber": 1,
  "branchCount": 1,
  "createdAt": "2026-02-07T..."
}
```

## 3. 关键属性说明

### 3.1 content (MessagePart[])
消息内容被拆分为多个 Part。
- **Text Part**: `{ type: 'text', text: string }`
- **Reasoning Part**: `{ type: 'reasoning', reasoning: string }` (如果使用了 ReasoningSplitter)
- **Tool Call Part**: 通常在 `metadata.steps` 中，但也可能作为特定的 Part 类型。

### 3.2 status.type
用于控制 UI 状态：
- `running`: 正在流式输出，此时内容是不完整的。
- `complete`: 渲染结束，此时进行协议解析最为安全。
- `error`: 发生错误。

## 4. 常见陷阱 (Pitfalls)

### 4.1 误读层级
**错误认为**：`useMessage` 返回一个包含 `message` 键的对象。
- ❌ `const message = useMessage((s) => s.message);` -> 结果为 `undefined`。
**正确做法**：`useMessage` 返回的对象 **就是** 消息对象本身。
- ✅ `const message = useMessage();`

### 4.2 异步空值
在组件首次挂载时，如果消息尚未完全初始化，`useMessage` 可能会返回空值或结构不全的对象。
**防御性代码**:
```typescript
const message = useMessage();
if (!message || !message.content) return null;
```

### 4.3 Content 提取
由于 `content` 是数组，提取全文的正确方法：
```typescript
const fullText = message.content
  .filter(part => part.type === 'text')
  .map(part => part.text)
  .join('\n');
```
