'use client'

import { useEffect, useState } from 'react'
import { QualityLevel } from '@/lib/constants'

export function useDevicePerformance(): QualityLevel {
  const [quality, setQuality] = useState<QualityLevel>('high')

  useEffect(() => {
    async function detect() {
      try {
        // Check prefers-reduced-motion first
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          setQuality('low')
          return
        }

        // Check hardware concurrency (CPU cores as proxy)
        const cores = navigator.hardwareConcurrency ?? 4
        
        // Check device memory if available
        const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4

        // Check if mobile
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        
        // Try detect-gpu for GPU tier
        let gpuTier = 2
        try {
          const { getGPUTier } = await import('detect-gpu')
          const result = await getGPUTier()
          gpuTier = result.tier
        } catch {
          // Fallback: estimate from hardware
          gpuTier = cores >= 8 ? 2 : cores >= 4 ? 1 : 0
        }

        if (gpuTier >= 2 && memory >= 4 && !isMobile) {
          setQuality('high')
        } else if (gpuTier >= 1 || (memory >= 2 && cores >= 4)) {
          setQuality('medium')
        } else {
          setQuality('low')
        }
      } catch {
        setQuality('medium')
      }
    }

    detect()
  }, [])

  return quality
}
