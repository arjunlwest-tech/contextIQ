import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Premium White & Gold Theme
        background: "#FAFAFA",
        "bg-cream": "#F5F5F0",
        "bg-warm": "#F9F8F6",
        surface: "#FFFFFF",
        "surface-elevated": "#FFFFFF",
        border: "#E8E8E8",
        "border-light": "#F0F0F0",
        // Gold Accents
        gold: { 
          DEFAULT: "#C9A962", 
          light: "#D4B978", 
          dark: "#B89A4E",
          shimmer: "#E8D5A3"
        },
        // Semantic Colors (muted for luxury feel)
        success: "#2D5A3D",
        warning: "#B8860B",
        danger: "#8B4513",
        // Text Colors
        "text-primary": "#1A1A1A",
        "text-secondary": "#6B6B6B",
        "text-muted": "#9A9A9A",
        // Legacy aliases for compatibility
        base: "#FAFAFA",
        emerald: { DEFAULT: "#2D5A3D", light: "#3D7A52" },
        amber: { DEFAULT: "#B8860B", light: "#D4A84B" },
        indigo: { DEFAULT: "#C9A962", light: "#D4B978", dark: "#B89A4E" },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        heading: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "gold-shimmer": "goldShimmer 3s linear infinite",
        "elegant-fade": "elegantFadeIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "float-3d": "float3D 8s ease-in-out infinite",
        "gold-pulse": "goldPulse 3s ease-in-out infinite",
        "metallic": "metallicSheen 4s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
