# 艺术风格描述 - Skeuomorphism (拟物化)

## 背景与目的
本文档基于用户对 Web 设计风格的深度探索及实战经验总结而成。在 `ling-open-studio` 项目中，为了打破扁平化设计（Flat Design）的单调性，引入 **Skeuomorphism（拟物化）** 风格，特别是复古未来主义（Retro-futuristic）方向，旨在提升 UI 的触感、情感深度和视觉冲击力。

## 核心理念
拟物化通过模仿现实世界物体的材质、纹理、光影和物理特性，降低用户的认知成本。在本项目中，我们不追求单纯的逼真，而是追求“数字原生”与“物理直觉”的平衡，利用 WebGL 噪声、复杂的阴影和斜面效果，打造具有深度感的界面。

## 视觉要素清单
- **物理深度：** 极端细节的阴影（Shadows）、高对比度的长阴影、内阴影（Inner Shadows）。
- **边缘处理：** 斜面（Bevels）、浮雕（Emboss）效果，定义物体的厚度感。
- **材质纹理：** WebGL 动态噪声（WebGL Noises）、胶片颗粒感、磨砂金属、拉丝铝、甚至皮革或纸张纹理。
- **光影效果：** CRT 显示器荧光、扫描线（Scanlines）、微妙的背景径向光、发光（Glows）。
- **物理隐喻：** 按钮、开关、旋钮，看起来具有“可按压感”或“可拨动感”。

## 技术实现指南
- **动画与交互：** 
    - 使用 `Matter.js` 实现字母或组件的物理效果。
    - 使用 Spring 动画处理拖拽回弹（Overshoots）。
    - 循环滚动的跑马灯（Marquee）增加动态感。
- **WebGL 应用：** 必须使用 WebGL 来生成高质量的动态噪声和背景动画（如星空、流光）。
- **SVG 与 CSS：** 
    - 复杂的 CSS `box-shadow` 叠加实现长阴影。
    - 渐变（非紫色渐变！）模拟金属光泽和材质纹理。
    - 滤镜（Filters）实现模糊、亮度和对比度的精细微调。

## Prompt 策略与实战技巧
拟物化风格的生成通常需要迭代。建议采用 **“风格迁移（Style Transfer）”** 工作流：先生成基础布局，再通过 Prompt 注入拟物化细节。

### 核心关键词
`extreme details`, `shadows`, `bevels`, `webgl noises`, `retro futuristic`, `CRT monitors`, `scanlines`, `spring overshoots`, `hyper realistic`.

### 常用 Prompt 示例
1. **启动指令：** `"create a retro futuristic skeuomorphic user interface of feature cards for a feature section with extreme details, shadows, bevels and webgl noises."`
2. **样式增强：** `"improve the beautiful shadows with more contrast, tastefully high end, long shadows"`
3. **避坑指南：** 
    - 明确禁止紫色渐变：`"no purple gradients"`。
    - 指定暗色模式：`"dark mode. keep everything."`。
    - 排除新拟物化（Neumorphism）：`"Do not use neuomorphic style. Just a normal light mode clean skeuomorphic style."`。
4. **动态效果：** `"Make each card like CRT monitors, retro styles with lights animation, glows, scanlines. animate the background stars using webgl"`

## 交互细节规范
- **Hover 态：** 卡片浮起，阴影随之动态变化，亮度提升。
- **拖拽：** 支持 `draggable`，释放后带弹簧超调效果（Spring overshoots）。
- **反馈：** 所有的灯光、点、细节应处于无限循环的微动画中。

## 参考资源
- **在线案例：** [aura.build - meng](https://aura.build/user/meng/components)
- **关联文档：** [2026-02-05-20-43-视觉风格定义指南.md](./reference/2026-02-05-20-43-视觉风格定义指南.md)
