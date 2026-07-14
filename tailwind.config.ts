import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: "#C9A24D",
        "gold-light": "#E2BE7A",
        "gold-dim": "#8B6E2F",
        accent: "#C9A24D",
        foreground: "#F7F1E5",
        secondary: "#A8A29E",
        background: "#000000",
        card: "#111111",
        border: "rgba(255,255,255,0.1)",
        "off-black": "#0A0A0A",
        "dark-1": "#111111",
        "dark-2": "#1A1A1A",
        "dark-3": "#242424",
        grey: "#888888",
        "grey-light": "#AAAAAA",
        "grey-dim": "#444444",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.22em",
        widest3: "0.18em",
        widest4: "0.14em",
      },
      transitionTimingFunction: {
        monarch: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      transitionDuration: {
        800: "800ms",
        900: "900ms",
        1200: "1200ms",
      },
    },
  },
  plugins: [],
};
export default config;
