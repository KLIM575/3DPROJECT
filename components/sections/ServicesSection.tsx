'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SectionTitle } from '../ui/SectionTitle'
import { services } from '@/data/portfolio'

export function ServicesSection() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section className="relative min-h-screen px-6 py-24 md:px-16 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 md:mb-20">
          <SectionTitle
            label="Capabilities"
            title="What we deliver"
            subtitle="From first sketch to shipped build — strategy, design, real-time graphics, and long-term performance."
          />
        </div>

        <div className="grid grid-cols-1 gap-px border border-[var(--border)] bg-[var(--border)] md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: i * 0.06 }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="bg-[var(--bg)] p-8 transition-colors duration-300"
              style={{
                background: hovered === i ? 'var(--bg-elevated)' : 'var(--bg)',
              }}
            >
              <div
                className="mb-5 text-2xl transition-colors duration-300"
                style={{ color: hovered === i ? 'var(--accent)' : 'var(--muted)' }}
              >
                {service.icon}
              </div>

              <h3 className="mb-3 font-serif-display text-lg tracking-tight text-[var(--white)] md:text-xl">
                {service.title}
              </h3>

              <p className="text-sm leading-relaxed text-[var(--muted)]">{service.description}</p>

              <motion.div
                initial={false}
                animate={{ opacity: hovered === i ? 1 : 0, x: hovered === i ? 0 : -6 }}
                transition={{ duration: 0.2 }}
                className="mt-6 font-mono-ui text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]"
              >
                →
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
