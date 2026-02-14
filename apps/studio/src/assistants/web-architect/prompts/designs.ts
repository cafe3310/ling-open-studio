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
    id: "glassmorphism",
    name: "Glassmorphism",
    icon: "Wind",
    description_general: "Modern, lightweight, and transparent. Focus on depth and frost-glass effects.",
    description_color: "Soft gradients for background. Use white or black with high transparency (30-50%) for card backgrounds.",
    description_shape: "Medium border radius (rounded-2xl). Strong backdrop-blur-md. Thin, semi-transparent white borders (border-white/20).",
    description_font: "Clean and legible sans-serif like Inter. High letter spacing for a modern tech feel."
  },
  {
    id: "cyber-glow",
    name: "Cyber-Glow",
    icon: "Zap",
    description_general: "Futuristic, high-energy, and dark-centric. Inspired by cyberpunk aesthetics.",
    description_color: "Dark Slate backgrounds (#0F172A). Neon Cyan (#22D3EE) or Magenta (#F02AD3) as primary accent colors.",
    description_shape: "Small border radius (rounded-md). Text and borders should have glow effects (drop-shadow).",
    description_font: "Technical monospace fonts like Space Mono or modern bold sans-serif. Uppercase for navigation."
  },
  {
    id: "bento",
    name: "Bento Modern",
    icon: "Grid",
    description_general: "Structured, modular, and Apple-inspired layout. High clarity and information density.",
    description_color: "Minimalist Slate backgrounds (#F8FAFC). Pure white cards with deep gray text.",
    description_shape: "Large border radius (rounded-3xl). Flat design with very subtle borders or no borders at all.",
    description_font: "Elegant sans-serif like Inter. Careful use of hierarchy and whitespace within grid items."
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
