/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0A0B0E',        // Deep black background
          sidebar: '#0D0E12',   // Sidebar slightly darker
          card: '#12141A',      // Dark card surface
          cardHover: '#161922', // Card hover state
          border: '#1F222C',    // Subtle dark border
          borderLight: '#2A2F3D',
          textMuted: '#71788A', // Dim gray text for labels
          textDim: '#4B5262',   // Very dim text for borders/chevrons
        },
        coral: {
          400: '#FF6B3D',
          500: '#FF4500',
          600: '#E63900',
          gradientStart: '#FF7A00',
          gradientEnd: '#FF2A00',
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'card-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'coral-glow': '0 0 25px 2px rgba(255, 69, 0, 0.45)',
        'orange-bar-glow': '0 0 20px 4px rgba(255, 100, 0, 0.5)',
        'green-glow': '0 0 20px 2px rgba(16, 185, 129, 0.35)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
