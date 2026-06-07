'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import type { TemplateEntry } from '@/data/registry'

const CanvasRenderer = dynamic(() => import('@/lib/canvas/CanvasRenderer'), { ssr: false })

interface Props {
  template: TemplateEntry
}

const KIND_LABEL: Record<string, string> = {
  team:     'Team',
  agent:    'Agent',
  workflow: 'Workflow',
}

export default function TemplateCard({ template }: Props) {
  return (
    <Link href={`/templates/${template.slug}`} className="tpl-card">
      <div className="tpl-canvas-wrap">
        <CanvasRenderer
          dataPath={template.dataPath}
          renderer={template.canvasRenderer}
          kind={template.kind}
          simulate={false}
        />
      </div>

      <div className="tpl-body">
        <div className="tpl-meta">
          <span className="tpl-dept">{template.department}</span>
          <span className="tpl-kind">{KIND_LABEL[template.kind]}</span>
          {template.agentCount ? (
            <span className="tpl-kind mono">{template.agentCount} agents</span>
          ) : null}
        </div>

        <h3>{template.name}</h3>

        {template.description && (
          <p>{template.description.length > 100
            ? template.description.slice(0, 100) + '…'
            : template.description}
          </p>
        )}

        <div className="tpl-foot">
          View template →
        </div>
      </div>
    </Link>
  )
}
