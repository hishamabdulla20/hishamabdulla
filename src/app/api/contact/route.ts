import { createHmac } from 'node:crypto'
import { NextResponse, type NextRequest } from 'next/server'
import { getContactEmailConfig, sendContactEmail } from '@/lib/contact-email'
import { createAdminSupabaseClient } from '@/lib/supabase/admin'
import { isEmail, required } from '@/lib/validation'

const maximumBodyBytes = 64 * 1024
const unavailableMessage = 'Unable to send your message right now. Please try again later.'

export const runtime = 'nodejs'

type ContactPayload = {
  name?: unknown
  email?: unknown
  subject?: unknown
  message?: unknown
  company?: unknown
  startedAt?: unknown
}

function clean(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function errorResponse(
  message: string,
  status: number,
  fieldErrors?: Record<string, string>,
) {
  return NextResponse.json(
    { message, fieldErrors },
    { status, headers: { 'Cache-Control': 'no-store' } },
  )
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (origin && origin !== request.nextUrl.origin) {
    return errorResponse('Invalid request origin.', 403)
  }
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    return errorResponse('Please submit the contact form as JSON.', 415)
  }
  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > maximumBodyBytes) return errorResponse('Your message is too large.', 413)

  let payload: ContactPayload
  try {
    // Enforce the limit even for chunked requests without Content-Length.
    const reader = request.body?.getReader()
    if (!reader) return errorResponse('Please check the form and try again.', 400)
    const chunks: Uint8Array[] = []
    let size = 0
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        size += value.byteLength
        if (size > maximumBodyBytes) {
          await reader.cancel()
          return errorResponse('Your message is too large.', 413)
        }
        chunks.push(value)
      }
    } finally {
      reader.releaseLock()
    }
    const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return errorResponse('Please check the form and try again.', 400)
    }
    payload = parsed as ContactPayload
  } catch {
    return errorResponse('Please check the form and try again.', 400)
  }

  const name = clean(payload.name)
  const email = clean(payload.email).toLowerCase()
  const subject = clean(payload.subject)
  const message = clean(payload.message)
  const honeypot = clean(payload.company)
  const startedAt = typeof payload.startedAt === 'number' ? payload.startedAt : 0
  const fieldErrors: Record<string, string> = {}

  if (!required(name, 100) || /[\r\n]/.test(name)) fieldErrors.name = 'Please enter a name of at most 100 characters on one line.'
  if (!isEmail(email) || /[<>,;]/.test(email)) fieldErrors.email = 'Please enter a valid email address.'
  if (!required(subject, 160) || /[\r\n]/.test(subject)) fieldErrors.subject = 'Please enter a subject of at most 160 characters on one line.'
  if (message.length < 10 || message.length > 5_000) {
    fieldErrors.message = 'Please enter a message between 10 and 5,000 characters.'
  }

  if (Object.keys(fieldErrors).length > 0) {
    return errorResponse('Please review the highlighted fields.', 400, fieldErrors)
  }

  // Quietly accept bot submissions so the endpoint does not teach bots how detection works.
  if (honeypot) {
    return NextResponse.json({ message: 'Thanks — your message has been sent.' }, { headers: { 'Cache-Control': 'no-store' } })
  }

  // A real visitor must not get a false success just because they used autofill
  // or left the page open for more than two hours.
  if (!Number.isFinite(startedAt) || startedAt <= 0 || startedAt > Date.now()) {
    return errorResponse('Please reload the page and try again.', 400)
  }
  if (Date.now() - startedAt < 2_000) {
    return errorResponse('Please wait a moment before sending your message.', 429)
  }

  const missing = [
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() && 'NEXT_PUBLIC_SUPABASE_URL',
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() && 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    !process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() && 'SUPABASE_SERVICE_ROLE_KEY',
    !process.env.CONTACT_RATE_LIMIT_SECRET?.trim() && 'CONTACT_RATE_LIMIT_SECRET',
  ].filter(Boolean)
  const emailConfig = getContactEmailConfig()
  const rateLimitSecret = process.env.CONTACT_RATE_LIMIT_SECRET
  if (missing.length) console.error('[portfolio:contact-config] Missing variables:', missing.join(', '))
  if (missing.length || !emailConfig || !rateLimitSecret) {
    return errorResponse(unavailableMessage, 503)
  }

  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const ip = forwardedFor || request.headers.get('x-real-ip') || 'unknown'
  const ipHash = createHmac('sha256', rateLimitSecret).update(ip).digest('hex')
  const windowStart = new Date(Date.now() - 15 * 60 * 1_000).toISOString()

  let stage = 'database-init'
  try {
    const admin = createAdminSupabaseClient()
    if (!admin) return errorResponse(unavailableMessage, 503)
    stage = 'rate-limit'
    const { count, error: countError } = await admin
      .from('contact_messages')
      .select('id', { count: 'exact', head: true })
      .eq('ip_hash', ipHash)
      .gte('created_at', windowStart)

    if (countError) throw countError
    if ((count ?? 0) >= 3) {
      return errorResponse('Too many messages were sent. Please try again later.', 429)
    }

    stage = 'database-insert'
    const userAgent = request.headers.get('user-agent')?.slice(0, 500) ?? null
    const { error: insertError } = await admin.from('contact_messages').insert({
      name,
      email,
      subject,
      message,
      ip_hash: ipHash,
      user_agent: userAgent,
    })
    if (insertError) throw insertError

    // Keep the admin inbox as a durable copy if the email provider is unavailable.
    // Stable across retries of the same form submission; no personal data in the key.
    const idempotencyKey = createHmac('sha256', rateLimitSecret)
      .update(JSON.stringify([name, email, subject, message, startedAt]))
      .digest('hex')
    const sent = await sendContactEmail(emailConfig, { name, email, subject, message }, idempotencyKey)
    if (!sent) {
      console.error('[portfolio:contact-submit] Message saved to admin inbox; email delivery not confirmed.')
      return errorResponse(unavailableMessage, 502)
    }

    return NextResponse.json(
      { message: 'Thanks — your message has been sent.' },
      { status: 201, headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    const code = error && typeof error === 'object' && 'code' in error &&
      typeof error.code === 'string' && /^[A-Z0-9]{5,10}$/.test(error.code) ? error.code : 'unknown'
    console.error('[portfolio:contact-submit]', { stage, code })
    return errorResponse(unavailableMessage, 500)
  }
}
