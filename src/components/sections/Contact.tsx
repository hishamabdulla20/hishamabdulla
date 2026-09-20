'use client'

import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { SocialLink } from '../../types/portfolio'

type FormErrors = Partial<Record<'name' | 'email' | 'subject' | 'message', string>>

function SocialIcon({ label }: { label: string }) {
  const commonProps = {
    className: 'social-link__icon',
    viewBox: '0 0 24 24',
    'aria-hidden': true,
  }

  switch (label.toLowerCase()) {
    case 'github':
      return <svg {...commonProps}><path fill="currentColor" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0 1 12 6.82a9.6 9.6 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.77c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" /></svg>
    case 'linkedin':
      return <svg {...commonProps}><path fill="currentColor" d="M6.5 8.25H3.25V21H6.5V8.25ZM4.88 3A1.88 1.88 0 1 0 4.88 6.75 1.88 1.88 0 0 0 4.88 3ZM21 13.69c0-3.84-2.05-5.63-4.79-5.63-2.2 0-3.19 1.21-3.74 2.06V8.25H9.22V21h3.25v-6.31c0-1.66.31-3.27 2.37-3.27 2.03 0 2.06 1.9 2.06 3.38V21H21v-7.31Z" /></svg>
    case 'email':
      return <svg {...commonProps} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="1" /><path d="m4 7 8 6 8-6" /></svg>
    case 'instagram':
      return <svg {...commonProps} fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" /></svg>
    default:
      return null
  }
}

function ContactLink({ label, url }: SocialLink) {
  if (!url) return null
  const isExternal = /^https?:\/\//.test(url)

  return (
    <a
      className="text-link social-link"
      href={url}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <SocialIcon label={label} />
      <span>{label}</span>
      <span className="text-link__arrow" aria-hidden="true">↗</span>
    </a>
  )
}

export function Contact({ socialLinks }: { socialLinks: SocialLink[] }) {
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState('')
  const [statusTone, setStatusTone] = useState<'neutral' | 'success' | 'error'>('neutral')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submitting = useRef(false)
  const startedAt = useRef(0)

  useEffect(() => {
    startedAt.current = Date.now()
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting.current) return
    const form = event.currentTarget
    const data = new FormData(form)
    const nextErrors: FormErrors = {}
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const subject = String(data.get('subject') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()

    if (!name || name.length > 100 || /[\r\n]/.test(name)) nextErrors.name = 'Please enter a name of at most 100 characters on one line.'
    if (!email) nextErrors.email = 'Please enter your email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || /[<>,;]/.test(email)) nextErrors.email = 'Please enter a valid email address.'
    if (!subject || subject.length > 160 || /[\r\n]/.test(subject)) nextErrors.subject = 'Please enter a subject of at most 160 characters on one line.'
    if (message.length < 10 || message.length > 5_000) nextErrors.message = 'Please enter a message between 10 and 5,000 characters.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      setStatusTone('error')
      setStatus('Please review the highlighted fields.')
      return
    }

    submitting.current = true
    setIsSubmitting(true)
    setStatusTone('neutral')
    setStatus('Sending…')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          company: String(data.get('company') ?? ''),
          startedAt: startedAt.current || Date.now(),
        }),
      })
      const result = await response.json() as { message?: string; fieldErrors?: FormErrors }

      if (!response.ok) {
        setStatusTone('error')
        setErrors(result.fieldErrors ?? {})
        setStatus(result.message ?? 'Unable to send your message right now. Please try again later.')
        return
      }

      form.reset()
      startedAt.current = Date.now()
      setStatusTone('success')
      setStatus('Thanks! Your message has been sent successfully.')
    } catch {
      setStatusTone('error')
      setStatus('Unable to send your message right now. Please try again later.')
    } finally {
      submitting.current = false
      setIsSubmitting(false)
    }
  }

  const field = (name: keyof FormErrors) => ({
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  })

  return (
    <section className="contact-section grid-field" id="contact" aria-labelledby="contact-title" data-reveal>
      <div className="contact-heading">
        <p className="section-header__eyebrow technical-label"><span>07</span> — Contact</p>
        <p className="contact-kicker">Have an idea?</p>
        <h2 id="contact-title">Let’s build<br />something<br /><em>together.</em></h2>
        <div className="social-list">
          {socialLinks.map((link) => <ContactLink key={link.label} {...link} />)}
        </div>
      </div>
      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="form-honeypot" aria-hidden="true">
          <label htmlFor="company">Company website</label>
          <input id="company" name="company" tabIndex={-1} autoComplete="off" />
        </div>
        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" maxLength={100} autoComplete="name" placeholder="Your name" {...field('name')} />
          {errors.name && <span className="form-error" id="name-error">{errors.name}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" maxLength={254} autoComplete="email" placeholder="you@example.com" {...field('email')} />
          {errors.email && <span className="form-error" id="email-error">{errors.email}</span>}
        </div>
        <div className="form-field form-field--full">
          <label htmlFor="subject">Subject</label>
          <input id="subject" name="subject" maxLength={160} placeholder="What are we building?" {...field('subject')} />
          {errors.subject && <span className="form-error" id="subject-error">{errors.subject}</span>}
        </div>
        <div className="form-field form-field--full">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" minLength={10} maxLength={5000} rows={6} placeholder="Tell me a little about your idea..." {...field('message')} />
          {errors.message && <span className="form-error" id="message-error">{errors.message}</span>}
        </div>
        <div className="contact-form__footer">
          <button className="button-link" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending…' : 'Send message'} <span className="button-link__arrow" aria-hidden="true">→</span>
          </button>
          <p key={status} className={`form-status form-status--${statusTone}`} role="status" aria-live="polite">{status}</p>
        </div>
      </form>
    </section>
  )
}
