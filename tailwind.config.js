/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0b192c',
          800: '#1e3e62',
          700: '#1b3764',
          600: '#204b87',
        },
        brand: {
          blue: '#1b64da',
          light: '#eef5ff',
          hover: '#1550b0',
          accent: '#0284c7'
        }
      },
      fontSize: {
        'senior-base': '1.125rem', // 18px standard body for readability
        'senior-lg': '1.25rem',   // 20px
        'senior-xl': '1.5rem',    // 24px
      }
    },
  },
  plugins: [],
}
