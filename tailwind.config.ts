import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#033231",
        paper: "#FFFFFF",
        mist: "#F2F5F2",
        line: "#DCE3DC",
        muted: "#5B6B68",
        signal: { DEFAULT: "#4F7C4E", dark: "#3C6240", soft: "#E9F1E8" },
        leaf: "#8DBB8A",
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
