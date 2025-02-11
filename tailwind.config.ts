import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import colors from "tailwindcss/colors";
import plugin from "tailwindcss/plugin";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      lineHeight: {
        11: "2.75rem",
        12: "3rem",
        13: "3.25rem",
        14: "3.5rem",
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", ...fontFamily.sans],
      },
      colors: {
        primary: colors.pink,
        gray: colors.gray,
      },
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
      },
      typography: (theme: (path: string) => string) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme("colors.primary.500"),
              "&:hover": {
                color: `${theme("colors.primary.600")}`,
              },
              code: { color: theme("colors.primary.400") },
            },
            "h1,h2": {
              fontWeight: "700",
              letterSpacing: theme("letterSpacing.tight"),
            },
            h3: {
              fontWeight: "600",
            },
            code: {
              color: theme("colors.indigo.500"),
            },
          },
        },
        invert: {
          css: {
            a: {
              color: theme("colors.primary.500"),
              "&:hover": {
                color: `${theme("colors.primary.400")}`,
              },
              code: { color: theme("colors.primary.400") },
            },
            "h1,h2,h3,h4,h5,h6": {
              color: theme("colors.gray.100"),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    plugin(({ addBase, theme }) => {
      addBase({
        "a, button": {
          outlineColor: theme("colors.primary.500"),
          "&:focus-visible": {
            outline: "2px solid",
            borderRadius: theme("borderRadius.DEFAULT"),
            outlineColor: theme("colors.primary.500"),
          },
        },
      });
    }),
  ],
} satisfies Config;
