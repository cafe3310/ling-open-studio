# 设计 - Agent Filesystem UI (浏览器端 VFS 可视化)

## 1. 概述 (Overview)

`Agent Filesystem` 是 `ling-open-studio` 中的一个功能 Tab，旨在为用户提供一个“上帝视角”，用于观察、验证和管理浏览器端虚拟文件系统 (VFS) 中的内容。

由于 VFS 是 AI (Agent) 工作记忆的一部分，该界面不仅是文件管理器，更是理解 AI 行为（它生成了什么、它读取了什么）的窗口。

## 2. 布局结构 (Layout)

页面采用经典的 **Master-Detail (左右分栏)** 布局，保持与整体 "InclusionAI" 风格一致的学术、清洁感。

*   **左侧 (30% - 250px min)**: 文件资源管理器 (File Explorer)。
*   **右侧 (70%)**: 内容预览与编辑区 (Content Stage)。

### 2.1 视觉风格 (Visual Style)
遵循项目定义的 "InclusionAI" 风格：
*   **底色**: Off-white / 极淡的冷灰 (`bg-slate-50`).
*   **字体**: 标题使用 Serif (Playfair Display), 正文 Sans (Inter).
*   **线条**: 极细的灰色边框 (`border-slate-200`)。
*   **强调色**: 黑色为主，辅以柔和的紫/蓝渐变用于选中状态或图标。

## 3. 功能模块详解

### 3.1 左侧：文件资源管理器 (File Tree)

**核心功能**:
*   **目录树展示**: 
    *   根节点通常包含 `/workspace` (User/Agent R/W) 和 `/system` (User R/W, Agent R)。
    *   使用不同的图标区分文件夹、不同类型的文件 (Code, Image, Markdown)。
    *   **特殊标识**: 对于 `/system` 等受保护目录，使用锁图标或颜色微调提示其特殊权限（对 Agent 只读）。
*   **操作工具栏 (Action Bar)**:
    *   位于目录树顶部或底部。
    *   功能: `Refresh` (刷新), `Upload` (上传), `New Folder` (新建文件夹), `New File` (新建文件)。
*   **文件操作 (Context Menu/Drag & Drop)**:
    *   支持文件/文件夹的**移动** (Drag & Drop)。
    *   右键菜单: `Rename` (重命名), `Delete` (删除), `Download` (下载), `Copy Path` (复制路径)。

### 3.2 右侧：内容预览与编辑区 (Editor/Preview)

根据选中文件的类型，动态切换渲染组件。

**通用头部 (Header)**:
*   显示当前文件路径 (Breadcrumb)。
*   显示文件状态 (已保存/未保存)。
*   **操作按钮**: `Save` (保存), `Download` (下载), `Delete` (删除), `Info` (查看元数据)。

**内容视图 (Views)**:

1.  **文本/代码 (Text/Code/HTML/SVG)**:
    *   集成 **Monaco Editor** (或轻量级 Code Editor)。
    *   支持语法高亮。
    *   支持行号。
    *   HTML/SVG 文件提供 "Code" 和 "Preview" 两个子 Tab 切换。
    *   **编辑与保存**: 修改内容后，触发 Dirty 状态，点击保存调用 VFS `writeFile` 接口。

2.  **图片 (Image - PNG/JPG/WEBP)**:
    *   居中展示图片。
    *   背景显示棋盘格 (Checkerboard) 以体现透明度。
    *   底部显示图片尺寸和大小信息。

3.  **Markdown**:
    *   双栏模式 (Split View) 或 Tab 切换模式：左侧源码，右侧渲染预览。
    *   渲染样式应与应用整体风格一致。

4.  **二进制/未知文件**:
    *   显示文件图标和大小。
    *   提示 "Binary file not shown" 或 "Preview not available"。
    *   仅提供下载按钮。

### 3.3 解释与说明 (Explanation)

为了帮助用户理解 VFS 的概念，界面应包含引导信息：

*   **Empty State (未选中文件时)**: 右侧显示“Agent Filesystem 说明书”。
    *   解释 `/workspace`: "AI 的工作台，它可以自由读写这里的代码和文档。"
    *   解释 `/system`: "知识库与规则，AI 可以读取这里的信息来指导工作，但不能修改。"
*   **Info Panel (可选)**: 点击文件详情时，弹出侧边栏或模态框，显示文件的元数据（创建时间、最后修改者是 User 还是 Agent）。

## 4. 交互流程 (Interaction Flow)

1.  **上传**: 用户点击“上传” -> 选择本地文件 -> 文件被写入 VFS 当前选中目录。
2.  **移动**: 用户拖拽 `/workspace/a.txt` 到 `/workspace/backup/` -> VFS 执行 `renameFile` -> 列表刷新。
3.  **编辑**: 用户点击 `style.css` -> 右侧加载编辑器 -> 用户修改代码 -> 按 `Ctrl+S` -> VFS 保存内容 -> Toast 提示 "Saved"。

## 5. 面向 AI Studio 的输入准备

为了让 Google AI Studio 生成高质量的原型，我们需要提供：
1.  **角色设定**: UI/UX 专家。
2.  **风格约束**: 严格的 Tailwind + Shadcn UI + InclusionAI 风格。
3.  **组件清单**: TreeView, ResizablePanel, CodeEditor, Toolbar。
