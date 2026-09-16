import { createHmac } from 'node:crypto'
import { NextResponse, type NextRequest } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase/admin'
import { isEmail, required, safeError } from '@/lib/validation'

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
  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > 12_000) return errorResponse('Unable to send message. Please try again.', 413)

  let payload: ContactPayload
  try {
    payload = await request.json() as ContactPayload
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

  if (!required(name, 100)) fieldErrors.name = 'Please enter your name.'
  if (!isEmail(email)) fieldErrors.email = 'Please enter a valid email address.'
  if (!required(subject, 160)) fieldErrors.subject = 'Please add a subject.'
  if (message.length < 10 || message.length > 5_000) {
    fieldErrors.message = 'Please enter a message between 10 and 5,000 characters.'
  }

  if (Object.keys(fieldErrors).length > 0) {
    return errorResponse('Please review the highlighted fields.', 400, fieldErrors)
  }

  // Quietly accept bot submissions so the endpoint does not teach bots how detection works.
  const elapsed = Date.now() - startedAt
  if (honeypot || elapsed < 2_000 || elapsed > 7_200_000) {
    return NextResponse.json({ message: 'Thanks — your message has been sent.' })
  }

  const admin = createAdminSupabaseClient()
  const rateLimitSecret = process.env.CONTACT_RATE_LIMIT_SECRET
  if (!admin || !rateLimitSecret) {
    return errorResponse('Contact is temporarily unavailable. Please try again later.', 503)
  }

  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const ip = forwardedFor || request.headers.get('x-real-ip') || 'unknown'
  const ipHash = createHmac('sha256', rateLimitSecret).update(ip).digest('hex')
  const windowStart = new Date(Date.now() - 15 * 60 * 1_000).toISOString()

  try {
    const { count, error: countError } = await admin
      .from('contact_messages')
      .select('id', { count: 'exact', head: true })
      .eq('ip_hash', ipHash)
      .gte('created_at', windowStart)

    if (countError) throw countError
    if ((count ?? 0) >= 3) {
      return errorResponse('Too many messages were sent. Please try again later.', 429)
    }

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

    return NextResponse.json(
      { message: 'Thanks — your message has been sent.' },
      { status: 201, headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    safeError('contact-submit', error)
    return errorResponse('Unable to send message. Please try again.', 500)
  }
}
