/**
 * Component: SceneContainer
 * What it does: Root wrapper for the 2.5D ukiyo-e diorama. Sets up CSS 3D
 *   perspective, mouse tracking for parallax rotation, and scroll tracking.
 *   All children (SceneLayer, FloatingArtworkCard) are positioned inside this
 *   container and inherit its 3D transform space.
 * Props:
 *   children: ReactNode — scene layers and floating artwork cards
 *   className?: string — additional classes
 * Renders: A 200vh-tall section with a sticky 100vh inner viewport. Inside,
 *   a perspective container rotates subtly on mouse move (2° max) to create
 *   the parallax depth effect across all translateZ layers.
 * Does NOT do: Render actual scene content (delegates to children), manage
 *   navigation, handle keyboard events.
 * Gotchas: All perspective and mouse tracking is disabled under
 *   prefers-reduced-motion. Mouse tracking attaches to the container div
 *   (not window) to scope the effect to the hero section.
 */

'use client'

import { useRef, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { scenePerspective } from '@/lib/animations'

interface SceneContainerProps {
  children: React.ReactNode
  className?: string
}

export function SceneContainer({ children, className = '' }: SceneContainerProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  // ─── Scroll tracking ─────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  // ─── Mouse tracking (scoped to the container element) ────────────
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, {
    stiffness: scenePerspective.springStiffness,
    damping: scenePerspective.springDamping,
  })
  const springY = useSpring(mouseY, {
    stiffness: scenePerspective.springStiffness,
    damping: scenePerspective.springDamping,
  })

  const rotateXVal = useTransform(springY, [-1, 1], [-scenePerspective.mouseRotateRange, scenePerspective.mouseRotateRange])
  const rotateYVal = useTransform(springX, [-1, 1], [scenePerspective.mouseRotateRange, -scenePerspective.mouseRotateRange])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduced) return
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      mouseX.set(x)
      mouseY.set(y)
    },
    [reduced, mouseX, mouseY],
  )

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  // Clean up motion values on unmount
  useEffect(() => {
    return () => {
      mouseX.destroy()
      mouseY.destroy()
      springX.destroy()
      springY.destroy()
      rotateXVal.destroy()
      rotateYVal.destroy()
      opacity.destroy()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section
      ref={sectionRef}
      className={`relative h-[200vh] ${className}`}
      aria-label="Scene diorama"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          ref={containerRef}
          className="relative w-full h-full"
          role="presentation"
          aria-hidden="true"
          style={
            reduced
              ? {}
              : {
                  perspective: scenePerspective.container,
                  perspectiveOrigin: `${scenePerspective.originX}% ${scenePerspective.originY}%`,
                  rotateX: rotateXVal,
                  rotateY: rotateYVal,
                }
          }
          onMouseMove={!reduced ? handleMouseMove : undefined}
          onMouseLeave={!reduced ? handleMouseLeave : undefined}
        >
          {/* Opacity fade on scroll */}
          <motion.div className="relative w-full h-full" style={{ opacity }}>
            {children}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
