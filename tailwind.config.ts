import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0a0f1a",
          800: "#111827",
          700: "#1a2332",
          600: "#243044",
        },
        accent: {
          blue: "#3b82f6",
          green: "#10b981",
          red: "#ef4444",
          yellow: "#f59e0b",
          cyan: "#06b6d4",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
