/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
  safelist: [
    "text-blue-400",
    "text-lime-400",
    "text-gray-400",
    "text-red-400",
    "text-teal-400",
    "text-purple-500",
    "text-pink-400",
    "text-green-400",
    "text-yellow-400",
    "text-white",
  ],
}
