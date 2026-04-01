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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col gap-3 ${alignClass}`}
    >
      <span
        className="font-mono text-xs tracking-widest uppercase"
        style={{ color: 'var(--accent)' }}
      >
        [ {label} ]
      </span>
      <h2
        className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none"
        style={{ color: 'var(--white)', fontFamily: 'var(--font-space-grotesk)' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="text-base md:text-lg max-w-xl leading-relaxed"
          style={{ color: 'var(--text)' }}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
