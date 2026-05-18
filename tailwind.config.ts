import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#0D0D0D",
          white: "#FFFFFF",
          red: "#CC1A1A",
          "red-dark": "#AA1414",
          "off-white": "#F5F4F2",
          concrete: "#2A2A2A",
          "mid-grey": "#6B6B6B",
          "light-grey": "#E5E5E5",
          green: "#1A7A3C",
        },
      },
      fontFamily: {
        montserrat: ["var(--font-montserrat)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        bebas: ["var(--font-bebas)", "cursive"],
      },
      letterSpacing: {
        widest2: "0.2em",
        widest3: "0.3em",
      },
      maxWidth: {
        site: "1280px",
      },
      height: {
        screen95: "95svh",
      },
    },
  },
  plugins: [],
};

export default config;
