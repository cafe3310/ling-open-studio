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
    id: "flat-vtuber",
    name: "Flat VTuber",
    icon: "Sparkles",
    description_general: "Clean, fresh, and rounded. Inspired by VTubers or virtual streamers. A balance of 'kawaii' minimalism and vibrant pop accents. Incorporate playful decorative elements in the background.",
    description_color: "Background: Pure white or very light color. Accents: Use high-saturation 'pop' colors for CTAs. Use at least two distinct color systems.",
    description_shape: "Maximum roundness (rounded-3xl or rounded-full). Decorative background elements like subtle floating dots, sparkles (using SVG or CSS), or soft organic shapes are encouraged to break flat surfaces. Avoid shadows to maintain a clean, flat aesthetic. Use accent colors for buttons and interactive elements to create visual interest without overwhelming the design.",
    description_font: "Clean, rounded sans-serif typography like Quicksand or Varela Round. Maintain high readability with ample whitespace."
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
