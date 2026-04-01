'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Project } from '@/data/portfolio'

interface ProjectCardProps {
  project: Project
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group cursor-pointer"
    >
      <div
        className="overflow-hidden border border-[var(--border)] bg-[var(--bg-elevated)] transition-colors duration-500"
        style={{
          borderColor: hovered ? 'rgba(255,255,255,0.14)' : undefined,
        }}
      >
        <div
          className="relative aspect-[16/10] w-full overflow-hidden"
          style={{ background: `linear-gradient(145deg, ${project.color}14, transparent 55%)` }}
        >
          <motion.div
            className="absolute inset-0"
            animate={{ scale: hovered ? 1.03 : 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${project.color}22, transparent 70%)`,
            }}
          />

          <div className="absolute left-4 top-4 flex items-center gap-3">
            <span className="font-mono-ui text-[10px] tabular-nums text-[var(--muted)]">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="font-mono-ui text-[10px] uppercase tracking-[0.16em] text-[var(--text)]">
              {project.category}
            </span>
          </div>
          <span className="absolute right-4 top-4 font-mono-ui text-[10px] text-[var(--muted)]">{project.year}</span>

          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={false}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <span className="font-mono-ui text-[10px] uppercase tracking-[0.22em] text-[var(--white)]">
              View case →
            </span>
          </motion.div>
        </div>

        <div className="p-5 md:p-6">
          <h3 className="mb-2 font-serif-display text-xl tracking-tight text-[var(--white)] md:text-2xl">
            {project.title}
          </h3>
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-[var(--text)]">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="border border-[var(--border)] px-2 py-0.5 font-mono-ui text-[10px] uppercase tracking-wider text-[var(--muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  )
}
