'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SECTIONS, SectionId, SECTION_SCROLL_ANCHORS } from '@/lib/constants'
import { useLenis } from '@/components/LenisProvider'

const NAV_LABELS: Record<SectionId, string> = {
  hero: 'Home',
  projects: 'Work',
  about: 'About',
  services: 'Capabilities',
  team: 'Team',
  testimonials: 'Words',
  contact: 'Contact',
}

const PRIMARY_LINKS: SectionId[] = ['projects', 'about', 'contact']

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
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    const top = progress * maxScroll
    if (lenis) lenis.scrollTo(top)
    else window.scrollTo({ top, behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-10 py-5 md:py-6"
      >
        <button
          type="button"
          onClick={() => scrollToSection('hero')}
          className="font-serif-display text-lg tracking-tight text-[var(--white)] transition-opacity hover:opacity-80"
        >
          Studio
        </button>

        <div className="hidden md:flex items-center gap-10">
          {PRIMARY_LINKS.map(id => (
            <button
              key={id}
              type="button"
              onClick={() => scrollToSection(id)}
              className="font-mono-ui text-[11px] uppercase tracking-[0.2em] transition-colors"
              style={{
                color: activeSection === id ? 'var(--white)' : 'var(--muted)',
              }}
            >
              {NAV_LABELS[id]}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="font-mono-ui relative z-50 text-[11px] uppercase tracking-[0.24em] text-[var(--text)] transition-colors hover:text-[var(--white)]"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 flex flex-col justify-center px-8 md:px-16"
            style={{ background: 'rgba(10, 10, 12, 0.96)' }}
          >
            <nav className="flex flex-col gap-1 md:gap-2">
              {SECTIONS.map((id, i) => (
                <motion.button
                  key={id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ delay: i * 0.04, duration: 0.35 }}
                  type="button"
                  onClick={() => scrollToSection(id)}
                  className="group flex items-baseline gap-6 py-3 text-left border-b border-[var(--border)] transition-colors"
                >
                  <span className="font-mono-ui text-[10px] text-[var(--muted)] tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="font-serif-display text-3xl md:text-5xl tracking-tight"
                    style={{
                      color: activeSection === id ? 'var(--white)' : 'var(--muted)',
                    }}
                  >
                    {NAV_LABELS[id]}
                  </span>
                </motion.button>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="absolute bottom-10 left-8 right-8 md:left-16 md:right-16 flex flex-wrap gap-6 font-mono-ui text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]"
            >
              {['GitHub', 'Twitter', 'LinkedIn'].map(link => (
                <a key={link} href="#" className="hover:text-[var(--white)] transition-colors">
                  {link}
                </a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-2 md:flex"
            aria-hidden
          >
            <div className="relative mb-1 h-28 w-px bg-[var(--border)]">
              <motion.div
                className="absolute bottom-0 left-0 w-full bg-[var(--accent)] opacity-80"
                style={{ height: `${Math.min(scrollProgress / 0.92, 1) * 100}%` }}
              />
            </div>
            {SECTIONS.map(id => {
              const isActive = activeSection === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollToSection(id)}
                  title={NAV_LABELS[id]}
                  className="flex h-5 w-5 items-center justify-center"
                >
                  <span
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: isActive ? 6 : 4,
                      height: isActive ? 6 : 4,
                      background: isActive ? 'var(--accent)' : 'var(--muted)',
                      opacity: isActive ? 1 : 0.45,
                    }}
                  />
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {visible && (
          <motion.nav
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-0 left-0 right-0 z-40 flex justify-between gap-1 border-t border-[var(--border)] bg-[var(--bg)]/90 px-3 py-3 backdrop-blur-md md:hidden"
          >
            {(['projects', 'about', 'contact'] as SectionId[]).map(id => (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                className="flex-1 py-2 font-mono-ui text-[9px] uppercase tracking-wider transition-colors"
                style={{ color: activeSection === id ? 'var(--white)' : 'var(--muted)' }}
              >
                {NAV_LABELS[id]}
              </button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
