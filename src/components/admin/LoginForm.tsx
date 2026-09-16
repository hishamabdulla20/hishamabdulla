'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { loginAction } from '@/app/admin/actions'
import type { ActionResult } from '@/types/portfolio'

const initialState: ActionResult = { status: 'idle', message: '' }

function LoginButton() {
  const { pending } = useFormStatus()
  return <button className="admin-button" type="submit" disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}</button>
}

export function LoginForm() {
  const [state, action] = useActionState(loginAction, initialState)

  return (
    <form action={action} className="admin-form admin-login__form">
      <label>Email<input name="email" type="email" autoComplete="username" required /></label>
      <label>Password<input name="password" type="password" autoComplete="current-password" minLength={8} required /></label>
      <LoginButton />
      {state.message && <p className="admin-notice admin-notice--error" role="alert">{state.message}</p>}
    </form>
  )
}
