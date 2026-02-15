/**
 * 设计选项的选择 (Visual Aesthetic)
 */
export type DesignOption = {
  id: string;
  name: string;                // 显示的名字 (e.g., "Swiss International")
  icon: string;                // 显示的图标 (Lucide icon name)
  description_general: string; // 给模型的整体风格描述
  description_color: string;   // 给模型的色彩指导
  description_shape: string;   // 给模型的样式/形状指导
  description_font: string;    // 给模型的字体指导
};

/**
 * 技术栈的选择 (Tech Stack)
 */
export type TechStackOption = {
  id: string;
  name: string;                 // 显示的名字 (e.g., "HTML + Tailwind")
  description_style: string;    // 给设计风格 (Node A) 的技术限制或建议
  description_expander: string; // 给充实方案 (Node B) 的结构建议
  boilerplate_code: string;     // 核心代码骨架 (用于 Node C)
};
