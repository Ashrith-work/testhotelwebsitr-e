import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cream / off-white backgrounds
        cream: {
          DEFAULT: "#FAF5EC",
          light: "#FFFDF8",
          dark: "#F1E9D9",
        },
        // Deep maroon / burgundy — top strip, underlines, accents
        maroon: {
          DEFAULT: "#6E1B2A",
          dark: "#551320",
          light: "#8A2A3B",
        },
        // Muted forest green — buttons / secondary accents
        forest: {
          DEFAULT: "#3A5A40",
          dark: "#2C4531",
          light: "#4F7257",
        },
        // Gold — buttons / highlights
        gold: {
          DEFAULT: "#C19A4B",
          dark: "#A6803A",
          light: "#D8B871",
        },
        // Dark charcoal body text
        charcoal: {
          DEFAULT: "#2D2A26",
          light: "#4A453F",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        container: "1200px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
