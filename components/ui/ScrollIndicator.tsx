'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface ScrollIndicatorProps {
  visible: boolean
}

export function ScrollIndicator({ visible }: ScrollIndicatorProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, delay: 2 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2"
        >
          <span
            className="font-mono text-xs tracking-widest"
            style={{ color: 'var(--muted)' }}
          >
            SCROLL
          </span>
          <div
            className="relative w-5 h-9 rounded-full"
            style={{ border: '1px solid var(--muted)' }}
          >
            <motion.div
              className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1 h-1.5 rounded-full"
              style={{ background: 'var(--accent)' }}
              animate={{ y: [0, 14, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
