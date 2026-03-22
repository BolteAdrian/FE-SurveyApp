/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        appBg: "#111114",
        inputBg: "#1e1e24",
        appText: "#e8e6e1",
      },
    },
  },
  plugins: [],
};
