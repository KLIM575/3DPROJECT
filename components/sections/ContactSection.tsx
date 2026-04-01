'use client'

import { motion } from 'framer-motion'
import { SectionTitle } from '../ui/SectionTitle'
import { ContactForm } from '../ui/ContactForm'

export function ContactSection() {
  return (
    <section className="relative flex min-h-screen items-center px-6 py-24 md:px-16 md:py-32">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20">
        <div className="flex flex-col gap-10">
          <SectionTitle
            label="Contact"
            title="Tell us what you are building."
            subtitle="New sites, rebrands, interactive films, and product launches — we take a handful of projects each quarter."
          />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.65 }}
            className="flex flex-col gap-6"
          >
            {[
              { label: 'General', value: 'hello@studio.example', href: 'mailto:hello@studio.example' },
              { label: 'New business', value: 'work@studio.example', href: 'mailto:work@studio.example' },
              { label: 'Location', value: 'Remote · worldwide', href: null },
            ].map(({ label, value, href }) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                  {label}
                </span>
                {href ? (
                  <a
                    href={href}
                    className="text-base text-[var(--white)] transition-colors hover:text-[var(--accent)]"
                  >
                    {value}
                  </a>
                ) : (
                  <span className="text-base text-[var(--white)]">{value}</span>
                )}
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="flex flex-wrap gap-6"
          >
            {['GitHub', 'Twitter', 'LinkedIn'].map(s => (
              <a
                key={s}
                href="#"
                className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] transition-colors hover:text-[var(--white)]"
              >
                {s}
              </a>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, delay: 0.15 }}
        >
          <ContactForm />
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-6 right-6 flex flex-col gap-2 border-t border-[var(--border)] pt-6 font-mono-ui text-[10px] uppercase tracking-[0.18em] text-[var(--muted)] md:left-16 md:right-16 md:flex-row md:justify-between">
        <span>© {new Date().getFullYear()} Studio</span>
        <span>Three.js · R3F · Babylon</span>
      </div>
    </section>
  )
}
