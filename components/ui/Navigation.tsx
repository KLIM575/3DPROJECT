'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SECTIONS, SectionId, SECTION_SCROLL_ANCHORS } from '@/lib/constants'
import { useLenis } from '@/components/LenisProvider'

const NAV_LABELS: Record<SectionId, string> = {
  hero:         'Home',
  projects:     'Projects',
  about:        'About',
  services:     'Services',
  team:         'Team',
  testimonials: 'Reviews',
  contact:      'Contact',
}

interface NavigationProps {
  scrollProgress: number
}

function getActiveSection(progress: number): SectionId {
  const sections = Object.entries(SECTION_SCROLL_ANCHORS) as [SectionId, number][]
  let active: SectionId = 'hero'
  for (const [id, threshold] of sections) {
    if (progress >= threshold) active = id
  }
  return active
}

export function Navigation({ scrollProgress }: NavigationProps) {
  const lenis = useLenis()
  const [menuOpen, setMenuOpen] = useState(false)
  const activeSection = getActiveSection(scrollProgress)
  const visible = scrollProgress > 0.02

  function scrollToSection(id: SectionId) {
    const progress = SECTION_SCROLL_ANCHORS[id]
    const maxScroll = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    )
    const top = progress * maxScroll
    if (lenis) {
      lenis.scrollTo(top)
    } else {
      window.scrollTo({ top, behavior: 'smooth' })
    }
    setMenuOpen(false)
  }

  return (
    <>
      {/* Top header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5"
      >
        {/* Logo */}
        <div className="font-mono text-sm tracking-widest" style={{ color: 'var(--accent)' }}>
          <span className="text-glow-sm">◈</span>{' '}
          <span style={{ color: 'var(--white)' }}>CREATIVE</span>
          <span style={{ color: 'var(--accent)' }}>.DEV</span>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div
            className="flex items-center gap-0 rounded-full px-4 py-2.5 font-mono text-[10px] tracking-[0.28em] uppercase"
            style={{
              color: 'rgba(230,240,235,0.88)',
              border: '1px solid rgba(255,255,255,0.14)',
              background: 'rgba(4,8,10,0.45)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 0 24px rgba(80,255,180,0.06)',
            }}
          >
            <button
              type="button"
              className="cursor-pointer hover:opacity-100 opacity-80 transition-opacity"
              onClick={() => scrollToSection('projects')}
            >
              Work
            </button>
            <span className="mx-2 opacity-35 select-none" aria-hidden>
              —
            </span>
            <button
              type="button"
              className="cursor-pointer hover:opacity-100 opacity-80 transition-opacity"
              onClick={() => scrollToSection('contact')}
            >
              Contact
            </button>
          </div>
        </div>

        {/* Menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="relative z-50 w-8 h-8 flex flex-col justify-center gap-1.5 cursor-pointer"
          aria-label="Toggle navigation"
        >
          {[0, 1, 2].map(i => (
            <motion.span
              key={i}
              className="block h-px"
              style={{ background: 'var(--accent)' }}
              animate={{
                width: menuOpen && i === 1 ? '0%' : '100%',
                rotate: menuOpen ? (i === 0 ? 45 : i === 2 ? -45 : 0) : 0,
                translateY: menuOpen ? (i === 0 ? 6 : i === 2 ? -6 : 0) : 0,
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </button>
      </motion.header>

      {/* Full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'circle(0% at calc(100% - 2.5rem) 2.5rem)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at calc(100% - 2.5rem) 2.5rem)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at calc(100% - 2.5rem) 2.5rem)' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center"
            style={{ background: 'rgba(5, 5, 16, 0.97)' }}
          >
            <nav className="flex flex-col items-center gap-6">
              {SECTIONS.map((id, i) => (
                <motion.button
                  key={id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  onClick={() => scrollToSection(id)}
                  className="font-mono text-3xl md:text-5xl tracking-tight cursor-pointer transition-all duration-300"
                  style={{
                    color: activeSection === id ? 'var(--accent)' : 'var(--white)',
                    opacity: activeSection === id ? 1 : 0.4,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--accent)'
                    e.currentTarget.style.opacity = '1'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = activeSection === id ? 'var(--accent)' : 'var(--white)'
                    e.currentTarget.style.opacity = activeSection === id ? '1' : '0.4'
                  }}
                >
                  <span className="text-sm font-mono mr-4" style={{ color: 'var(--muted)' }}>
                    0{i + 1}
                  </span>
                  {NAV_LABELS[id]}
                </motion.button>
              ))}
            </nav>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-10 flex gap-8 font-mono text-xs tracking-widest"
              style={{ color: 'var(--muted)' }}
            >
              {['GitHub', 'Twitter', 'LinkedIn', 'Dribbble'].map(link => (
                <a key={link} href="#" className="hover:text-cyan-400 transition-colors">{link}</a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right side progress tracker */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
            className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3 hidden md:flex"
          >
            {/* Vertical progress line */}
            <div
              className="absolute left-1/2 -translate-x-1/2 w-px"
              style={{
                height: `${SECTIONS.length * 28}px`,
                background: 'rgba(0,255,255,0.1)',
              }}
            >
              <motion.div
                className="w-full"
                style={{
                  background: 'var(--accent)',
                  height: `${Math.min(scrollProgress / 0.9, 1) * 100}%`,
                  boxShadow: '0 0 8px var(--accent)',
                }}
              />
            </div>

            {SECTIONS.map((id, i) => {
              const isActive = activeSection === id
              return (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  title={NAV_LABELS[id]}
                  className="relative flex items-center justify-center w-6 h-6 cursor-pointer group"
                >
                  <motion.div
                    animate={{
                      scale: isActive ? 1.4 : 1,
                      opacity: isActive ? 1 : 0.4,
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: isActive ? 'var(--accent)' : 'var(--muted)',
                      boxShadow: isActive ? '0 0 8px var(--accent)' : 'none',
                    }}
                  />
                  {/* Tooltip */}
                  <span
                    className="absolute right-8 font-mono text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ color: 'var(--accent)' }}
                  >
                    {NAV_LABELS[id]}
                  </span>
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile bottom nav */}
      <AnimatePresence>
        {visible && (
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center py-3 px-4 md:hidden"
            style={{
              background: 'rgba(5,5,16,0.9)',
              borderTop: '1px solid var(--border)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {(['hero', 'projects', 'about', 'services', 'contact'] as SectionId[]).map(id => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="flex flex-col items-center gap-1 font-mono text-xs transition-all"
                style={{ color: activeSection === id ? 'var(--accent)' : 'var(--muted)' }}
              >
                <div
                  className="w-1 h-1 rounded-full"
                  style={{
                    background: activeSection === id ? 'var(--accent)' : 'transparent',
                    boxShadow: activeSection === id ? '0 0 6px var(--accent)' : 'none',
                  }}
                />
                {NAV_LABELS[id].substring(0, 4)}
              </button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
