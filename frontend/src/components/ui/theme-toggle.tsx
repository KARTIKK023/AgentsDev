"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={
        mounted
          ? `Switch to ${isDark ? "light" : "dark"} mode`
          : "Toggle theme"
      }
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative h-10 w-10 overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
    >
      {!mounted ? (
        <Sun className="h-[18px] w-[18px]" />
      ) : (
        <>
          <Sun
            className={`absolute h-[18px] w-[18px] transition-all duration-300 ${
              isDark
                ? "rotate-90 scale-0"
                : "rotate-0 scale-100"
            }`}
          />
          <Moon
            className={`absolute h-[18px] w-[18px] transition-all duration-300 ${
              isDark
                ? "rotate-0 scale-100"
                : "-rotate-90 scale-0"
            }`}
          />
        </>
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}