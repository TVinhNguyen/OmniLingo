"use client"

import { useEffect } from "react"
import AOS from "aos"
import "aos/dist/aos.css"

export function AOSInit() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
      disable: () =>
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    })
  }, [])

  return null
}
