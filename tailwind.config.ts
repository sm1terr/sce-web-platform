import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
        // SCE Foundation colors - обновленная цветовая схема
        sce: {
          primary: "#990000",           // Темно-красный (основной цвет)
          secondary: "#333333",         // Темно-серый (вторичный цвет)
          tertiary: "#1a1a1a",          // Почти черный (для выделения элементов)
          background: "#f5f5f5",        // Светло-серый фон
          backgroundAlt: "#e3e3e3",     // Альтернативный фон для карточек
          text: "#111111",              // Основной цвет текста
          textAlt: "#ffffff",           // Альтернативный цвет текста (для темного фона)
          border: "#cccccc",            // Цвет границ элементов
          borderDark: "#990000",        // Темная граница (для выделенных элементов)
          link: "#990000",              // Цвет ссылок
          hover: "#770000",             // Цвет при наведении
          success: "#006600",           // Цвет успеха
          error: "#990000",             // Цвет ошибки
          warning: "#cc7700",           // Цвет предупреждения
          info: "#006699",              // Цвет информации
          safe: "#009966",              // Класс объекта: Safe
          euclid: "#cc7700",            // Класс объекта: Euclid
          keter: "#cc0000",             // Класс объекта: Keter
          thaumiel: "#6600cc",          // Класс объекта: Thaumiel
          neutralized: "#666666",       // Класс объекта: Neutralized
          explained: "#336699",         // Класс объекта: Explained
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Noto Sans", "Inter", ...fontFamily.sans],
        mono: ["Courier New", "monospace"],
      },
      typography: {
        DEFAULT: {
          css: {
            a: {
              color: '#990000',
              '&:hover': {
                color: '#770000',
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config
