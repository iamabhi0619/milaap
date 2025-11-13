
"use client"

import { IconSettings2 } from "@tabler/icons-react"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ThemePreset = "native-blues" | "ocean-breeze" | "sunset-glow" | "midnight-sky"
type Scale = "" | "xs" | "lg"
type Radius = "" | "sm" | "xl"

// Helper functions for cookies
const setCookie = (name: string, value: string, days = 365) => {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

const getCookie = (name: string): string | null => {
  const nameEQ = name + "="
  const ca = document.cookie.split(";")
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === " ") c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

const applyThemePreset = (preset: ThemePreset) => {
  const presets = {
    "native-blues": {
      primary: "oklch(0.45 0.12 240)",
      accent: "oklch(0.55 0.10 220)",
      secondary: "oklch(0.90 0.02 240)",
    },
    "ocean-breeze": {
      primary: "oklch(0.45 0.15 200)",
      accent: "oklch(0.55 0.12 180)",
      secondary: "oklch(0.88 0.02 190)",
    },
    "sunset-glow": {
      primary: "oklch(0.50 0.18 30)",
      accent: "oklch(0.60 0.15 40)",
      secondary: "oklch(0.88 0.02 35)",
    },
    "midnight-sky": {
      primary: "oklch(0.35 0.12 270)",
      accent: "oklch(0.50 0.15 280)",
      secondary: "oklch(0.88 0.02 275)",
    },
  }

  const colors = presets[preset]
  const root = document.documentElement
  root.style.setProperty("--primary", colors.primary)
  root.style.setProperty("--accent", colors.accent)
  root.style.setProperty("--secondary", colors.secondary)
}

export default function SettingsMenu() {
  const { theme, setTheme } = useTheme()
  
  // Load from cookies or use defaults
  const [themePreset, setThemePreset] = useState<ThemePreset>("native-blues")
  const [scale, setScale] = useState<Scale>("")
  const [radius, setRadius] = useState<Radius>("")
  const [mounted, setMounted] = useState(false)

  // Load and apply saved settings immediately on mount
  useEffect(() => {
    setMounted(true)
    
    const savedPreset = (getCookie("themePreset") as ThemePreset) || "native-blues"
    const savedScale = (getCookie("scale") as Scale) || ""
    const savedRadius = (getCookie("radius") as Radius) || ""
    
    setThemePreset(savedPreset)
    setScale(savedScale)
    setRadius(savedRadius)
    
    // Apply immediately
    applyThemePreset(savedPreset)
    
    // Apply scale
    const root = document.documentElement
    const scaleValues = { "": "1", "xs": "0.875", "lg": "1.125" }
    root.style.fontSize = `${parseFloat(scaleValues[savedScale] || "1") * 100}%`
    root.style.setProperty("--spacing", savedScale === "" ? "0.25rem" : `calc(0.25rem * ${scaleValues[savedScale]})`)
    
    // Apply radius
    const radiusValues = { "": "0.5rem", "sm": "0.25rem", "xl": "0.75rem" }
    root.style.setProperty("--radius", radiusValues[savedRadius] || "0.5rem")
  }, [])

  // Apply theme preset colors
  useEffect(() => {
    if (!mounted) return
    applyThemePreset(themePreset)
    setCookie("themePreset", themePreset)
  }, [themePreset, mounted])

  // Apply scale
  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    const scaleValues = {
      "": "1",
      "xs": "0.875",
      "lg": "1.125",
    }
    root.style.setProperty("--spacing", scale === "" ? "0.25rem" : `calc(0.25rem * ${scaleValues[scale]})`)
    root.style.fontSize = `${parseFloat(scaleValues[scale]) * 100}%`
    setCookie("scale", scale)
  }, [scale, mounted])

  // Apply radius
  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    const radiusValues = {
      "": "0.5rem",
      "sm": "0.25rem",
      "xl": "0.75rem",
    }
    root.style.setProperty("--radius", radiusValues[radius])
    setCookie("radius", radius)
  }, [radius, mounted])

  const resetToDefault = () => {
    setThemePreset("native-blues")
    setScale("")
    setRadius("")
    setTheme("light")
    
    // Clear cookies
    setCookie("themePreset", "")
    setCookie("scale", "")
    setCookie("radius", "")
    
    // Reset CSS variables
    const root = document.documentElement
    root.style.fontSize = "100%"
    root.style.setProperty("--spacing", "0.25rem")
    root.style.setProperty("--radius", "0.5rem")
    applyThemePreset("native-blues")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="link"
          className="shadow-none size-8 text-foreground"
          aria-label="Open settings menu">
          <IconSettings2 size={16} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-6" align="end">
        <div className="space-y-6">
          {/* Theme Preset */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Theme preset:</label>
            <Select value={themePreset} onValueChange={(value) => setThemePreset(value as ThemePreset)}>
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="native-blues">Native Blues</SelectItem>
                <SelectItem value="ocean-breeze">Ocean Breeze</SelectItem>
                <SelectItem value="sunset-glow">Sunset Glow</SelectItem>
                <SelectItem value="midnight-sky">Midnight Sky</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Scale */}
          <div className="space-y-3">
            <label className="text-sm font-semibold">Scale:</label>
            <div className="flex gap-2">
              <Button
                variant={scale === "" ? "secondary" : "outline"}
                className="flex-1"
                onClick={() => setScale("")}>
                <span className="line-through">⊘</span>
              </Button>
              <Button
                variant={scale === "xs" ? "secondary" : "outline"}
                className="flex-1"
                onClick={() => setScale("xs")}>
                XS
              </Button>
              <Button
                variant={scale === "lg" ? "secondary" : "outline"}
                className="flex-1"
                onClick={() => setScale("lg")}>
                LG
              </Button>
            </div>
          </div>

          {/* Radius */}
          <div className="space-y-3">
            <label className="text-sm font-semibold">Radius:</label>
            <div className="flex gap-2">
              <Button
                variant={radius === "sm" ? "secondary" : "outline"}
                className="flex-1 rounded-sm"
                onClick={() => setRadius("sm")}>
                SM
              </Button>
              <Button
                variant={radius === "" ? "secondary" : "outline"}
                className="flex-1"
                onClick={() => setRadius("")}>
                Default
              </Button>
              <Button
                variant={radius === "xl" ? "secondary" : "outline"}
                className="flex-1 rounded-xl"
                onClick={() => setRadius("xl")}>
                XL
              </Button>
            </div>
          </div>

          {/* Color Mode */}
          <div className="space-y-3">
            <label className="text-sm font-semibold">Color mode:</label>
            <div className="flex gap-2">
              <Button
                variant={theme === "light" ? "secondary" : "outline"}
                className="flex-1"
                onClick={() => setTheme("light")}>
                Light
              </Button>
              <Button
                variant={theme === "dark" ? "secondary" : "outline"}
                className="flex-1"
                onClick={() => setTheme("dark")}>
                Dark
              </Button>
            </div>
          </div>

          {/* Reset Button */}
          <Button
            variant="destructive"
            className="w-full"
            onClick={resetToDefault}>
            Reset to Default
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}