/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sidebar: {
          from: "#0F4F3C",
          to: "#0A3A2C",
          active: "#1F7A55",
          card: "#15634A",
          text: "#FFFFFF",
        },
        primary: {
          DEFAULT: "#1E8A5A",
          hover: "#177049",
          soft: "#E8F5EE",
        },
        bg: "#F4F7F6",
        surface: "#FFFFFF",
        line: "#E6ECEA",
        ink: {
          DEFAULT: "#1C2B26",
          secondary: "#5B6B66",
          muted: "#8A9793",
        },
        tone: {
          green: { solid: "#22A06B", soft: "#EAF6EF" },
          blue: { solid: "#3B82F6", soft: "#EEF4FE" },
          orange: { solid: "#F59E0B", soft: "#FFF6E8" },
          red: { solid: "#EF4444", soft: "#FDEEEE" },
          purple: { solid: "#8B5CF6", soft: "#F3EEFE" },
          teal: { solid: "#14B8A6", soft: "#E7F8F6" },
          gray: { solid: "#6B7280", soft: "#F1F3F4" },
        },
        chart: {
          income: "#1E8A5A",
          expense: "#B9CCDD",
          occupied: "#1E8A5A",
          vacant: "#C9DCE8",
          grid: "#EEF1F0",
        },
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 40, 32, 0.04), 0 4px 16px rgba(16, 40, 32, 0.04)",
        'card-hover': "0 6px 20px rgba(16, 40, 32, 0.08)",
      },
      fontFamily: {
        sans: ["Prompt", "IBM Plex Sans Thai", "Noto Sans Thai", "system-ui", "sans-serif"],
        hand: ["Mali", "Itim", "cursive"],
      },
    },
  },
  plugins: [],
}

