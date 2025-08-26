import type { Config } from "tailwindcss";
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              color: 'inherit',
              fontWeight: '500',
              textDecoration: 'underline',
              '&:hover': {
                opacity: 0.8,
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    typography, // ✅ Use imported plugin here
  ],
};

export default config;