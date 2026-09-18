import type { ReactNode } from 'react'
import { parseMarkdown } from '@/lib/writing'

const inlinePattern = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*|\[[^\]]+\]\((?:https:\/\/|\/)[^)]+\))/g

function renderInline(text: string): ReactNode[] {
  return text.split(inlinePattern).filter(Boolean).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index}>{part.slice(1, -1)}</em>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index}>{part.slice(1, -1)}</code>
    }

    const link = part.match(/^\[([^\]]+)\]\(((?:https:\/\/|\/)[^)]+)\)$/)
    if (link) {
      const external = link[2].startsWith('https://')
      return (
        <a key={index} href={link[2]} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {link[1]}
        </a>
      )
    }
    return part
  })
}

function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function MarkdownContent({ source }: { source: string }) {
  const blocks = parseMarkdown(source)

  return (
    <div className="writing-prose">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'heading': {
            const id = headingId(block.text)
            return block.level === 2
              ? <h2 id={id} key={index}>{renderInline(block.text)}</h2>
              : <h3 id={id} key={index}>{renderInline(block.text)}</h3>
          }
          case 'paragraph':
            return <p key={index}>{renderInline(block.text)}</p>
          case 'quote':
            return <blockquote key={index}><p>{renderInline(block.text)}</p></blockquote>
          case 'list': {
            const List = block.ordered ? 'ol' : 'ul'
            return <List key={index}>{block.items.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item)}</li>)}</List>
          }
          case 'image':
            return (
              <figure key={index}>
                <img src={block.src} alt={block.alt} loading="lazy" />
                {block.caption && <figcaption>{block.caption}</figcaption>}
              </figure>
            )
          case 'code':
            return <pre key={index}><code data-language={block.language}>{block.value}</code></pre>
          case 'divider':
            return <hr key={index} />
        }
      })}
    </div>
  )
}
