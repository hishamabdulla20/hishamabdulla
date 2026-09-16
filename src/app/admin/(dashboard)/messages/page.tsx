import { createAdminSupabaseClient } from '@/lib/supabase/admin'
import { deleteMessageAction, updateMessageStatusAction } from '../../actions'

export default async function AdminMessagesPage() {
  const admin = createAdminSupabaseClient()
  const { data: messages = [] } = admin
    ? await admin.from('contact_messages').select('id,name,email,subject,message,status,created_at').order('created_at', { ascending: false }).limit(100)
    : { data: [] }

  return (
    <>
      <header className="admin-page-header"><p className="admin-eyebrow">Inbox</p><h1>Messages</h1><p>The 100 most recent contact submissions. This page is protected and is never exposed publicly.</p></header>
      <section aria-label="Contact messages">
        {messages?.length ? messages.map((message) => (
          <article className="admin-message" key={message.id}>
            <header className="admin-message__header">
              <div><h2>{message.subject}</h2><p className="admin-message__meta">From {message.name} · <a href={`mailto:${message.email}`}>{message.email}</a></p></div>
              <p className="admin-message__meta">{new Date(message.created_at).toLocaleString('en', { dateStyle: 'medium', timeStyle: 'short' })} · {message.status}</p>
            </header>
            <p className="admin-message__body">{message.message}</p>
            <div className="admin-message__actions">
              <form action={updateMessageStatusAction}>
                <input type="hidden" name="id" value={message.id} />
                <select name="status" defaultValue={message.status} aria-label="Message status">
                  <option value="new">New</option><option value="read">Read</option><option value="archived">Archived</option>
                </select>
                <button className="admin-button" type="submit">Update</button>
              </form>
              <form action={deleteMessageAction}>
                <input type="hidden" name="id" value={message.id} />
                <button className="admin-danger" type="submit">Delete</button>
              </form>
            </div>
          </article>
        )) : <p className="admin-empty">No contact messages yet.</p>}
      </section>
    </>
  )
}
