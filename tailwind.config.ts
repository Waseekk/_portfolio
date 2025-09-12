
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0b0d10",
        card: "#111418",
        text: "#e8eef6",
        muted: "#9fb3c8",
        accent: "#7dd3fc"
      }
    }
  },
  plugins: []
};
export default config;
