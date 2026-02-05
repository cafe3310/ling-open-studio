# InclusionAI Design System Specification

## 1. 风格概述 (Style Overview)
本设计系统名为 **"Open Intelligence"**。它旨在传达一种**学术、空灵、精准且可持续**的未来科技感。

-   **核心理念**：Airy Whitespace (空气感留白), Precise Typography (精准排版), Sustainable Palette (可持续色板)。
-   **底色**：不再使用常见的“暗黑科技风”，而是采用极淡的冷灰色 (`Ice Gray`)，营造类似实验室或美术馆的洁净感。
-   **强调色**：使用**青色 (Cyan)** 到 **蓝色 (Blue)** 的渐变，代表数据的流动与智能的冷静。
-   **排版**：
    -   **标题 (Headings)**：使用衬线体 (*Playfair Display*)，赋予其经典、权威的学术气质。
    -   **正文/UI (Body)**：使用无衬线体 (*Inter*)，确保在各种尺寸下的极佳可读性。

## 2. 视觉细节 (Visual Details)

### 2.1 色彩体系 (Color Palette)

| 用途 | 名称 | HEX 值 | 描述 |
| :--- | :--- | :--- | :--- |
| **背景** | `brand-bg` | `#F8F9FB` | 极淡的冷灰，接近纯白但更有质感。 |
| **主色** | `brand-dark` | `#1A1A1A` | 深炭黑，用于主标题和主要按钮，而非纯黑。 |
| **强调色** | `brand-blue` | `#3b82f6` | 经典的交互蓝，用于链接、聚焦状态。 |
| **辅助色** | `brand-cyan` | `#06b6d4` | 科技青，用于高亮和渐变起点。 |
| **中性色** | `brand-gray` | `#64748b` | 蓝灰色，用于次级文本。 |
| **边框** | `brand-border` | `#e2e8f0` | 极淡的边框色，维持轻量感。 |
| **特殊** | `brand-slate` | `#5C8D9E` | 灰青色，用于 Insight/灵感卡片。 |
| **特殊** | `brand-error` | `#D44C66` | 柔和的红，用于警告。 |

### 2.2 渐变 (Gradients)
-   `bg-gradient-accent`: `linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)` (Cyan -> Blue)。

### 2.3 阴影与圆角 (Shadows & Radius)
-   **圆角**: 统一使用 `rounded-lg` (8px) 或 `rounded-xl` (12px) 用于卡片。
-   **阴影**: 默认无阴影或极浅 (`shadow-sm`)，Hover 时增加深度 (`shadow-md`)。
-   **高光**: 卡片 Hover 时，右上角会出现一个模糊的渐变光晕 (`blur-xl`)。

---

## 3. 代码定义 (Code Definition)

### 3.1 Tailwind CSS 配置 (`tailwind.config.ts`)

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Next.js App Router
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F8F9FB',      // Ice Gray
          dark: '#1A1A1A',    // Deep Charcoal
          blue: '#3b82f6',    // Action Blue
          cyan: '#06b6d4',    // Tech Cyan
          gray: '#64748b',    // Neutral Slate
          border: '#e2e8f0',  // Light Border
          slate: '#5C8D9E',   // Insight Slate
          error: '#D44C66',   // Soft Red
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px -5px rgba(6, 182, 212, 0.3)', // Cyan glow
      }
    },
  },
  plugins: [],
};
export default config;
```

### 3.2 核心组件实现 (React + Tailwind)

#### Typography (Components/Typography.tsx)
```tsx
import { cn } from "@/lib/utils";

export const SectionTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h2 className={cn("font-serif text-2xl font-semibold text-brand-dark mb-4 tracking-tight", className)}>
    {children}
  </h2>
);

export const SubTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h3 className={cn("font-sans text-xs font-bold uppercase tracking-wider text-brand-gray mb-2", className)}>
    {children}
  </h3>
);
```

#### Button (Components/Button.tsx)
```tsx
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  ...props 
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed font-medium font-sans";
  
  const variants = {
    primary: "bg-brand-dark text-white hover:bg-black border border-transparent shadow-sm rounded-lg hover:shadow-md",
    secondary: "bg-white text-brand-dark border border-brand-border hover:border-brand-cyan/50 hover:bg-brand-cyan-light hover:shadow-sm rounded-lg",
    ghost: "bg-transparent text-brand-gray hover:text-brand-dark hover:bg-brand-dark/5 rounded-lg",
    icon: "p-2 rounded-full hover:bg-brand-dark/5 text-brand-gray hover:text-brand-dark transition-colors",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2 gap-2",
    lg: "text-base px-6 py-3 gap-2.5",
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], variant === 'icon' ? '' : sizes[size], className)} 
      {...props}
    >
      {children}
    </button>
  );
};
```

#### Card (Components/Card.tsx)
```tsx
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const Card = ({ children, className, hoverEffect = false, onClick }: CardProps) => (
  <div 
    onClick={onClick}
    className={cn(
      "bg-white border border-brand-border rounded-xl p-4 transition-all duration-300 relative overflow-hidden group font-sans",
      hoverEffect && "hover:shadow-md hover:border-brand-cyan/30 cursor-pointer",
      className
    )}
  >
    {hoverEffect && (
      <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-gradient-accent opacity-0 group-hover:opacity-10 rounded-full blur-xl transition-opacity duration-500" />
    )}
    {children}
  </div>
);
```

#### Input (Components/Input.tsx)
```tsx
import React from 'react';
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          "flex h-10 w-full rounded-lg border border-brand-border bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-blue/50 focus:border-brand-blue/50 transition-all font-sans text-brand-dark",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
```

### 3.3 字体引入 (Layout.tsx)
在 `app/layout.tsx` 中引入 Google Fonts:

```tsx
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}>
      <body className="bg-brand-bg text-brand-dark antialiased">
        {children}
      </body>
    </html>
  );
}
```
