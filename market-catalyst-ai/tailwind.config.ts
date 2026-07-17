import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core surfaces — near-black, blue-charcoal (not pure black)
        ink: {
          950: "#080B10",
          900: "#0B0F16",
          800: "#12161F",
          700: "#181E29",
          600: "#232935",
          500: "#2E3542",
        },
        // Text
        paper: {
          100: "#ECEEF2",
          300: "#B8BFCC",
          500: "#8B92A0",
          700: "#5A6270",
        },
        // Signature accent — terminal amber
        signal: {
          DEFAULT: "#F5A623",
          soft: "#FFD180",
          dim: "#7A5518",
        },
        // Bullish / bearish
        rise: {
          DEFAULT: "#1FD98C",
          soft: "#0F3D2C",
        },
        fall: {
          DEFAULT: "#F0475B",
          soft: "#3D1017",
        },
        wire: {
          DEFAULT: "#4C8DFF",
          soft: "#132140",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        panel: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.6)",
      },
      backgroundImage: {
        "grid-fade": "linear-gradient(180deg, rgba(245,166,35,0.06) 0%, rgba(8,11,16,0) 60%)",
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
