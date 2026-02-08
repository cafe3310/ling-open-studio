import { DesignOption } from "./types";

export const designs: DesignOption[] = [
  {
    id: "swiss",
    name: "Swiss International",
    icon: "Layout",
    description_general: "Focus on objectivity, readability, and a strong grid system. High contrast and minimalist.",
    description_color: "Use a primary palette of White, Black, and one bold accent color (like Red #EF4444 or Blue #3B82F6).",
    description_shape: "Sharp corners (rounded-none). Clean lines. No gradients. Heavy use of whitespace.",
    description_font: "Use bold, sans-serif typography like Inter or Helvetica. Large, impactful headings with tight leading."
  },
  {
    id: "minimalist",
    name: "Warm Minimalist",
    icon: "Feather",
    description_general: "Clean and airy but with a soft, inviting touch. Focus on organic feel and breathability.",
    description_color: "Use off-white backgrounds (#FDFBF7), charcoal text, and muted earthy accents (like Sage or Sand).",
    description_shape: "Large border radius (rounded-3xl). Subtle, soft shadows. Generous padding.",
    description_font: "Use a mix of an elegant Serif font for headings (like Playfair Display) and a clean Sans-serif for body."
  },
  {
    id: "brutalist",
    name: "Neo-Brutalist",
    icon: "Box",
    description_general: "Raw, bold, and intentionally 'unpolished'. High energy and playful defiance.",
    description_color: "Vibrant 'safety' colors (Yellow #FACC15, Cyan #22D3EE) mixed with thick black borders.",
    description_shape: "Hard shadows (shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]). Thick borders (border-2). Non-standard layouts.",
    description_font: "Use quirky or mono-spaced fonts (like Space Mono or Courier). Uppercase headings."
  }
];
