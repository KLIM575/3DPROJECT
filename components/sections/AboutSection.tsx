'use client'

import { motion } from 'framer-motion'
import { SectionTitle } from '../ui/SectionTitle'

export function AboutSection() {
  return (
    <section className="relative min-h-screen px-6 md:px-16 py-24 md:py-32 flex items-center">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: text */}
        <div className="flex flex-col gap-8">
          <SectionTitle
            label="About"
            title="Obsessed with real-time."
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-5"
          >
            <p className="text-base leading-relaxed" style={{ color: 'var(--text)' }}>
              Founded in 2012, we're a creative studio built on the belief that the browser
              is the most powerful canvas in existence. We've spent over a decade pushing WebGL,
              WebGPU and real-time rendering to their absolute limits.
            </p>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text)' }}>
              Our proprietary rendering pipeline delivers award-winning experiences that
              consistently clock sub-1.5s LCP despite heavy shader workloads. We call it
              making the impossible feel inevitable.
            </p>
          </motion.div>

          {/* Philosophy items */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-4"
          >
            {[
              { icon: '◈', text: 'Performance is aesthetics — 60fps or bust.' },
              { icon: '⬡', text: 'We build our own tools when existing ones fall short.' },
              { icon: '◎', text: 'Every interaction should feel like a discovery.' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-start gap-4">
                <span className="text-lg mt-0.5" style={{ color: 'var(--accent)' }}>{icon}</span>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>{text}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: awards / stats grid */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-2 gap-4"
        >
          {[
            { value: '50+', label: 'Awwwards', sub: 'Site of the Day' },
            { value: '12', label: 'Webby Awards', sub: 'Best in Category' },
            { value: '200+', label: 'Projects', sub: 'Shipped Worldwide' },
            { value: '8', label: 'Countries', sub: 'Global Clients' },
          ].map(({ value, label, sub }) => (
            <div
              key={label}
              className="p-6 flex flex-col gap-2"
              style={{
                border: '1px solid var(--border)',
                background: 'rgba(0,255,255,0.02)',
                borderRadius: '2px',
              }}
            >
              <span
                className="text-4xl font-bold"
                style={{ color: 'var(--accent)', fontFamily: 'var(--font-space-grotesk)' }}
              >
                {value}
              </span>
              <span className="font-bold text-sm" style={{ color: 'var(--white)' }}>{label}</span>
              <span className="font-mono text-xs" style={{ color: 'var(--muted)' }}>{sub}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
