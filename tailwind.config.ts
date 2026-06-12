import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // GUVI-inspired purple brand palette
        brand: {
          50: "#f4f0ff",
          100: "#eae0ff",
          200: "#d6c5ff",
          300: "#b89aff",
          400: "#9a6bff",
          500: "#7f44ff",
          600: "#6729ff",
          700: "#5a1fe6",
          800: "#4a1cb8",
          900: "#3c1a90",
          950: "#23105a",
        },
        // GUVI green as the secondary accent
        accent: {
          50: "#e9fdf1",
          100: "#c9fbdf",
          400: "#28e07a",
          500: "#0ad652",
          600: "#04b341",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        punjabi: ["var(--font-punjabi)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(28, 47, 143, 0.18)",
        card: "0 4px 24px -8px rgba(16, 24, 40, 0.12)",
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
  plugins: [require("@tailwindcss/typography")],
};

export default config;
