'use client'

import { useEffect, useRef } from 'react'

export function CursorGlow() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: -100, y: -100 })
  const trailPos = useRef({ x: -100, y: -100 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove)

    let raf: number
    const animate = () => {
      // Cursor dot
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`
      }
      // Trail (lerped)
      trailPos.current.x += (pos.current.x - trailPos.current.x) * 0.1
      trailPos.current.y += (pos.current.y - trailPos.current.y) * 0.1
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${trailPos.current.x - 20}px, ${trailPos.current.y - 20}px)`
      }
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      {/* Dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9998]"
        style={{
          background: 'var(--accent)',
          boxShadow: '0 0 6px var(--accent)',
          willChange: 'transform',
        }}
      />
      {/* Ring trail */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9997]"
        style={{
          border: '1px solid rgba(0,255,255,0.3)',
          willChange: 'transform',
        }}
      />
    </>
  )
}
