import type { Metadata } from 'next'
import { Instrument_Serif, Inter } from 'next/font/google'
import './globals.css'

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Studio · Creative digital experiences',
  description:
    'We craft immersive interactive work at the intersection of design, technology, and story.',
  keywords: ['WebGL', '3D', 'interactive', 'creative', 'digital', 'immersive'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${inter.variable}`}>
      <body className="font-sans antialiased" style={{ fontFamily: 'var(--font-sans), system-ui, sans-serif' }}>
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  )
}
