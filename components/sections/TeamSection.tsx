'use client'

import { motion } from 'framer-motion'
import { SectionTitle } from '../ui/SectionTitle'
import { teamMembers } from '@/data/portfolio'

export function TeamSection() {
  return (
    <section className="relative px-6 md:px-16 py-24 md:py-32">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <SectionTitle
            label="The Team"
            title="Makers."
            subtitle="A tight-knit crew of engineers, artists and obsessive perfectionists."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="group flex flex-col gap-4"
            >
              {/* Avatar placeholder */}
              <div
                className="relative aspect-square overflow-hidden"
                style={{ borderRadius: '2px', border: '1px solid var(--border)' }}
              >
                <div
                  className="absolute inset-0 flex items-center justify-center text-4xl font-bold"
                  style={{
                    background: `linear-gradient(135deg, rgba(0,255,255,0.05), rgba(0,136,255,0.05))`,
                    color: 'var(--accent)',
                    fontFamily: 'var(--font-space-grotesk)',
                  }}
                >
                  {member.name.charAt(0)}
                </div>
                {/* Grid overlay */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />
                {/* Corner accent */}
                <div
                  className="absolute top-2 right-2 w-4 h-4"
                  style={{
                    borderTop: '1px solid var(--accent)',
                    borderRight: '1px solid var(--accent)',
                  }}
                />
                <div
                  className="absolute bottom-2 left-2 w-4 h-4"
                  style={{
                    borderBottom: '1px solid var(--accent)',
                    borderLeft: '1px solid var(--accent)',
                  }}
                />
              </div>

              <div className="flex flex-col gap-1">
                <h3
                  className="font-bold text-base"
                  style={{ color: 'var(--white)', fontFamily: 'var(--font-space-grotesk)' }}
                >
                  {member.name}
                </h3>
                <span
                  className="font-mono text-xs"
                  style={{ color: 'var(--accent)' }}
                >
                  {member.role}
                </span>
                <p
                  className="text-sm leading-relaxed mt-1"
                  style={{ color: 'var(--muted)' }}
                >
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
