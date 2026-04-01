'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SectionTitle } from '../ui/SectionTitle'
import { services } from '@/data/portfolio'

export function ServicesSection() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section className="relative min-h-screen px-6 md:px-16 py-24 md:py-32">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <SectionTitle
            label="What We Do"
            title="Services"
            subtitle="From concept to deployment — we cover the full creative technology stack."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="relative p-8 cursor-default transition-all duration-400"
              style={{
                border: '1px solid rgba(255,255,255,0.05)',
                background: hovered === i ? 'rgba(0,255,255,0.03)' : 'transparent',
                borderColor: hovered === i ? 'rgba(0,255,255,0.2)' : 'rgba(255,255,255,0.05)',
              }}
            >
              {/* Icon */}
              <div
                className="text-3xl mb-5 transition-all duration-300"
                style={{
                  color: hovered === i ? 'var(--accent)' : 'var(--muted)',
                  textShadow: hovered === i ? '0 0 20px rgba(0,255,255,0.5)' : 'none',
                }}
              >
                {service.icon}
              </div>

              <h3
                className="text-lg font-bold mb-3"
                style={{
                  color: hovered === i ? 'var(--white)' : 'var(--text)',
                  fontFamily: 'var(--font-space-grotesk)',
                  transition: 'color 0.3s ease',
                }}
              >
                {service.title}
              </h3>

              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--muted)' }}
              >
                {service.description}
              </p>

              {/* Hover arrow */}
              <motion.div
                animate={{ opacity: hovered === i ? 1 : 0, x: hovered === i ? 0 : -10 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-8 right-8 font-mono text-xs"
                style={{ color: 'var(--accent)' }}
              >
                →
              </motion.div>

              {/* Active corner accent */}
              {hovered === i && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  className="absolute bottom-0 left-0 h-px w-full"
                  style={{ background: 'var(--accent)', transformOrigin: 'left' }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
