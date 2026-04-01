'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export function ContactForm() {
  const [focused, setFocused] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 py-12"
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
          style={{ border: '1px solid var(--accent)', color: 'var(--accent)' }}
        >
          ◈
        </div>
        <p className="font-mono text-sm tracking-widest" style={{ color: 'var(--accent)' }}>
          TRANSMISSION RECEIVED
        </p>
        <p className="text-center" style={{ color: 'var(--text)' }}>
          We'll be in touch soon.
        </p>
      </motion.div>
    )
  }

  const fields = [
    { id: 'name', label: 'Your Name', type: 'text', placeholder: 'Alex Smith' },
    { id: 'email', label: 'Email Address', type: 'email', placeholder: 'alex@company.com' },
    { id: 'project', label: 'Project Type', type: 'text', placeholder: 'WebGL Experience, Product Launch...' },
  ]

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {fields.map(({ id, label, type, placeholder }) => (
        <div key={id} className="relative">
          <label
            htmlFor={id}
            className="block font-mono text-xs tracking-widest mb-2 uppercase transition-colors"
            style={{ color: focused === id ? 'var(--accent)' : 'var(--muted)' }}
          >
            {label}
          </label>
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            required
            onFocus={() => setFocused(id)}
            onBlur={() => setFocused(null)}
            className="w-full px-4 py-3 bg-transparent font-mono text-sm outline-none transition-all duration-300"
            style={{
              color: 'var(--white)',
              border: `1px solid ${focused === id ? 'var(--accent)' : 'rgba(255,255,255,0.1)'}`,
              boxShadow: focused === id ? '0 0 15px rgba(0,255,255,0.1)' : 'none',
              borderRadius: '2px',
            }}
          />
        </div>
      ))}

      {/* Message */}
      <div className="relative">
        <label
          htmlFor="message"
          className="block font-mono text-xs tracking-widest mb-2 uppercase transition-colors"
          style={{ color: focused === 'message' ? 'var(--accent)' : 'var(--muted)' }}
        >
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="Tell us about your project..."
          required
          onFocus={() => setFocused('message')}
          onBlur={() => setFocused(null)}
          className="w-full px-4 py-3 bg-transparent font-mono text-sm outline-none transition-all duration-300 resize-none"
          style={{
            color: 'var(--white)',
            border: `1px solid ${focused === 'message' ? 'var(--accent)' : 'rgba(255,255,255,0.1)'}`,
            boxShadow: focused === 'message' ? '0 0 15px rgba(0,255,255,0.1)' : 'none',
            borderRadius: '2px',
          }}
        />
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative overflow-hidden py-4 px-8 font-mono text-sm tracking-widest uppercase cursor-pointer transition-all duration-300 group"
        style={{
          border: '1px solid var(--accent)',
          color: 'var(--accent)',
          background: 'transparent',
          borderRadius: '2px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--accent)'
          e.currentTarget.style.color = 'var(--bg)'
          e.currentTarget.style.boxShadow = '0 0 30px rgba(0,255,255,0.4)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = 'var(--accent)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        Send Transmission
      </motion.button>
    </form>
  )
}
