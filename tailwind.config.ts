import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-black': 'var(--primary-black)',
        'primary-green': 'var(--primary-green)',
        'alert-red': 'var(--alert-red)',
        'bg-color': 'var(--bg-color)',
        'card-bg': 'var(--card-bg)',
      },
      fontFamily: {
        main: ['Inter', '-apple-system', 'sans-serif'],
        mono: ['"Courier New"', 'Courier', 'monospace'],
      },
      boxShadow: {
        // Strict Neo-Brutalist Shadows (Zero Blur)
        'neo-base': '6px 6px 0px var(--primary-black)',
        'neo-hover': '10px 10px 0px var(--primary-green)',
        'neo-sm': '4px 4px 0px var(--primary-black)',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
};
export default config;
