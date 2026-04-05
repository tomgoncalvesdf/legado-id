import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      // ─── PALETA LEGADO ID "ÉTER" ───────────────────────────
      colors: {
        // Marca — Âmbar
        amber: {
          deep:    "#8B6914",
          medium:  "#C49A2A",
          light:   "#E8C96B",
          soft:    "#F5E9C0",
        },
        // Neutros
        stone:   "#2C2C2E",
        sand:    "#F5F0E8",
        mist:    "#FAFAF8",
        night:   "#1A1A1C",

        // shadcn compat
        border:      "hsl(var(--border))",
        input:       "hsl(var(--input))",
        ring:        "hsl(var(--ring))",
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },

      // ─── TIPOGRAFIA ────────────────────────────────────────
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        sans:    ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["4.5rem",  { lineHeight: "1.1",  letterSpacing: "-0.02em" }],
        "display-l":  ["3.5rem",  { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-m":  ["2.5rem",  { lineHeight: "1.2",  letterSpacing: "-0.01em" }],
      },

      // ─── BORDER RADIUS ─────────────────────────────────────
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1.5rem",
        "2xl": "2rem",
      },

      // ─── SOMBRAS ───────────────────────────────────────────
      boxShadow: {
        "card":    "0 2px 12px rgba(0,0,0,0.06)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.10)",
        "amber":   "0 0 0 3px rgba(196,154,42,0.25)",
        "hero":    "0 24px 80px rgba(0,0,0,0.12)",
      },

      // ─── ANIMAÇÕES ─────────────────────────────────────────
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "fade-down": {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        "glow-amber": {
          "0%, 100%": { filter: "drop-shadow(0 0 4px rgba(196,154,42,0.3))" },
          "50%":       { filter: "drop-shadow(0 0 12px rgba(196,154,42,0.6))" },
        },
        "candle-flicker": {
          "0%, 100%": { transform: "scaleY(1) rotate(-1deg)", opacity: "1" },
          "25%":       { transform: "scaleY(1.05) rotate(1deg)", opacity: "0.9" },
          "50%":       { transform: "scaleY(0.97) rotate(-0.5deg)", opacity: "1" },
          "75%":       { transform: "scaleY(1.02) rotate(0.5deg)", opacity: "0.95" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down":   "accordion-down 0.2s ease-out",
        "accordion-up":     "accordion-up 0.2s ease-out",
        "fade-in":          "fade-in 0.35s ease-out both",
        "fade-up":          "fade-up 0.45s cubic-bezier(0.22,1,0.36,1) both",
        "fade-down":        "fade-down 0.3s cubic-bezier(0.22,1,0.36,1) both",
        "scale-in":         "scale-in 0.3s cubic-bezier(0.22,1,0.36,1) both",
        "glow-amber":       "glow-amber 3s ease-in-out infinite",
        "candle-flicker":   "candle-flicker 3s ease-in-out infinite",
        shimmer:            "shimmer 1.5s infinite linear",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
