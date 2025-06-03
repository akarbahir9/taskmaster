"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Avoid rendering children until client is ready to prevent hydration mismatch
    // You can return a loader here if you prefer
    return null;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
