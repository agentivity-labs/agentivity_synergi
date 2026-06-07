'use client'

import dynamic from 'next/dynamic'
import type { CanvasRenderer as RendererKind, TemplateKind } from '@/data/registry'

const CanvasRenderer = dynamic(() => import('@/lib/canvas/CanvasRenderer'), { ssr: false })

interface Props {
  dataPath: string
  renderer: RendererKind
  kind:     TemplateKind
}

export default function DetailCanvas({ dataPath, renderer, kind }: Props) {
  return (
    <CanvasRenderer
      dataPath={dataPath}
      renderer={renderer}
      kind={kind}
      simulate={true}
    />
  )
}
