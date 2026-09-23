import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        highland: {
          50: "#f4faee",
          100: "#e6f5d8",
          200: "#cdeeb2",
          300: "#ade283",
          400: "#8ed254",
          500: "#72b729", // Vibrant Brand Green
          600: "#5c981e",
          700: "#467619",
          800: "#395e16",
          900: "#1b3408",
          950: "#0c1b03",
        },
        clay: {
          50: "#fdf8f4",
          100: "#faeee5",
          200: "#f3dacb",
          300: "#e9bea5",
          400: "#dc9c7c",
          500: "#d07d57",
          600: "#c16440",
          700: "#9f4d32",
          800: "#7f3f2c",
          900: "#663627",
        },
        ochre: {
          50: "#fdfbed",
          100: "#faf4d1",
          200: "#f6e8a3",
          300: "#efd66d",
          400: "#e6be3b",
          500: "#cc9e1e",
          600: "#b07f15",
          700: "#8a5c13",
        },
        cream: {
          50: "#ffffff",
          100: "#f9fafb",
          200: "#f3f4f6",
          300: "#e5e7eb",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
