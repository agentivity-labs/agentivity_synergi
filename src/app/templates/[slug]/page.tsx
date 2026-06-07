import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getRegistry, getTemplateBySlug } from '@/data/registry'
import DetailCanvas from '@/components/DetailCanvas'

interface Props {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export async function generateStaticParams() {
  const seen = new Set<string>()
  return getRegistry()
    .filter(t => typeof t.slug === 'string' && t.slug.length > 0)
    .filter(t => { if (seen.has(t.slug)) return false; seen.add(t.slug); return true })
    .map(t => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const t = getTemplateBySlug(slug)
  if (!t) return {}
  return {
    title:       t.name,
    description: t.description || `${t.kind} template for ${t.department}`,
  }
}

const KIND_LABEL: Record<string, string> = {
  team:     'Agent Team',
  agent:    'Agent',
  workflow: 'Workflow',
}

export default async function TemplatePage({ params }: Props) {
  const { slug } = await params
  const t = getTemplateBySlug(slug)
  if (!t) notFound()

  return (
    <section className="detail s-black">
      <div className="wrap">
        <Link href="/" className="detail-back">
          ← Back to templates
        </Link>

        <div className="detail-layout">
          {/* Canvas — left / top */}
          <div className="detail-canvas-wrap">
            <DetailCanvas
              dataPath={t.dataPath}
              renderer={t.canvasRenderer}
              kind={t.kind}
            />
          </div>

          {/* Sidebar — right */}
          <div className="detail-sidebar">
            <div>
              <div className="detail-meta">
                <span className="tpl-dept">{t.department}</span>
                <span className="tpl-kind">{KIND_LABEL[t.kind]}</span>
                {t.agentCount ? (
                  <span className="tpl-kind mono">{t.agentCount} agents</span>
                ) : null}
              </div>
              <h1>{t.name}</h1>
              {t.description && (
                <p className="desc">{t.description}</p>
              )}
            </div>

            <div className="detail-cta">
              <a
                className="btn btn-primary lg"
                href={t.dataPath}
                download
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Download template →
              </a>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 20 }}>
              <p className="mono" style={{ fontSize: 11, color: 'rgba(255,255,255,.25)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8 }}>ID</p>
              <p className="mono" style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', wordBreak: 'break-all' }}>{t.id}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
