/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,js,jsx,ts,tsx,vue,html}",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        darkBlue: {
          900: "#061026",
          800: "#123277",
          700: "#1e54c7",
          500: "#5483e6",
          200: "#b3c8f4",
          50: "#fdfeff",
        },
      },
    },
  },
  plugins: [],
};
