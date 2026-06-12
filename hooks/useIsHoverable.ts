'use client'

import { useState, useEffect } from 'react'

/**
 * Detects whether the device supports real CSS hover (i.e. has a pointing
 * device like a mouse). On touch devices (hover: none), returns false.
 *
 * Used to conditionally disable hover-only animations (whileHover, hover
 * effects) that would otherwise flash on tap before click handlers fire.
 * Falls back to whileTap (brief scale) for intentional touch feedback.
 *
 * SSR-safe: returns false until the media query evaluates on the client.
 */
export function useIsHoverable(): boolean {
  const [hoverable, setHoverable] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(hover: hover)')
    setHoverable(media.matches)

    const listener = (event: MediaQueryListEvent) => {
      setHoverable(event.matches)
    }

    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [])

  return hoverable
}
