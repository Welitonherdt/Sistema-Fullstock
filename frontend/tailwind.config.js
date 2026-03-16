/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef8ff",
          100: "#d8efff",
          200: "#b6e1ff",
          300: "#82ccff",
          400: "#47b1ff",
          500: "#1894ff",
          600: "#067ec9",
          700: "#0a66a6",
          800: "#0e5587",
          900: "#12486f"
        }
      }
    }
  },
  plugins: []
};
