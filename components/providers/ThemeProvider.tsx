'use client'

import React, { createContext, useContext } from 'react'

// Theme is always dark — both :root and .dark map to the same Innovate dark values.
// The provider is kept so existing imports of useTheme() don't break.
type Theme = 'dark'

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: 'dark',
  toggle: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider value={{ theme: 'dark', toggle: () => {} }}>
      {children}
    </ThemeContext.Provider>
  )
}
