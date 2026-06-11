'use client'

import { useEffect, useRef } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'

interface Drop {
  x: number
  y: number
  life: number
  maxLife: number
  size: number
}

export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isTouch = useMediaQuery('(hover: none) and (pointer: coarse)')

  useEffect(() => {
    if (isTouch) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let drops: Drop[] = []
    let mouseX = -100
    let mouseY = -100
    let rafId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e: MouseEvent) => {
      const prevX = mouseX
      const prevY = mouseY
      mouseX = e.clientX
      mouseY = e.clientY

      // Only create drops when moving
      const dist = Math.hypot(mouseX - prevX, mouseY - prevY)
      if (dist < 3) return

      drops.push({
        x: mouseX + (Math.random() - 0.5) * 4,
        y: mouseY + (Math.random() - 0.5) * 4,
        life: 0,
        maxLife: 40 + Math.random() * 30,
        size: 2 + Math.random() * 3,
      })

      // Limit total drops
      if (drops.length > 60) {
        drops = drops.slice(-60)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = drops.length - 1; i >= 0; i--) {
        const drop = drops[i]
        drop.life++
        drop.y += 0.3 // gravity

        const progress = drop.life / drop.maxLife
        const alpha = Math.max(0, 1 - progress)
        const size = drop.size * (1 - progress * 0.5)

        // Vermillion to transparent
        ctx.beginPath()
        ctx.arc(drop.x, drop.y, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(192, 57, 43, ${alpha * 0.6})`
        ctx.fill()

        // Inner highlight
        ctx.beginPath()
        ctx.arc(drop.x, drop.y, size * 0.4, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201, 168, 76, ${alpha * 0.3})`
        ctx.fill()

        if (drop.life >= drop.maxLife) {
          drops.splice(i, 1)
        }
      }

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [isTouch])

  if (isTouch) return null

  return (
    <canvas
      id="cursor-canvas"
      ref={canvasRef}
      aria-hidden="true"
    />
  )
}
