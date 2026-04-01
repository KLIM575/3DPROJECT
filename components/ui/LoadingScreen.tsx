'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setDone(true), 400)
          return 100
        }
        return prev + Math.random() * 12 + 4
      })
    }, 80)
    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: 'var(--bg)' }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-8"
          >
            <div
              className="text-4xl font-bold tracking-widest"
              style={{
                color: 'var(--accent)',
                textShadow: '0 0 30px rgba(0,255,255,0.5)',
                fontFamily: 'var(--font-space-grotesk)',
              }}
            >
              ◈
            </div>

            <div className="flex flex-col items-center gap-3">
              <div
                className="font-mono text-xs tracking-widest"
                style={{ color: 'var(--muted)' }}
              >
                INITIALIZING RENDER ENGINE
              </div>

              {/* Progress bar */}
              <div
                className="w-48 h-px relative overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <motion.div
                  className="absolute top-0 left-0 h-full"
                  style={{ background: 'var(--accent)', width: `${progress}%` }}
                />
              </div>

              <div
                className="font-mono text-xs"
                style={{ color: 'var(--accent)' }}
              >
                {Math.min(Math.round(progress), 100)}%
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
