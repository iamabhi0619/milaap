/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blue:{
          dark: "#192428",
          lightDark: "#414C50",
          light: "#39ACE7"
        },
        navyBlue: {
          light: "#336FAF",
          normal: "#004E98",
          dark: "#00366B",
        },
        skyBlue: {
          light: "#6A8FBA",
          normal: "3A6EA5",
          dark: "#2B5280",
        },
        silver: {
          light: "#E0E0E0",
          normal: "#C0C0C0",
          dark: "#A0A0A0",
        },
        gray: {
          light: "#FFFFFF",
          normal: "#EBEBEB",
          dark: "#C8C8C8",
        },
        orange: {
          light: "#FF9352",
          normal: "#FF6700",
          dark: "#CC5200",
        },
      },
      fontFamily: {
        normal: ['"Rubik"', "sans-serif"],
        simple: ['"Nunito"', "sans-serif"],
        simpleStright: ['"Fira Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
