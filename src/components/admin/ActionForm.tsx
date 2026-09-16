'use client'

import { useActionState, type ReactNode } from 'react'
import { useFormStatus } from 'react-dom'
import type { ActionResult } from '@/types/portfolio'

type Action = (state: ActionResult, formData: FormData) => Promise<ActionResult>

const initialState: ActionResult = { status: 'idle', message: '' }

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return <button className="admin-button" type="submit" disabled={pending}>{pending ? 'Saving…' : label}</button>
}

export function ActionForm({
  action,
  submitLabel,
  children,
  className = '',
}: {
  action: Action
  submitLabel: string
  children: ReactNode
  className?: string
}) {
  const [state, formAction] = useActionState(action, initialState)

  return (
    <form action={formAction} className={`admin-form ${className}`}>
      {children}
      <div className="admin-form__footer">
        <SubmitButton label={submitLabel} />
        {state.message && (
          <p className={`admin-notice admin-notice--${state.status}`} role="status">{state.message}</p>
        )}
      </div>
    </form>
  )
}
