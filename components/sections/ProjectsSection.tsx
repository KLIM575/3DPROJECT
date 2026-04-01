'use client'

import { motion } from 'framer-motion'
import { SectionTitle } from '../ui/SectionTitle'
import { ProjectCard } from '../ui/ProjectCard'
import { projects } from '@/data/portfolio'

export function ProjectsSection() {
  return (
    <section className="relative min-h-screen px-6 py-24 md:px-16 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 md:mb-24">
          <SectionTitle
            label="Selected work"
            title="Cases & experiments"
            subtitle="Interactive launches, product stories, and real-time worlds — built for the open web."
          />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mt-20 flex justify-center md:mt-28"
        >
          <button
            type="button"
            className="border border-[var(--border)] px-8 py-3.5 font-mono-ui text-[10px] uppercase tracking-[0.22em] text-[var(--muted)] transition-colors hover:border-[var(--accent-muted)] hover:text-[var(--white)]"
          >
            Archive
          </button>
        </motion.div>
      </div>
    </section>
  )
}
