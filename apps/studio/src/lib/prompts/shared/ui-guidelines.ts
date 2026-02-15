/**
 * Shared UI and Design Guidelines
 */

export const LUCIDE_ICONS_GUIDE = `
### Lucide Icons Usage
- Use Lucide icons correctly using the following HTML structure: <i data-lucide="icon-name"></i>.
- Ensure the "icon-name" matches a valid Lucide icon name (e.g., "user", "settings", "chevron-right").
- Do NOT use <span> or other tags for icons unless specifically required.
`.trim();

export const TAILWIND_BEST_PRACTICES = `
### Tailwind CSS Best Practices
- Use utility-first approach.
- Prefer standard Tailwind spacing and sizing (e.g., p-4, m-2, w-full).
- Use semantic color names if available, otherwise use standard Tailwind palette (e.g., bg-blue-500).
- For custom values not in Tailwind, use arbitrary value syntax: e.g., h-[500px], bg-[#aabbcc].
`.trim();

export const ACCESSIBILITY_GUIDE = `
### Accessibility Guidelines
- Ensure high contrast for text.
- Use semantic HTML tags (header, nav, main, section, footer).
- Provide alt text for any imagery (even placeholders).
- Ensure interactive elements have sufficient hit targets.
`.trim();
