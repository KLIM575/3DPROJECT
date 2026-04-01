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
      className="relative flex items-center justify-center min-h-screen px-6 md:px-16"
      style={{ pointerEvents: scrollProgress > HERO_FADE_END * 0.55 ? 'none' : 'auto' }}
    >
      <div className="max-w-5xl w-full" style={{ opacity }}>
        {/* Pre-title */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-8 h-px" style={{ background: 'var(--accent)' }} />
          <span
            className="font-mono text-[10px] md:text-xs tracking-[0.35em] uppercase"
            style={{ color: 'rgba(200,220,210,0.75)' }}
          >
            Immersive studio
          </span>
        </motion.div>

        {/* Main title */}
        <div className="overflow-hidden mb-6">
          {['Stories', 'in motion', 'worlds.'].map((line, i) => (
            <motion.div
              key={i}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.5 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1
                className="block text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold tracking-[-0.04em] leading-[0.92]"
                style={{
                  fontFamily: 'var(--font-space-grotesk)',
                  color: i === 2 ? 'var(--accent)' : 'rgba(248,250,252,0.96)',
                  textShadow: i === 2 ? '0 0 48px rgba(93,255,196,0.25)' : 'none',
                }}
              >
                {line}
              </h1>
            </motion.div>
          ))}
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="text-sm md:text-lg max-w-md leading-relaxed mb-12 font-light"
          style={{ color: 'rgba(180,190,200,0.85)' }}
        >
          Scroll — mist becomes forest, forest opens to stars, stars collapse into form, then the garden returns.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            className="px-8 py-4 font-mono text-sm tracking-widest uppercase transition-all duration-300"
            style={{
              background: 'var(--accent)',
              color: 'var(--bg)',
              border: '1px solid var(--accent)',
              borderRadius: '2px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0,255,255,0.5)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none'
            }}
            onClick={() => {
              const maxScroll = document.documentElement.scrollHeight - window.innerHeight
              window.scrollTo({ top: SECTION_SCROLL_ANCHORS.projects * maxScroll, behavior: 'smooth' })
            }}
          >
            View Work
          </button>
          <button
            className="px-8 py-4 font-mono text-sm tracking-widest uppercase transition-all duration-300"
            style={{
              background: 'transparent',
              color: 'var(--white)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '2px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)'
              e.currentTarget.style.color = 'var(--accent)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
              e.currentTarget.style.color = 'var(--white)'
            }}
            onClick={() => {
              const maxScroll = document.documentElement.scrollHeight - window.innerHeight
              window.scrollTo({ top: SECTION_SCROLL_ANCHORS.contact * maxScroll, behavior: 'smooth' })
            }}
          >
            Get in Touch
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="absolute bottom-24 left-6 md:left-16 flex gap-10"
        >
          {[
            { value: '12+', label: 'Years of R&D' },
            { value: '50+', label: 'Awards Won' },
            { value: '200+', label: 'Projects Shipped' },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col">
              <span
                className="text-2xl font-bold"
                style={{ color: 'var(--accent)', fontFamily: 'var(--font-space-grotesk)' }}
              >
                {value}
              </span>
              <span className="font-mono text-xs" style={{ color: 'var(--muted)' }}>{label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <ScrollIndicator visible={visible && scrollProgress < 0.02} />
    </section>
  )
}
