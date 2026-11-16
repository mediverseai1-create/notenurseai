import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        paper: "#FFFFFF",
        mist: "#F4F3F0",
        line: "#E3E1DC",
        muted: "#6B6A66",
        signal: { DEFAULT: "#EA2C00", dark: "#BF2300", soft: "#FFEDE8" },
        ok: "#12805C",
        warn: "#B26A00",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: { eyebrow: "0.14em" },
    },
  },
  plugins: [],
};
export default config;
