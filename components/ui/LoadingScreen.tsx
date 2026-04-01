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
          setTimeout(() => setDone(true), 320)
          return 100
        }
        return prev + Math.random() * 11 + 5
      })
    }, 70)
    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center"
          style={{ background: 'var(--bg)' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-10"
          >
            <span className="font-serif-display text-2xl tracking-tight text-[var(--white)]">Studio</span>

            <div className="flex flex-col items-center gap-4">
              <span className="font-mono-ui text-[10px] uppercase tracking-[0.26em] text-[var(--muted)]">
                Loading
              </span>
              <div className="relative h-px w-40 overflow-hidden bg-[var(--border)]">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-[var(--accent)]"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <span className="font-mono-ui text-[10px] tabular-nums text-[var(--muted)]">
                {Math.min(Math.round(progress), 100)}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
