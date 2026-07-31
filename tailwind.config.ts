/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7CFC00',
          dark: '#3D5A00',
          light: '#A8E600',
        },
        bg: '#0A0A0A',
        surface: '#111111',
        'surface-elevated': '#1A1A1A',
        text: '#FFFFFF',
        'text-secondary': '#8A8A8A',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        lg: '16px',
        md: '12px',
        sm: '8px',
      },
      boxShadow: {
        glow: '0 0 30px rgba(124,252,0,0.08)',
        'glow-strong': '0 0 40px rgba(124,252,0,0.15)',
      },
    },
  },
  plugins: [],
}