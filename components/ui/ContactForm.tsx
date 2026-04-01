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
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 border border-[var(--border)] bg-[var(--bg-elevated)] px-8 py-12"
      >
        <p className="font-serif-display text-2xl text-[var(--white)]">Thank you</p>
        <p className="text-sm leading-relaxed text-[var(--text)]">We will reply within a few days.</p>
      </motion.div>
    )
  }

  const fields = [
    { id: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
    { id: 'email', label: 'Email', type: 'email', placeholder: 'you@company.com' },
    { id: 'project', label: 'Project', type: 'text', placeholder: 'Launch, film site, product…' },
  ] as const

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {fields.map(({ id, label, type, placeholder }) => (
        <div key={id}>
          <label
            htmlFor={id}
            className="mb-2 block font-mono-ui text-[10px] uppercase tracking-[0.2em] transition-colors"
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
            className="w-full border border-[var(--border)] bg-transparent px-4 py-3 text-sm text-[var(--white)] outline-none transition-colors focus:border-[var(--accent-muted)]"
          />
        </div>
      ))}

      <div>
        <label
          htmlFor="message"
          className="mb-2 block font-mono-ui text-[10px] uppercase tracking-[0.2em] transition-colors"
          style={{ color: focused === 'message' ? 'var(--accent)' : 'var(--muted)' }}
        >
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="Timeline, references, constraints…"
          required
          onFocus={() => setFocused('message')}
          onBlur={() => setFocused(null)}
          className="w-full resize-none border border-[var(--border)] bg-transparent px-4 py-3 text-sm text-[var(--white)] outline-none transition-colors focus:border-[var(--accent-muted)]"
        />
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full border border-[var(--white)] bg-[var(--white)] py-4 font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--bg)] transition-opacity hover:opacity-90 md:w-auto md:px-12"
      >
        Send
      </motion.button>
    </form>
  )
}
