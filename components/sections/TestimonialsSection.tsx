'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionTitle } from '../ui/SectionTitle'
import { testimonials } from '@/data/portfolio'

export function TestimonialsSection() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActive(prev => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative px-6 md:px-16 py-24 md:py-32">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16">
          <SectionTitle
            label="Client Words"
            title="Results."
            align="center"
          />
        </div>

        <div className="relative min-h-64">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-8 text-center"
            >
              {/* Quote mark */}
              <div
                className="text-7xl font-bold leading-none"
                style={{
                  color: 'var(--accent)',
                  opacity: 0.3,
                  fontFamily: 'Georgia, serif',
                  lineHeight: 0.8,
                }}
              >
                "
              </div>

              <blockquote
                className="text-xl md:text-2xl lg:text-3xl font-medium leading-relaxed max-w-3xl"
                style={{ color: 'var(--white)', fontFamily: 'var(--font-space-grotesk)' }}
              >
                {testimonials[active].quote}
              </blockquote>

              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-px mb-3" style={{ background: 'var(--accent)' }} />
                <span
                  className="font-bold text-sm"
                  style={{ color: 'var(--white)' }}
                >
                  {testimonials[active].author}
                </span>
                <span
                  className="font-mono text-xs"
                  style={{ color: 'var(--muted)' }}
                >
                  {testimonials[active].company}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-3 mt-12">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="transition-all duration-300 cursor-pointer"
              style={{
                width: active === i ? '24px' : '6px',
                height: '6px',
                borderRadius: active === i ? '3px' : '50%',
                background: active === i ? 'var(--accent)' : 'var(--muted)',
                boxShadow: active === i ? '0 0 10px var(--accent)' : 'none',
              }}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
