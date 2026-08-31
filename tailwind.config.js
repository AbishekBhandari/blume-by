/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#FBF3EF",
        surface: "#FFFDF9",
        ink: "#382C28",
        green: {
          DEFAULT: "#3D5A45",
          dark: "#2A3F32",
        },
        rose: {
          DEFAULT: "#D98A82",
          dark: "#C06F66",
        },
        gold: "#C99A4B",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-work-sans)", "sans-serif"],
        hand: ["var(--font-caveat)", "cursive"],
      },
    },
  },
  plugins: [],
};
