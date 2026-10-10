'use client'

import { useEffect, useRef, useState } from 'react'
import type { TemplateRootSource } from '@/data/types'

interface Props {
  /** `GET /templates/{id}/root`. */
  src?: string | null
  /** The same payload, passed directly (fixtures). Wins over `src`. */
  source?: TemplateRootSource
  /** Describes the drawing for people who cannot see it. */
  label: string
  interactive?: boolean
  autoplay?: boolean
  /** Shrinks the drawing so it fits the height of its frame (card thumbnails). */
  fit?: boolean
  /**
   * For a workflow or an agent: `follow` opens on the start nodes at a readable scale and moves with the run, in a frame
   * that has its own height. `fit` (default) keeps the whole diagram in view. A team is not affected.
   */
  camera?: 'follow' | 'fit'
}

/**
 * The graph of a Template's root, drawn by the `<agentivity-graph>` web component (loaded once in the layout).
 * The component only renders in the browser, so the frame around it reserves the space and avoids a layout jump.
 */
export default function TemplateGraph({ src, source, label, interactive = false, autoplay = false, fit = false, camera = 'fit' }: Props) {
  const frame = useRef<HTMLElement>(null)
  const element = useRef<HTMLElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const graph = element.current
    if (!graph) return
    const onError = () => setFailed(true)
    graph.addEventListener('agentivity-graph-error', onError)
    let cancelled = false
    if (source) {
      void customElements.whenDefined('agentivity-graph').then(() => {
        if (!cancelled) (graph as AgentivityGraphElement).source = source
      })
    }
    return () => {
      cancelled = true
      graph.removeEventListener('agentivity-graph-error', onError)
    }
  }, [source])

  // The component sets its own height from its width. A thumbnail has a fixed frame, so the drawing is scaled into it.
  useEffect(() => {
    const box = frame.current
    const graph = element.current
    if (!fit || !box || !graph) return
    const apply = () => {
      const natural = graph.offsetHeight // layout height: not affected by the transform
      const scale = natural > box.clientHeight && natural > 0 ? box.clientHeight / natural : 1
      graph.style.setProperty('--fit', String(scale))
    }
    const observer = new ResizeObserver(apply)
    observer.observe(box)
    observer.observe(graph)
    return () => observer.disconnect()
  }, [fit])

  const following = camera === 'follow'
  const classes = ['graph-frame', interactive && 'graph-frame--interactive', fit && 'graph-frame--fit', following && 'graph-frame--follow'].filter(Boolean).join(' ')

  return (
    <figure ref={frame} className={classes} aria-label={label}>
      {failed ? (
        <p className="graph-error">The diagram could not be loaded.</p>
      ) : (
        <agentivity-graph
          ref={element}
          theme="light"
          {...(src && !source ? { src } : {})}
          {...(interactive ? { interactive: '' as const } : {})}
          {...(autoplay ? { autoplay: '' as const } : {})}
          {...(following ? { camera: 'follow' as const } : {})}
        />
      )}
    </figure>
  )
}
