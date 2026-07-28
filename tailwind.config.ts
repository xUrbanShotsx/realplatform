import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: 'var(--bg)',
        'surface-secondary': 'var(--bg-secondary)',
        'surface-hover': 'var(--bg-hover)',
        'surface-canvas': 'var(--bg-canvas)',
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        text: 'var(--text)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        accent: 'var(--accent-text)',
        'accent-bg': 'var(--accent-bg)',
        'accent-border': 'var(--accent-border)',
      },
    },
  },
  plugins: [],
}

export default config
