'use client'

import { motion } from 'framer-motion'
import { NARRATIVE_PHASE_BOUNDS, SECTION_SCROLL_ANCHORS } from '@/lib/constants'
import { ScrollIndicator } from '../ui/ScrollIndicator'

interface HeroSectionProps {
  scrollProgress: number
}

const HERO_FADE_END = NARRATIVE_PHASE_BOUNDS[1]

export function HeroSection({ scrollProgress }: HeroSectionProps) {
  const visible = scrollProgress < HERO_FADE_END
  const opacity = Math.max(0, 1 - scrollProgress / HERO_FADE_END)

  return (
    <section
      className="relative flex min-h-screen items-center justify-center px-6 md:px-16"
      style={{ pointerEvents: scrollProgress > HERO_FADE_END * 0.55 ? 'none' : 'auto' }}
    >
      <div className="w-full max-w-6xl" style={{ opacity }}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mb-10"
        >
          <span className="font-mono-ui text-[10px] uppercase tracking-[0.32em] text-[var(--muted)]">
            Creative digital experiences
          </span>
        </motion.div>

        <div className="mb-10 overflow-hidden">
          {['We craft', 'worlds in', 'the browser.'].map((line, i) => (
            <motion.div
              key={i}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.85, delay: 0.45 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1
                className={`font-serif-display block text-5xl font-normal leading-[1.02] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl ${
                  i === 2 ? 'text-[var(--accent)]' : 'text-[var(--white)]'
                }`}
              >
                {line}
              </h1>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 1.0 }}
          className="mb-14 max-w-lg text-sm font-light leading-relaxed text-[var(--text)] md:text-base"
        >
          Real-time 3D, filmic motion, and editorial design — one continuous scroll through light, form, and space.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 1.15 }}
          className="flex flex-col gap-3 sm:flex-row sm:gap-4"
        >
          <button
            type="button"
            className="border border-[var(--white)] bg-[var(--white)] px-8 py-3.5 font-mono-ui text-[11px] uppercase tracking-[0.2em] text-[var(--bg)] transition-opacity hover:opacity-90"
            onClick={() => {
              const maxScroll = document.documentElement.scrollHeight - window.innerHeight
              window.scrollTo({ top: SECTION_SCROLL_ANCHORS.projects * maxScroll, behavior: 'smooth' })
            }}
          >
            View work
          </button>
          <button
            type="button"
            className="border border-[var(--border)] bg-transparent px-8 py-3.5 font-mono-ui text-[11px] uppercase tracking-[0.2em] text-[var(--white)] transition-colors hover:border-[var(--accent-muted)] hover:text-[var(--accent)]"
            onClick={() => {
              const maxScroll = document.documentElement.scrollHeight - window.innerHeight
              window.scrollTo({ top: SECTION_SCROLL_ANCHORS.contact * maxScroll, behavior: 'smooth' })
            }}
          >
            Start a project
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.45 }}
          className="absolute bottom-28 left-6 flex gap-12 md:left-16"
        >
          {[
            { value: '15+', label: 'Years' },
            { value: '120+', label: 'Launches' },
            { value: '40+', label: 'Awards' },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="font-serif-display text-2xl text-[var(--white)] md:text-3xl">{value}</span>
              <span className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <ScrollIndicator visible={visible && scrollProgress < 0.02} />
    </section>
  )
}
