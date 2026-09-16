import { ActionForm } from '@/components/admin/ActionForm'
import { createAdminSupabaseClient } from '@/lib/supabase/admin'
import { deleteArticleAction, saveArticleAction } from '../../actions'

type ArticleRow = {
  id?: string
  title?: string
  slug?: string
  category?: string
  description?: string
  content?: string
  tags?: string[]
  cover_image_url?: string | null
  published?: boolean
  published_at?: string | null
  sort_order?: number
}

function ArticleForm({ article = {} }: { article?: ArticleRow }) {
  return (
    <ActionForm action={saveArticleAction} submitLabel={article.id ? 'Update article' : 'Create article'}>
      {article.id && <input type="hidden" name="id" value={article.id} />}
      <label>Title<input name="title" defaultValue={article.title ?? ''} maxLength={180} required /></label>
      <label>Slug<input name="slug" defaultValue={article.slug ?? ''} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" maxLength={160} required /></label>
      <label>Category<input name="category" defaultValue={article.category ?? ''} maxLength={100} required /></label>
      <label>Tags (comma separated)<input name="tags" defaultValue={article.tags?.join(', ') ?? ''} /></label>
      <label className="admin-field--full">Description<textarea name="description" defaultValue={article.description ?? ''} maxLength={600} required /></label>
      <label className="admin-field--full">Article content<textarea name="content" defaultValue={article.content ?? ''} maxLength={100000} /></label>
      <label>Cover image URL<input name="coverImageUrl" type="url" defaultValue={article.cover_image_url ?? ''} /></label>
      <label>Publish date<input name="publishedAt" type="date" defaultValue={article.published_at?.slice(0, 10) ?? ''} /></label>
      <label>Sort order<input name="sortOrder" type="number" min="0" defaultValue={article.sort_order ?? 0} /></label>
      <label className="admin-check"><input name="published" type="checkbox" defaultChecked={article.published ?? false} /> Published</label>
    </ActionForm>
  )
}

export default async function AdminArticlesPage() {
  const admin = createAdminSupabaseClient()
  const { data: articles = [] } = admin
    ? await admin.from('articles').select('*').order('sort_order')
    : { data: [] }

  return (
    <>
      <header className="admin-page-header"><p className="admin-eyebrow">Content</p><h1>Articles</h1><p>Manage article metadata and long-form content. Drafts never appear publicly.</p></header>
      <section className="admin-card" aria-labelledby="new-article"><h2 id="new-article">New article</h2><ArticleForm /></section>
      <section className="admin-section" aria-labelledby="existing-articles">
        <h2 id="existing-articles">Existing articles</h2>
        {articles?.length ? articles.map((article) => (
          <details className="admin-card" key={article.id}>
            <summary>{article.title}<span>{article.published ? 'Published' : 'Draft'}</span></summary>
            <ArticleForm article={article} />
            <form className="admin-delete-form" action={deleteArticleAction}>
              <input type="hidden" name="id" value={article.id} />
              <button className="admin-danger" type="submit">Delete article</button>
            </form>
          </details>
        )) : <p className="admin-empty">No articles yet.</p>}
      </section>
    </>
  )
}
