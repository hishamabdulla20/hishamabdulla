'use client'

import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { SocialLink } from '../../types/portfolio'
import { ExternalOrPlaceholder } from '../ui/ExternalOrPlaceholder'

type FormErrors = Partial<Record<'name' | 'email' | 'subject' | 'message', string>>

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
        setStatus(result.message ?? 'Unable to send message. Please try again.')
        return
      }

      form.reset()
      startedAt.current = Date.now()
      setStatusTone('success')
      setStatus('Thanks — your message has been sent.')
    } catch {
      setStatusTone('error')
      setStatus('Unable to send message. Please try again.')
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
        <p className="section-header__eyebrow technical-label"><span>08</span> — Contact</p>
        <p className="contact-kicker">Have an idea?</p>
        <h2 id="contact-title">Let’s build<br />something<br /><em>together.</em></h2>
        <div className="social-list">
          {socialLinks.map((link) => <ExternalOrPlaceholder key={link.label} label={link.label} url={link.url} />)}
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
