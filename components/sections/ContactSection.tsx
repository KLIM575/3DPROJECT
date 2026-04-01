'use client'

import { motion } from 'framer-motion'
import { SectionTitle } from '../ui/SectionTitle'
import { ContactForm } from '../ui/ContactForm'

export function ContactSection() {
  return (
    <section className="relative min-h-screen px-6 md:px-16 py-24 md:py-32 flex items-center">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left */}
        <div className="flex flex-col gap-10">
          <SectionTitle
            label="Get in Touch"
            title="Start a Project."
            subtitle="Have an idea that needs the impossible treatment? Let's talk."
          />

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-5"
          >
            {[
              { label: 'Email', value: 'hello@creative.dev', href: 'mailto:hello@creative.dev' },
              { label: 'New Business', value: 'work@creative.dev', href: 'mailto:work@creative.dev' },
              { label: 'Location', value: 'Remote · Worldwide', href: null },
            ].map(({ label, value, href }) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="font-mono text-xs tracking-widest" style={{ color: 'var(--muted)' }}>
                  {label}
                </span>
                {href ? (
                  <a
                    href={href}
                    className="text-base transition-colors"
                    style={{ color: 'var(--white)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--white)' }}
                  >
                    {value}
                  </a>
                ) : (
                  <span className="text-base" style={{ color: 'var(--white)' }}>{value}</span>
                )}
              </div>
            ))}
          </motion.div>

          {/* Socials */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex gap-5"
          >
            {['GitHub', 'Twitter', 'LinkedIn', 'Dribbble'].map(s => (
              <a
                key={s}
                href="#"
                className="font-mono text-xs tracking-widest transition-colors"
                style={{ color: 'var(--muted)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted)' }}
              >
                {s}
              </a>
            ))}
          </motion.div>
        </div>

        {/* Right: form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <ContactForm />
        </motion.div>
      </div>

      {/* Footer */}
      <div
        className="absolute bottom-8 left-0 right-0 px-6 md:px-16 flex justify-between items-center font-mono text-xs"
        style={{ color: 'var(--muted)' }}
      >
        <span>© 2025 Creative.Dev · All rights reserved</span>
        <span>Crafted with WebGL + R3F</span>
      </div>
    </section>
  )
}
