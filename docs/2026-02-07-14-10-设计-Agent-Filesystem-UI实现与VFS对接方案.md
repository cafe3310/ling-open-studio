# 设计 - Agent Filesystem UI 实现与 VFS 对接方案

## 1. 背景 (Background)
用户通过 Google AI Studio 设计并生成了 `Agent Filesystem` Tab 的前端原型。该原型展示了一个基于 Master-Detail 布局的文件管理器，包含目录树、文件预览、权限标识等功能。

## 2. 工作目录调整
- **删除旧代码**: 移除了 `docs/reference/2026-02-07-00-30-inclusionai-demo`。
- **存入新参考**:
    - 代码目录: `docs/reference/2026-02-07-14-00-inclusionai-demo-vfs` (包含最新的 `FilesystemPage.tsx`)。
    - 屏幕截图: `docs/reference/2026-02-07-14-00-screenshot-vfs.png`。

## 3. UI 实现方案 (Implementation Plan)

### 3.1 结构拆解
原型代码 `FilesystemPage.tsx` 是一个单文件大组件，为了更好地维护，我打算将其拆分为以下 React 组件：
- `FilesystemTab`: 主容器，负责状态管理和布局。
- `FileTree`: 递归渲染目录树，处理展开/折叠和选中逻辑。
- `FileBreadcrumb`: 显示当前路径。
- `FileEditor`: 集成真正的 Monaco Editor (而不是 `textarea`)。
- `FilePreview`: 处理图片、二进制文件的预览。
- `EmptyState`: 未选中文件时的引导页面。

### 3.2 技术栈补齐
- **图标库**: 继续使用 `lucide-react`。
- **布局**: 使用 `shadcn/ui` 的 `ResizablePanel` 组件，支持用户手动调整目录树宽度。
- **编辑器**: 集成 `@monaco-editor/react`，实现语法高亮和代码折叠。

## 4. VFS 对接方案 (VFS Integration)

### 4.1 数据层对接
目前的 UI 使用 Mock Data (`initialData`)。对接 VFS 的步骤如下：

1.  **实现 `useVFS` Hook**:
    - 调用之前设计的 `IVirtualFileSystem` 接口。
    - 使用 `SWR` 或 `React Query` 封装 `listDir` 和 `readFile` 请求，实现自动刷新。
2.  **树结构转换**:
    - 由于 VFS 内部是扁平化的（通过路径前缀模拟目录），需要写一个工具函数将 VFS 的文件列表转换为 UI 需要的树形递归结构。
3.  **实时更新 (Subscription)**:
    - 利用 VFS 的 `subscribe` 接口，当 AI 修改 `/workspace` 下的文件时，UI 自动触发重新加载。

### 4.2 核心操作流
- **文件选中**: 点击文件 -> 调用 `vfs.readFile(threadId, path)` -> 加载到编辑器。
- **文件保存**: 编辑器内容变更 -> 点击保存 -> 调用 `vfs.writeFile(threadId, path, content, 'user')`。
- **权限控制**:
    - 如果文件路径以 `/system/` 开头，UI 强制设置 `readOnly: true` 并显示锁图标。
    - `lastModifiedBy` 属性用于在 Header 显示“由 AI 修改”或“由您修改”。

## 5. 后续 TODO
- [ ] 实现 `lib/vfs/` 核心库 (IndexedDB)。
- [ ] 创建 `components/filesystem/` 目录并拆分原型代码。
- [ ] 将 `FilesystemTab` 集成到主界面的 Tab 切换逻辑中。
