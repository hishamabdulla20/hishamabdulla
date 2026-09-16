'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/browser'

type AuthStep = 'choose' | 'email-otp' | 'phone-otp'
type StatusTone = 'neutral' | 'success' | 'error'

const commonCountryCodes = [
  { code: '+91', label: 'IN +91' },
  { code: '+1', label: 'US +1' },
  { code: '+44', label: 'UK +44' },
  { code: '+971', label: 'AE +971' },
  { code: '+966', label: 'SA +966' },
  { code: '+61', label: 'AU +61' },
  { code: '+49', label: 'DE +49' },
  { code: '+33', label: 'FR +33' },
  { code: '+81', label: 'JP +81' },
  { code: '+86', label: 'CN +86' },
  { code: '+82', label: 'KR +82' },
  { code: '+65', label: 'SG +65' },
  { code: '+60', label: 'MY +60' },
  { code: '+974', label: 'QA +974' },
  { code: '+968', label: 'OM +968' },
  { code: '+973', label: 'BH +973' },
  { code: '+965', label: 'KW +965' },
  { code: '+234', label: 'NG +234' },
  { code: '+27', label: 'ZA +27' },
  { code: '+55', label: 'BR +55' },
  { code: '+52', label: 'MX +52' },
  { code: '+7', label: 'RU +7' },
  { code: '+62', label: 'ID +62' },
  { code: '+66', label: 'TH +66' },
  { code: '+84', label: 'VN +84' },
  { code: '+63', label: 'PH +63' },
  { code: '+92', label: 'PK +92' },
  { code: '+880', label: 'BD +880' },
  { code: '+94', label: 'LK +94' },
  { code: '+977', label: 'NP +977' },
]

