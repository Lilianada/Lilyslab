import type { Config } from "tailwindcss"
import defaultTheme from "tailwindcss/defaultTheme";
import type { PluginAPI } from 'tailwindcss/types/config';

const config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        nitti: ["Nitti", "monospace"],
        sans: ["var(--font-geist-sans)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...defaultTheme.fontFamily.mono],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        codeRed: "hsl(var(--codeRed))",
        lavender: '#9EAAFA', // lavender blue
        yellow: '#FAE680', // pastel yellow
        green: '#A2CBAF', // soft green
        pink: '#E8ADB1', // soft pink
        cream: '#F4E8C8', // cream
        lilac: '#CCA7ED', // lilac
        peach: '#F29874', // peach
        paleYellow: '#F4DAA0', // pale yellow
        steelBlue: '#6C95CF', 
        lightBlue: "hsl(var(--lightBlue))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        mellow: {
          DEFAULT: "hsl(var(--mellow))",
          foreground: "hsl(var(--mellow-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "100%",
            color: "var(--tw-prose-body)",
            a: {
              color: "hsl(var(--primary))",
              "&:hover": {
                color: "hsl(var(--primary))",
              },
            },
          },
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        progress: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "progress": "progress 1s ease-in-out infinite",
        "spin-slow": "spin 12s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      backgroundImage: {
        'noise': "url('/images/Noise.png')",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), 
    require("@tailwindcss/typography"),
    // Add plugin to purge unused CSS
    function({ addBase, addComponents, addUtilities }: PluginAPI) {
      addBase({
        'html': {
          scrollBehavior: 'smooth',
        },
        '::selection': {
          backgroundColor: 'hsl(var(--primary) / 0.2)',
        },
        'img': {
          display: 'block',
          maxWidth: '100%',
        },
      });
    },
  ],
  corePlugins: {
    // Disable plugins that might not be needed
    touchAction: false,
    container: true,
  },
} satisfies Config

export default config
