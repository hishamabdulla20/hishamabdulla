import 'server-only'

import { isEmail } from './validation'

type ContactEmail = {
  name: string
  email: string
  subject: string
  message: string
}

export function getContactEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.CONTACT_FROM_EMAIL?.trim()
  const to = process.env.CONTACT_TO_EMAIL?.trim()
  const missing = [
    !apiKey && 'RESEND_API_KEY',
    !from && 'CONTACT_FROM_EMAIL',
    !to && 'CONTACT_TO_EMAIL',
  ].filter(Boolean)

  if (missing.length) {
    console.error('[portfolio:contact-config] Missing variables:', missing.join(', '))
    return null
  }

  // Accept one bare mailbox per setting, not display names or address lists.
  if (!from || !to || !isEmail(from) || !isEmail(to) || /[<>,;\r\n]/.test(from + to)) {
    console.error('[portfolio:contact-config] CONTACT_FROM_EMAIL and CONTACT_TO_EMAIL must be single email addresses.')
    return null
  }

  return { apiKey: apiKey!, from, to }
}

export async function sendContactEmail(
  config: NonNullable<ReturnType<typeof getContactEmailConfig>>,
  contact: ContactEmail,
  idempotencyKey: string,
): Promise<boolean> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify({
        from: config.from,
        to: [config.to],
        reply_to: contact.email,
        subject: `Portfolio contact: ${contact.subject}`,
        text: `Name: ${contact.name}\nEmail: ${contact.email}\nSubject: ${contact.subject}\n\nMessage:\n${contact.message}`,
      }),
      signal: AbortSignal.timeout(10_000),
      cache: 'no-store',
    })

    if (!response.ok) {
      // HTTP status diagnoses auth, sender verification, throttling, and outages.
      // Never log the provider body: it can contain submitted content or addresses.
      console.error('[portfolio:contact-email] Resend rejected the request. HTTP status:', response.status)
      return false
    }

    const result: unknown = await response.json()
    if (!result || typeof result !== 'object' || !('id' in result) || typeof result.id !== 'string' || !result.id) {
      console.error('[portfolio:contact-email] Resend returned an invalid acknowledgment.')
      return false
    }

    return true
  } catch {
    console.error('[portfolio:contact-email] Resend request failed, timed out, or returned invalid JSON.')
    return false
  }
}
