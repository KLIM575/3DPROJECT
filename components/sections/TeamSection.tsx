'use client'

import { motion } from 'framer-motion'
import { SectionTitle } from '../ui/SectionTitle'
import { teamMembers } from '@/data/portfolio'

export function TeamSection() {
  return (
    <section className="relative px-6 py-24 md:px-16 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 md:mb-20">
          <SectionTitle
            label="People"
            title="Core team"
            subtitle="Engineers, designers, and directors — all in one room."
          />
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {teamMembers.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col gap-4"
            >
              <div
                className="relative aspect-square overflow-hidden border border-[var(--border)]"
                style={{
                  background: 'linear-gradient(160deg, rgba(196,165,116,0.08), rgba(139,155,180,0.06))',
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center font-serif-display text-4xl text-[var(--accent)]">
                  {member.name.charAt(0)}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="font-serif-display text-lg text-[var(--white)]">{member.name}</h3>
                <span className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">
                  {member.role}
                </span>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
