/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0b1220',
        panel: '#0f172a',
        card: '#111a2e',
        border: '#1e2b43',
        muted: '#8a97b1',
        primary: '#4f8cff',
        accent: '#22d3ee',
        danger: '#ef4444',
        warn: '#f59e0b',
        success: '#16a34a'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,.25)',
        ring: '0 0 0 2px rgba(79,140,255,.25)'
      },
      borderRadius: { xl2: '1rem' }
    }
  },
  plugins: []
}
