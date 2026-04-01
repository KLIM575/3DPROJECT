'use client'

import { motion } from 'framer-motion'
import { SectionTitle } from '../ui/SectionTitle'
import { ProjectCard } from '../ui/ProjectCard'
import { projects } from '@/data/portfolio'

export function ProjectsSection() {
  return (
    <section className="relative min-h-screen px-6 md:px-16 py-24 md:py-32">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <SectionTitle
            label="Selected Work"
            title="Projects"
            subtitle="A curated selection of interactive experiences, campaigns and digital experiments."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              total={projects.length}
            />
          ))}
        </div>

        {/* View all CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 flex justify-center"
        >
          <button
            className="font-mono text-sm tracking-widest uppercase px-8 py-4 transition-all duration-300"
            style={{
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--muted)',
              borderRadius: '2px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)'
              e.currentTarget.style.color = 'var(--accent)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.color = 'var(--muted)'
            }}
          >
            All Projects →
          </button>
        </motion.div>
      </div>
    </section>
  )
}
