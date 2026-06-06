import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type RevealProps = {
  children: ReactNode
  /** Ordinal index for stagger; delay = index * step. */
  index?: number
  /** Delay step between adjacent elements, ms. */
  step?: number
  /** Base delay, ms. */
  delay?: number
  /** Motion variant: rise up or simply fade in. */
  variant?: 'up' | 'fade'
  as?: ElementType
  className?: string
}

/**
 * Orchestrated entrance of content on mount.
 * Motion is pure CSS (transform/opacity); `prefers-reduced-motion`
 * is disabled globally in index.css — no separate logic needed.
 */
export function Reveal({
  children,
  index = 0,
  step = 60,
  delay = 0,
  variant = 'up',
  as,
  className,
}: RevealProps) {
  const Tag = as ?? 'div'
  const revealDelay = delay + index * step
  return (
    <Tag
      className={cn(variant === 'up' ? 'reveal-up' : 'reveal-fade', className)}
      style={{ '--reveal-delay': `${revealDelay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  )
}
