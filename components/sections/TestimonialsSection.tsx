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
    }, 5200)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative px-6 py-24 md:px-16 md:py-32">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 md:mb-20">
          <SectionTitle label="Clients" title="In their words" align="center" />
        </div>

        <div className="relative min-h-56 md:min-h-64">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-8 text-center"
            >
              <blockquote className="font-serif-display max-w-3xl text-xl font-normal leading-snug text-[var(--white)] md:text-2xl lg:text-3xl">
                {testimonials[active].quote}
              </blockquote>

              <div className="flex flex-col items-center gap-2">
                <div className="h-px w-10 bg-[var(--accent-muted)]" />
                <span className="text-sm text-[var(--white)]">{testimonials[active].author}</span>
                <span className="font-mono-ui text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                  {testimonials[active].company}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-12 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className="h-1.5 cursor-pointer rounded-full transition-all duration-300"
              style={{
                width: active === i ? 28 : 6,
                background: active === i ? 'var(--accent)' : 'var(--muted)',
                opacity: active === i ? 1 : 0.35,
              }}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
