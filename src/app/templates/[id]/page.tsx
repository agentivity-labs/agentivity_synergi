import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getTemplate, getTemplates } from '@/data/registry'
import TemplateCover from '@/components/TemplateCover'
import TemplateGraph from '@/components/TemplateGraph'
import { SITE_URL, WEBSITE_URL } from '@/lib/site'
import { contentIndent, describeCounts, describeRequirements, formatBytes, formatDate, kindLabel, languageName, paragraphs, truncate } from '@/lib/templates'

interface Props {
  params: Promise<{ id: string }>
}

// A static export: only the Templates known at build time have a page.
export const dynamicParams = false

export async function generateStaticParams() {
  const templates = await getTemplates()
  return templates.map((template) => ({ id: template.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const template = await getTemplate(id)
  if (!template) return {}
  const description = truncate(template.tagline ? `${template.tagline} ${template.description}` : template.description, 160)
  // The Open Graph picture is the cover itself, served by the marketplace. Fixture covers are inline pictures: not shareable.
  const image = template.cover && template.cover.imageUrl.startsWith('http') ? [{ url: template.cover.imageUrl, alt: template.cover.alt ?? template.name }] : undefined
  return {
    title: `${template.name} — ${kindLabel(template.root.kind)} template`,
    description,
    keywords: template.tags,
    alternates: { canonical: `/templates/${template.id}` },
    openGraph: { type: 'article', title: template.name, description, url: `/templates/${template.id}`, images: image },
    twitter: { card: image ? 'summary_large_image' : 'summary', title: template.name, description, images: image?.map((entry) => entry.url) },
  }
}

const ROOT_HEADING: Record<string, string> = {
  team: 'The team at a glance',
  workflow: 'The workflow at a glance',
  agent: 'The agent at a glance',
}

export default async function TemplatePage({ params }: Props) {
  const { id } = await params
  const template = await getTemplate(id)
  if (!template) notFound()

  const requirements = describeRequirements(template.requires)
  const { author } = template
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: template.name,
    description: template.description,
    url: `${SITE_URL}/templates/${template.id}`,
    inLanguage: template.language,
    version: template.version,
    keywords: template.tags.join(', '),
    dateModified: template.updatedAt,
    author: { '@type': 'Organization', name: author.name, ...(author.url ? { url: author.url } : {}) },
    ...(template.cover && template.cover.imageUrl.startsWith('http') ? { image: template.cover.imageUrl } : {}),
    ...(template.license ? { license: template.license } : {}),
  }

  return (
    <article className="wrap detail">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />

      <Link href="/" className="back-link">All templates</Link>

      <header className="detail-head">
        <p className="detail-kicker">
          <span className="pill pill--navy">{kindLabel(template.root.kind)}</span>
          <span>{describeCounts(template.counts)}</span>
        </p>
        <h1>{template.name}</h1>
        {/* Without a tagline the description speaks for itself, further down. */}
        {template.tagline && <p className="detail-lead">{template.tagline}</p>}
      </header>

      <div className="detail-layout">
        <div className="detail-main">
          <TemplateCover template={template} priority />

          <section aria-labelledby="graph-title">
            <h2 className="h3" id="graph-title">{ROOT_HEADING[template.root.kind] ?? 'At a glance'}</h2>
            <p className="hint">Drag to move, scroll or pinch to zoom.</p>
            <TemplateGraph
              src={template.rootUrl}
              source={template.rootSource}
              label={`Interactive diagram of ${template.name}`}
              interactive
              autoplay
            />
          </section>

          <section aria-labelledby="about-title">
            <h2 className="h3" id="about-title">What it does</h2>
            <div className="prose">
              {paragraphs(template.description).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
            {template.tags.length > 0 && (
              <ul className="tags tags--links" aria-label="Tags">
                {template.tags.map((tag) => (
                  <li key={tag}><Link className="tag" href={`/?tag=${encodeURIComponent(tag)}#catalogue`}>{tag}</Link></li>
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby="contents-title">
            <details className="contents" open>
              <summary>
                <h2 className="h3" id="contents-title">What is inside</h2>
                <span className="contents-count">{template.contents.length} {template.contents.length === 1 ? 'item' : 'items'}</span>
              </summary>
              <ul className="contents-list">
                {template.contents.map((item) => (
                  <li key={item.id} style={{ paddingLeft: `${contentIndent(item) * 22}px` }}>
                    <span className="pill">{kindLabel(item.kind)}</span>
                    <span className="contents-text">
                      <strong>{item.name}</strong>
                      {item.role && <span>{item.role}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </details>
          </section>
        </div>

        <aside className="detail-side" aria-label="Download and details">
          <div className="side-card side-card--navy">
            {template.fileUrl ? (
              <a className="btn btn--yellow btn--block" href={template.fileUrl} download={`${template.id}.template.json`}>
                Download
              </a>
            ) : (
              <p className="side-note">Offline fixtures: there is no file to download.</p>
            )}
            <p className="side-how"><strong>How to use it.</strong> In the Studio: Templates &gt; Import from file. Everything in the Template is created as your own copy.</p>
            <p className="side-meta">One file · {formatBytes(template.sizeBytes)}</p>
          </div>

          <div className="side-card">
            <h2 className="side-title">What you need</h2>
            {requirements.length === 0 ? (
              <p>Nothing besides the Agentivity Studio.</p>
            ) : (
              <ul className="side-list">
                <li>The Agentivity Studio</li>
                {requirements.map((requirement) => <li key={requirement}>{requirement}</li>)}
              </ul>
            )}
            <a className="text-link" href={`${WEBSITE_URL}/community`}>No Studio yet? Install it</a>
          </div>

          <div className="side-card">
            <h2 className="side-title">Details</h2>
            <dl className="facts">
              <div><dt>Version</dt><dd>{template.version}</dd></div>
              <div><dt>Language</dt><dd>{languageName(template.language)}</dd></div>
              {template.license && <div><dt>Licence</dt><dd>{template.license}</dd></div>}
              {formatDate(template.updatedAt) && <div><dt>Updated</dt><dd>{formatDate(template.updatedAt)}</dd></div>}
            </dl>
          </div>

          <div className="side-card">
            <h2 className="side-title">Author</h2>
            <div className="author">
              {author.avatarUrl && (
                // eslint-disable-next-line @next/next/no-img-element -- served by the marketplace
                <img className="author-avatar" src={author.avatarUrl} alt="" width={48} height={48} loading="lazy" />
              )}
              <div>
                {author.url ? (
                  <a className="author-name text-link" href={author.url} target="_blank" rel="noopener noreferrer">{author.name}</a>
                ) : (
                  <p className="author-name">{author.name}</p>
                )}
                {author.bio && <p className="author-bio">{author.bio}</p>}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </article>
  )
}
