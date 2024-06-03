/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx,astro}",
    "./components/**/*.{ts,tsx,astro}",
    "./app/**/*.{ts,tsx,astro}",
    "./src/**/*.{ts,tsx,astro}",
  ],
  prefix: "",
  theme: {
    extend: {
      zIndex: {
        container: "1",
        badge: "2",
        header: "100",
        modal: "200",
      },
      fontFamily: {
        "ibm-plex-sans-thai": ["IBM Plex Sans Thai"],
        poppins: ["Poppins"],
        estebun: ["Estebun"],
        sarabun: ["Sarabun"],
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("daisyui")],
  daisyui: {
    themes: ["emerald"],
  },
};
