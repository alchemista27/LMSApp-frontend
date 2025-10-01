/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.js",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./navigation/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1abc9c',    // Tosca
        dark: '#2c3e50',       // hitam gelap
        graycustom: '#bdc3c7', // abu-abu
      },
    },
  },
  plugins: [],
};
