/**
 * Node C: Code Generator
 * Combines Plan and Style into a final implementation call.
 */

import { TechStackOption } from "./data/types";

export const CODE_GENERATOR_PROMPT = (productPlan: string, visualSpec: string, techStack: TechStackOption) => `
You are a Senior Frontend Developer. Your mission is to implement a complete, beautiful, and functional website based on the provided Design Spec and Product Plan.

### 1. PRODUCT PLAN (Requirements)
${productPlan}

### 2. VISUAL SPEC (Design)
${visualSpec}

### 3. TECHNICAL CONSTRAINTS
- Use the following Boilerplate EXACTLY. Do NOT remove CDN links or the Icon initialization script.
- Tech Stack Boilerplate:
${techStack.boilerplate_code}
- Style Guide: ${techStack.description_style}

### 4. INSTRUCTIONS
- Map the "Style Tokens" from the Visual Spec to Tailwind classes.
- Use the primary accent color for key elements like buttons and icons.
- Ensure the copy from the Product Plan is accurately reflected.
- Use Lucide icons correctly: <i data-lucide="icon-name"></i>.
- Write the final code to "/index.html" using the write_file tool.
`.trim();
