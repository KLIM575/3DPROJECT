'use client'

import { motion } from 'framer-motion'

interface SectionTitleProps {
  label: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

export function SectionTitle({ label, title, subtitle, align = 'left' }: SectionTitleProps) {
  const alignClass = align === 'center' ? 'items-center text-center' : 'items-start text-left'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col gap-4 ${alignClass}`}
    >
      <span className="font-mono-ui text-[10px] uppercase tracking-[0.28em] text-[var(--muted)]">{label}</span>
      <h2 className="font-serif-display text-4xl font-normal tracking-tight text-[var(--white)] md:text-5xl lg:text-6xl leading-[1.05]">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-xl text-sm leading-relaxed text-[var(--text)] md:text-base">{subtitle}</p>
      )}
    </motion.div>
  )
}
