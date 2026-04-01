'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Project } from '@/data/portfolio'

interface ProjectCardProps {
  project: Project
  index: number
  total: number
}

export function ProjectCard({ project, index, total }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative cursor-pointer group"
      style={{
        transform: `scale(${hovered ? 1.02 : 1})`,
        transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease',
        opacity: hovered ? 1 : 0.85,
      }}
    >
      {/* Card */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: `1px solid ${hovered ? project.color : 'rgba(255,255,255,0.06)'}`,
          boxShadow: hovered ? `0 0 30px ${project.color}22, 0 0 60px ${project.color}11` : 'none',
          transition: 'all 0.4s ease',
          borderRadius: '2px',
        }}
      >
        {/* Preview area */}
        <div
          className="relative w-full aspect-video overflow-hidden"
          style={{ background: `${project.color}08` }}
        >
          {/* Animated gradient preview */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: hovered
                ? [
                    `radial-gradient(circle at 20% 50%, ${project.color}33 0%, transparent 60%)`,
                    `radial-gradient(circle at 80% 50%, ${project.color}33 0%, transparent 60%)`,
                    `radial-gradient(circle at 20% 50%, ${project.color}33 0%, transparent 60%)`,
                  ]
                : `radial-gradient(circle at 50% 50%, ${project.color}11 0%, transparent 70%)`,
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(${project.color}40 1px, transparent 1px), linear-gradient(90deg, ${project.color}40 1px, transparent 1px)`,
              backgroundSize: '30px 30px',
            }}
          />

          {/* Corner accent */}
          <div
            className="absolute top-3 left-3 flex items-center gap-2 font-mono text-xs"
            style={{ color: project.color }}
          >
            <span className="opacity-60">{String(index + 1).padStart(2, '0')}</span>
            <span
              className="px-1.5 py-0.5 text-xs"
              style={{
                background: `${project.color}20`,
                border: `1px solid ${project.color}40`,
                borderRadius: '2px',
              }}
            >
              {project.category}
            </span>
          </div>

          {/* Year */}
          <div
            className="absolute top-3 right-3 font-mono text-xs opacity-40"
            style={{ color: project.color }}
          >
            {project.year}
          </div>

          {/* Hover indicator */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <span
              className="font-mono text-xs tracking-widest"
              style={{ color: project.color }}
            >
              VIEW PROJECT →
            </span>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3
            className="text-lg font-bold mb-2 tracking-tight"
            style={{ color: 'var(--white)', fontFamily: 'var(--font-space-grotesk)' }}
          >
            {project.title}
          </h3>
          <p
            className="text-sm leading-relaxed mb-4 line-clamp-2"
            style={{ color: 'var(--text)' }}
          >
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="font-mono text-xs px-2 py-0.5"
                style={{
                  color: 'var(--muted)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '2px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom accent line */}
        <motion.div
          className="absolute bottom-0 left-0 h-px"
          animate={{ width: hovered ? '100%' : '0%' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ background: project.color }}
        />
      </div>
    </motion.div>
  )
}
