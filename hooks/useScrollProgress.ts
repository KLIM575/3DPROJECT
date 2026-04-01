'use client'

import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import type Lenis from 'lenis'
import { useLenis } from '@/components/LenisProvider'

interface ScrollProgressState {
  progress: number
  scrollY: number
  direction: 'up' | 'down'
}

const PROGRESS_EPS = 1e-5
const SCROLL_Y_EPS = 0.5

function commitScrollState(
  setState: Dispatch<SetStateAction<ScrollProgressState>>,
  scrollY: number,
  maxScroll: number,
  direction: 'up' | 'down',
) {
  const progress =
    maxScroll > 0 ? Math.min(Math.max(scrollY / maxScroll, 0), 1) : 0

  setState((prev) => {
    if (
      Math.abs(prev.progress - progress) < PROGRESS_EPS &&
      Math.abs(prev.scrollY - scrollY) < SCROLL_Y_EPS &&
      prev.direction === direction
    ) {
      return prev
    }
    return { progress, scrollY, direction }
  })
}

export function useScrollProgress(): ScrollProgressState {
  const lenis = useLenis()
  const [state, setState] = useState<ScrollProgressState>({
    progress: 0,
    scrollY: 0,
    direction: 'down',
  })
  const lastScrollY = useRef(0)
  const lastDirection = useRef<'up' | 'down'>('down')

  useEffect(() => {
    if (lenis) {
      const handleLenisScroll = (l: Lenis) => {
        const maxScroll = Math.max(0, l.limit)
        const scrollY = l.scroll
        let direction = lastDirection.current
        if (l.direction === 1) direction = 'down'
        else if (l.direction === -1) direction = 'up'
        lastDirection.current = direction
        commitScrollState(setState, scrollY, maxScroll, direction)
      }

      const unsub = lenis.on('scroll', handleLenisScroll)
      handleLenisScroll(lenis)
      return unsub
    }

    const updateFromWindow = () => {
      const scrollY = window.scrollY
      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      )
      let direction: 'up' | 'down' = lastDirection.current
      if (scrollY > lastScrollY.current) direction = 'down'
      else if (scrollY < lastScrollY.current) direction = 'up'
      lastScrollY.current = scrollY
      lastDirection.current = direction
      commitScrollState(setState, scrollY, maxScroll, direction)
    }

    window.addEventListener('scroll', updateFromWindow, { passive: true })
    updateFromWindow()
    return () => window.removeEventListener('scroll', updateFromWindow)
  }, [lenis])

  return state
}

export function useSectionProgress(start: number, end: number, progress: number): number {
  if (progress <= start) return 0
  if (progress >= end) return 1
  return (progress - start) / (end - start)
}
