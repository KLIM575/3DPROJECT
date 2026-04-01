'use client'

import dynamic from 'next/dynamic'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { useDevicePerformance } from '@/hooks/useDevicePerformance'
import { Navigation } from '@/components/ui/Navigation'
import { HeroSection } from '@/components/sections/HeroSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { TeamSection } from '@/components/sections/TeamSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { LenisProvider } from '@/components/LenisProvider'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { CursorGlow } from '@/components/ui/CursorGlow'
import { TOTAL_SCROLL_HEIGHT } from '@/lib/constants'

// Canvas must be client-only (no SSR)
const MainCanvas = dynamic(
  () => import('@/components/canvas/MainCanvas').then(m => m.MainCanvas),
  { ssr: false }
)

function PortfolioContent() {
  const { progress } = useScrollProgress()
  const quality = useDevicePerformance()

  return (
    <>
      {/* Loading screen */}
      <LoadingScreen />

      {/* Custom cursor (desktop only) */}
      <CursorGlow />

      {/* Fixed full-screen 3D canvas */}
      <div className="canvas-container" style={{ pointerEvents: 'none' }}>
        <MainCanvas scrollProgress={progress} quality={quality} />
      </div>

      {/* Gradient vignette overlay */}
      <div
        className="fixed inset-0 z-[2] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(5,5,16,0.6) 100%)',
        }}
      />

      {/* Navigation (fixed overlay) */}
      <Navigation scrollProgress={progress} />

      {/* Scrollable content */}
      <div className="scroll-container" style={{ minHeight: TOTAL_SCROLL_HEIGHT }}>
        <HeroSection scrollProgress={progress} />
        <ProjectsSection />
        <AboutSection />
        <ServicesSection />
        <TeamSection />
        <TestimonialsSection />
        <ContactSection />
      </div>
    </>
  )
}

export default function Home() {
  return (
    <LenisProvider>
      <PortfolioContent />
    </LenisProvider>
  )
}