export function SignInForm() {
  const [step, setStep] = useState<AuthStep>('choose')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+91')
  const [otp, setOtp] = useState('')
  const [status, setStatus] = useState('')
  const [statusTone, setStatusTone] = useState<StatusTone>('neutral')
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const otpRef = useRef<HTMLInputElement>(null)

  // Focus the appropriate input when switching steps.
  useEffect(() => {
    if (step === 'email-otp' && !otpSent) emailRef.current?.focus()
    if (step === 'phone-otp' && !otpSent) phoneRef.current?.focus()
    if (otpSent) otpRef.current?.focus()
  }, [step, otpSent])

  const resetStatus = () => {
    setStatus('')
    setStatusTone('neutral')
  }

  const goBack = () => {
    setStep('choose')
    setOtpSent(false)
    setOtp('')
    resetStatus()
  }

  const handleGoogleSignIn = useCallback(async () => {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      setStatusTone('error')
      setStatus('Authentication is not configured.')
      return
    }
    setLoading(true)
    resetStatus()

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${siteUrl}/auth/callback`,
      },
    })

    if (error) {
      setStatusTone('error')
      setStatus(error.message || 'Unable to start Google sign-in.')
      setLoading(false)
    }
    // On success, the browser will redirect to Google.
  }, [])

  const handleSendEmailOtp = async (event: FormEvent) => {
    event.preventDefault()
    const trimmed = email.trim().toLowerCase()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatusTone('error')
      setStatus('Please enter a valid email address.')
      return
    }

    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      setStatusTone('error')
      setStatus('Authentication is not configured.')
      return
    }

    setLoading(true)
    resetStatus()

    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        shouldCreateUser: true,
      },
    })

    setLoading(false)
    if (error) {
      setStatusTone('error')
      setStatus(error.message || 'Unable to send the code. Please try again.')
    } else {
      setOtpSent(true)
      setStatusTone('success')
      setStatus('Check your email for the sign-in code.')
    }
  }

  const handleVerifyEmailOtp = async (event: FormEvent) => {
    event.preventDefault()
    const trimmedOtp = otp.trim()
    if (!trimmedOtp || trimmedOtp.length < 6) {
      setStatusTone('error')
      setStatus('Please enter the 6-digit code from your email.')
      return
    }

    const supabase = getSupabaseBrowserClient()
    if (!supabase) return

    setLoading(true)
    resetStatus()

    const { error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: trimmedOtp,
      type: 'email',
    })

    setLoading(false)
    if (error) {
      setStatusTone('error')
      setStatus(error.message || 'Invalid code. Please try again.')
    } else {
      setStatusTone('success')
      setStatus('Signed in successfully. Redirecting…')
      window.location.href = '/'
    }
  }

  const handleSendPhoneOtp = async (event: FormEvent) => {
    event.preventDefault()
    const digits = phone.replace(/\D/g, '')
    if (!digits || digits.length < 6 || digits.length > 15) {
      setStatusTone('error')
      setStatus('Please enter a valid phone number.')
      return
    }

    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      setStatusTone('error')
      setStatus('Authentication is not configured.')
      return
    }

    const fullPhone = `${countryCode}${digits}`
    setLoading(true)
    resetStatus()

    const { error } = await supabase.auth.signInWithOtp({
      phone: fullPhone,
      options: {
        shouldCreateUser: true,
      },
    })

    setLoading(false)
    if (error) {
      setStatusTone('error')
      setStatus(error.message || 'Unable to send the code. Please try again.')
    } else {
      setOtpSent(true)
      setStatusTone('success')
      setStatus('Check your phone for the verification code.')
    }
  }

  const handleVerifyPhoneOtp = async (event: FormEvent) => {
    event.preventDefault()
    const trimmedOtp = otp.trim()
    if (!trimmedOtp || trimmedOtp.length < 6) {
      setStatusTone('error')
      setStatus('Please enter the 6-digit code from your SMS.')
      return
    }

    const supabase = getSupabaseBrowserClient()
    if (!supabase) return

    const digits = phone.replace(/\D/g, '')
    const fullPhone = `${countryCode}${digits}`

    setLoading(true)
    resetStatus()

    const { error } = await supabase.auth.verifyOtp({
      phone: fullPhone,
      token: trimmedOtp,
      type: 'sms',
    })

    setLoading(false)
    if (error) {
      setStatusTone('error')
      setStatus(error.message || 'Invalid code. Please try again.')
    } else {
      setStatusTone('success')
      setStatus('Signed in successfully. Redirecting…')
      window.location.href = '/'
    }
  }

  return (
    <div className="signin-card">
      {step !== 'choose' && (
        <button className="signin-back" type="button" onClick={goBack}>
          ← Back
        </button>
      )}

      {step === 'choose' && (
        <>
          <button
            className="signin-google"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="signin-google__icon">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <div className="signin-divider">
            <span>or</span>
          </div>

          <button
            className="signin-method"
            type="button"
            onClick={() => { setStep('email-otp'); resetStatus() }}
          >
            Sign in with email
            <span className="signin-method__arrow" aria-hidden="true">→</span>
          </button>

          <button
            className="signin-method"
            type="button"
            onClick={() => { setStep('phone-otp'); resetStatus() }}
          >
            Sign in with phone
            <span className="signin-method__arrow" aria-hidden="true">→</span>
          </button>
        </>
      )}

      {step === 'email-otp' && !otpSent && (
        <form onSubmit={handleSendEmailOtp} noValidate>
          <div className="signin-field">
            <label htmlFor="signin-email">Email address</label>
            <input
              ref={emailRef}
              id="signin-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={254}
              required
            />
          </div>
          <button className="button-link signin-submit" type="submit" disabled={loading}>
            {loading ? 'Sending…' : 'Send code'}
            <span className="button-link__arrow" aria-hidden="true">→</span>
          </button>
        </form>
      )}

      {step === 'email-otp' && otpSent && (
        <form onSubmit={handleVerifyEmailOtp} noValidate>
          <p className="signin-info">
            Enter the 6-digit code sent to <strong>{email.trim().toLowerCase()}</strong>
          </p>
          <div className="signin-field">
            <label htmlFor="signin-email-otp">Verification code</label>
            <input
              ref={otpRef}
              id="signin-email-otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              className="signin-otp-input"
              required
            />
          </div>
          <button className="button-link signin-submit" type="submit" disabled={loading}>
            {loading ? 'Verifying…' : 'Verify'}
            <span className="button-link__arrow" aria-hidden="true">→</span>
          </button>
          <button
            className="signin-resend"
            type="button"
            onClick={handleSendEmailOtp as () => void}
            disabled={loading}
          >
            Resend code
          </button>
        </form>
      )}

      {step === 'phone-otp' && !otpSent && (
        <form onSubmit={handleSendPhoneOtp} noValidate>
          <div className="signin-field">
            <label htmlFor="signin-phone">Phone number</label>
            <div className="signin-phone-row">
              <select
                id="signin-country"
                className="signin-country-select"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                aria-label="Country code"
              >
                {commonCountryCodes.map((cc) => (
                  <option key={cc.code} value={cc.code}>
                    {cc.label}
                  </option>
                ))}
              </select>
              <input
                ref={phoneRef}
                id="signin-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^\d\s-]/g, ''))}
                maxLength={15}
                required
              />
            </div>
          </div>
          <button className="button-link signin-submit" type="submit" disabled={loading}>
            {loading ? 'Sending…' : 'Send code'}
            <span className="button-link__arrow" aria-hidden="true">→</span>
          </button>
        </form>
      )}

      {step === 'phone-otp' && otpSent && (
        <form onSubmit={handleVerifyPhoneOtp} noValidate>
          <p className="signin-info">
            Enter the 6-digit code sent to <strong>{countryCode}{phone.replace(/\D/g, '')}</strong>
          </p>
          <div className="signin-field">
            <label htmlFor="signin-phone-otp">Verification code</label>
            <input
              ref={otpRef}
              id="signin-phone-otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              className="signin-otp-input"
              required
            />
          </div>
          <button className="button-link signin-submit" type="submit" disabled={loading}>
            {loading ? 'Verifying…' : 'Verify'}
            <span className="button-link__arrow" aria-hidden="true">→</span>
          </button>
          <button
            className="signin-resend"
            type="button"
            onClick={handleSendPhoneOtp as () => void}
            disabled={loading}
          >
            Resend code
          </button>
        </form>
      )}

      {status && (
        <p className={`form-status form-status--${statusTone}`} role="status" aria-live="polite">
          {status}
        </p>
      )}
    </div>
  )
}

