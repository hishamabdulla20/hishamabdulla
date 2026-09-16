'use client'

import { useState, type FormEvent } from 'react'

export function UploadForm() {
  const [status, setStatus] = useState('')
  const [url, setUrl] = useState('')
  const [pending, setPending] = useState(false)

  const upload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    setPending(true)
    setStatus('Uploading…')
    setUrl('')
    try {
      const response = await fetch('/api/admin/upload', { method: 'POST', body: new FormData(form) })
      const result = await response.json() as { message?: string; url?: string }
      if (!response.ok || !result.url) {
        setStatus(result.message ?? 'Unable to upload the file.')
        return
      }
      setUrl(result.url)
      setStatus('Upload complete. Copy this URL into the relevant content field.')
      form.reset()
    } catch {
      setStatus('Unable to upload the file. Please try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <form className="admin-form admin-upload" onSubmit={upload}>
      <label>Asset file<input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/avif,application/pdf" required /></label>
      <button className="admin-button" type="submit" disabled={pending}>{pending ? 'Uploading…' : 'Upload asset'}</button>
      {status && <p className="admin-notice" role="status">{status}</p>}
      {url && <output className="admin-upload__url">{url}</output>}
    </form>
  )
}
