import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Dark mode colors
        dark: {
          50: "#f7f7f8",
          100: "#ececef",
          200: "#d9d9e3",
          300: "#c5c5d2",
          400: "#acacbe",
          500: "#8e8ea0",
          600: "#6e6e80",
          700: "#4e4e60",
          800: "#2e2e40",
          850: "#1e1e2f",
          900: "#0f0f1a",
          950: "#05050a",
        },
        // Light mode colors
        light: {
          50: "#ffffff",
          100: "#fafafa",
          200: "#f5f5f5",
          300: "#e5e5e5",
          400: "#d4d4d4",
          500: "#a3a3a3",
          600: "#737373",
          700: "#525252",
          800: "#262626",
          900: "#171717",
        },
        // Your default colors
        navy: {
          50: "#f0f2f8",
          100: "#d8dcee",
          200: "#b0bada",
          300: "#8896c4",
          400: "#5f70aa",
          500: "#3d508e",
          600: "#2c3c72",
          700: "#1e2a57",
          800: "#131b3c",
          900: "#0b1128",
        },
        violet: {
          50: "#f3eeff",
          100: "#e0d0fd",
          200: "#c4a8fb",
          300: "#a37ef5",
          400: "#7f52eb",
          500: "#6130dd",
          600: "#4d22b8",
          700: "#3c178f",
          800: "#2a0f66",
          900: "#190940",
        },
        cream: {
          50: "#fdfcf8",
          100: "#f8f5ed",
          200: "#ede8d8",
          300: "#ddd5bf",
          400: "#c4b898",
          500: "#a99872",
        },
        teal: {
          300: "#5eead4",
          400: "#14b8a6",
          500: "#0d9488",
          600: "#0f766e",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        violet: "0 8px 28px rgba(97,48,221,0.28)",
        sm: "0 2px 8px rgba(11,17,40,0.08)",
        md: "0 6px 20px rgba(11,17,40,0.10)",
        lg: "0 16px 48px rgba(11,17,40,0.14)",
      },
      animation: {
        "pulse-dot": "pulseDot 2s infinite",
        "fade-up": "fadeUp 0.6s ease forwards",
      },
      keyframes: {
        pulseDot: {
          "0%,100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(0.85)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(22px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
