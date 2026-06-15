/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      boxShadow: {
        soft: "0 24px 80px rgba(15, 23, 42, 0.12)",
      },
      fontFamily: {
        sans: ["Poppins", "Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial"],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(99,102,241,0.06) 35%, rgba(14,165,233,0.04) 100%)',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.05)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.95)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
      },
      animation: {
        blob: 'blob 8s ease-in-out infinite',
      },
      colors: {
        brand: {
          50: "#eef2ff",
          500: "#7c3aed",
          600: "#6d28d9",
        },
      },
    },
  },
  plugins: [],
}

