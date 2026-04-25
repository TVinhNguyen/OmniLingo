"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system")
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = (localStorage.getItem("theme") as Theme) || "system"
    setThemeState(stored)

    const updateDarkMode = () => {
      let dark = false
      if (stored === "dark") dark = true
      else if (stored === "light") dark = false
      else dark = window.matchMedia("(prefers-color-scheme: dark)").matches

      setIsDark(dark)
      document.documentElement.classList.toggle("dark", dark)
    }

    updateDarkMode()

    if (stored === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      mediaQuery.addEventListener("change", updateDarkMode)
      return () => mediaQuery.removeEventListener("change", updateDarkMode)
    }
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem("theme", newTheme)

    let dark = false
    if (newTheme === "dark") dark = true
    else if (newTheme === "light") dark = false
    else dark = window.matchMedia("(prefers-color-scheme: dark)").matches

    setIsDark(dark)
    document.documentElement.classList.toggle("dark", dark)
  }

  if (!mounted) return <>{children}</>

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within ThemeProvider")
  return context
}
