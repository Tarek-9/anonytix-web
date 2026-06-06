import { useEffect, useRef, useState } from 'react'

type CountUpProps = {
  value: number
  /** Number of decimal places (for ratings like 4.2). */
  decimals?: number
  /** Animation duration, ms. */
  duration?: number
  /** Formatting of the final number (suffixes %, / 5, etc.). */
  format?: (n: number) => string
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Exponential ease-out — matches --ease-out-expo in CSS.
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

/**
 * Animated counter from 0 to value. Respects reduced-motion
 * (shows the final value immediately) and cancels cleanly on unmount.
 */
export function CountUp({ value, decimals = 0, duration = 900, format }: CountUpProps) {
  const [display, setDisplay] = useState(() => (prefersReducedMotion() ? value : 0))
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplay(value)
      return
    }
    let start: number | null = null
    const tick = (now: number) => {
      if (start === null) start = now
      const progress = Math.min((now - start) / duration, 1)
      setDisplay(value * easeOutExpo(progress))
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [value, duration])

  const rounded = Number(display.toFixed(decimals))
  return <>{format ? format(rounded) : rounded.toFixed(decimals)}</>
}
