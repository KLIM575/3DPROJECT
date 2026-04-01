'use client'

import { motion } from 'framer-motion'
import { SectionTitle } from '../ui/SectionTitle'

export function AboutSection() {
  return (
    <section className="relative flex min-h-screen items-center px-6 py-24 md:px-16 md:py-32">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
        <div className="flex flex-col gap-10">
          <SectionTitle
            label="Studio"
            title="Design, engineering, and real-time craft."
          />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.75, delay: 0.15 }}
            className="flex flex-col gap-5"
          >
            <p className="text-base leading-relaxed text-[var(--text)]">
              We are a small team obsessed with how light, motion, and interaction feel in the browser. Our work
              lives at the intersection of editorial design, WebGL, and performance.
            </p>
            <p className="text-base leading-relaxed text-[var(--text)]">
              Every launch is treated like a product: clear narrative, restrained UI, and a 3D layer that supports
              the story instead of overpowering it.
            </p>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col gap-4"
          >
            {[
              'Motion and scroll as a single timeline.',
              'Custom pipelines when tools stop short.',
              'Quiet interfaces, loud craft.',
            ].map(text => (
              <li key={text} className="flex gap-4 text-sm leading-relaxed text-[var(--text)]">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)] opacity-70" />
                {text}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75, delay: 0.2 }}
          className="grid grid-cols-2 gap-3 md:gap-4"
        >
          {[
            { value: '50+', label: 'Recognitions', sub: 'Industry features' },
            { value: '12', label: 'Years', sub: 'Continuous practice' },
            { value: '200+', label: 'Shipped', sub: 'Global launches' },
            { value: '8', label: 'Regions', sub: 'Remote-first' },
          ].map(({ value, label, sub }) => (
            <div
              key={label}
              className="flex flex-col gap-2 border border-[var(--border)] bg-[var(--bg-elevated)] p-6 md:p-7"
            >
              <span className="font-serif-display text-3xl text-[var(--accent)] md:text-4xl">{value}</span>
              <span className="text-sm font-medium text-[var(--white)]">{label}</span>
              <span className="font-mono-ui text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">{sub}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
