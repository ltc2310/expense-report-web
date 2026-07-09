/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#0B1512",
        terminal: "#142621",
        line: "#24413A",
        ink: "#DCE8DE",
        "ink-dim": "#8FA79C",
        jade: "#4ADE80",
        amber: "#F5A524",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
