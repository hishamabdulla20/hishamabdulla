import { useState } from 'react'
import type { FormEvent } from 'react'
import { socialLinks } from '../../data/portfolio'
import { ExternalOrPlaceholder } from '../ui/ExternalOrPlaceholder'

type FormErrors = Partial<Record<'name' | 'email' | 'subject' | 'message', string>>

export function Contact() {
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const nextErrors: FormErrors = {}
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const subject = String(data.get('subject') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()

    if (!name) nextErrors.name = 'Please enter your name.'
    if (!email) nextErrors.email = 'Please enter your email.'
    else if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = 'Please enter a valid email address.'
    if (!subject) nextErrors.subject = 'Please add a subject.'
    if (!message) nextErrors.message = 'Please write a message.'

    setErrors(nextErrors)
    setStatus(
      Object.keys(nextErrors).length
        ? 'Please review the highlighted fields.'
        : 'Your message is ready, but the contact service has not been connected yet.',
    )
  }

  const field = (name: keyof FormErrors) => ({
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  })

  return (
    <section className="contact-section grid-field" id="contact" aria-labelledby="contact-title">
      <div className="contact-heading">
        <p className="section-header__eyebrow technical-label"><span>08</span> — Contact</p>
        <p className="contact-kicker">Have an idea?</p>
        <h2 id="contact-title">Let’s build<br />something<br /><em>together.</em></h2>
        <div className="social-list">
          {socialLinks.map((link) => <ExternalOrPlaceholder key={link.label} label={link.label} url={link.url} />)}
        </div>
      </div>
      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" autoComplete="name" placeholder="Your name" {...field('name')} />
          {errors.name && <span className="form-error" id="name-error">{errors.name}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" {...field('email')} />
          {errors.email && <span className="form-error" id="email-error">{errors.email}</span>}
        </div>
        <div className="form-field form-field--full">
          <label htmlFor="subject">Subject</label>
          <input id="subject" name="subject" placeholder="What are we building?" {...field('subject')} />
          {errors.subject && <span className="form-error" id="subject-error">{errors.subject}</span>}
        </div>
        <div className="form-field form-field--full">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows={6} placeholder="Tell me a little about your idea..." {...field('message')} />
          {errors.message && <span className="form-error" id="message-error">{errors.message}</span>}
        </div>
        <div className="contact-form__footer">
          <button className="button-link" type="submit">Send message <span aria-hidden="true">→</span></button>
          <p className="form-status" role="status" aria-live="polite">{status}</p>
        </div>
      </form>
    </section>
  )
}
