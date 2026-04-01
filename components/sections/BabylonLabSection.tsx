'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import type { QualityLevel } from '@/lib/constants'

const BabylonChapter = dynamic(
  () => import('@/components/babylon/BabylonChapter').then(m => m.BabylonChapter),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex min-h-[min(52vh,560px)] w-full items-center justify-center text-sm text-[var(--muted)]"
        style={{ background: 'var(--bg-elevated)' }}
      >
        Loading lab…
      </div>
    ),
  },
)

export function BabylonLabSection({ quality }: { quality: QualityLevel }) {
  return (
    <section className="relative border-y border-[var(--border)] bg-[var(--bg)]">
      <div className="mx-auto grid max-w-7xl gap-0 md:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-16 md:px-12 md:py-24">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-mono-ui mb-4 text-[10px] uppercase tracking-[0.28em] text-[var(--muted)]"
          >
            Parallel engine
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.05 }}
            className="font-serif-display text-4xl font-normal tracking-tight text-[var(--white)] md:text-5xl"
          >
            Babylon.js layer
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 max-w-md text-sm leading-relaxed text-[var(--text)]"
          >
            A second WebGL context for experiments that stay isolated from the main R3F canvas — lazy-loaded,
            disposed on exit, and skipped when quality is set to low.
          </motion.p>
        </div>
        <div className="relative min-h-[min(52vh,560px)] border-t border-[var(--border)] md:border-l md:border-t-0">
          <BabylonChapter quality={quality} />
        </div>
      </div>
    </section>
  )
}
