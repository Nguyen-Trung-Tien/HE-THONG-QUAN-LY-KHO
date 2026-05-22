/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"]
      },
      colors: {
        primary: {
          DEFAULT: "#00BFFF",
          light: "#87CEFA",
          dark: "#009ACD",
        },
        accent: "#FFD700",
        text: {
          primary: "#2D3748",
          secondary: "#718096",
          tertiary: "#A0AEC0",
        },
        // Dark Mode Colors
        dark: {
          bg: "#0F172A",
          card: "#1E293B",
          border: "#334155",
          text: {
            primary: "#F8FAFC",
            secondary: "#94A3B8",
            tertiary: "#64748B",
          }
        },
        // Aliases for backward compatibility
        textPrimary: "#2D3748",
        textSecondary: "#718096",
        primaryLight: "#87CEFA",
        border: "#E2E8F0",
        card: "#FFFFFF",
        bg: {
          light: "#F0F8FF",
          subtle: "#F7FAFC",
        },
        success: "#10B981",
        error: "#EF4444",
        warning: "#F59E0B",
        info: "#3B82F6",
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      boxShadow: {
        card: "0 2px 8px rgba(0, 0, 0, 0.05)",
        hover: "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        'soft-xl': '0 20px 27px 0 rgba(0, 0, 0, 0.05)',
      },
      keyframes: {
        float: {
          "0%, 100%": {
            transform: "translateY(0) translateX(0)"
          },
          "25%": {
            transform: "translateY(-20px) translateX(10px)"
          },
          "50%": {
            transform: "translateY(-10px) translateX(-15px)"
          },
          "75%": {
            transform: "translateY(15px) translateX(5px)"
          }
        }
      },
      animation: {
        float: "float 4s ease-in-out infinite"
      }
    }
  },
  plugins: []
};