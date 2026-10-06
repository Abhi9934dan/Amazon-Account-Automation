import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          900: "#1e3a8a"
        }
      },
      boxShadow: {
        soft: "0 10px 40px rgba(15, 23, 42, 0.07)"
      }
    }
  },
  plugins: []
};

export default config;
