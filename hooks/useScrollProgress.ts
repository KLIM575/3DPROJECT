'use client'

import { useEffect, useRef, useState } from 'react'

interface ScrollProgressState {
  progress: number       // 0-1 overall progress
  scrollY: number        // raw pixel scroll
  direction: 'up' | 'down'
}

export function useScrollProgress(): ScrollProgressState {
  const [state, setState] = useState<ScrollProgressState>({
    progress: 0,
    scrollY: 0,
    direction: 'down',
  })
  const lastScrollY = useRef(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollY = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0
      const direction = scrollY > lastScrollY.current ? 'down' : 'up'
      lastScrollY.current = scrollY

      setState({ progress, scrollY, direction })
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()

    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return state
}

export function useSectionProgress(start: number, end: number, progress: number): number {
  if (progress <= start) return 0
  if (progress >= end) return 1
  return (progress - start) / (end - start)
}
