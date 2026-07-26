'use client'

import { useEffect, useRef } from 'react'
import type { CanvasRenderer as RendererKind, TemplateKind } from '@/data/registry'

interface Props {
  dataPath:   string
  renderer:   RendererKind
  kind:       TemplateKind
  simulate?:  boolean
  className?: string
}

export default function CanvasRenderer({ dataPath, renderer, kind, simulate = false, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let destroyed  = false
    let instance: any = null  // renderer instance (for fitViewport on resize)

    function syncSize() {
      const dpr = window.devicePixelRatio || 1
      const w = canvas!.offsetWidth
      const h = canvas!.offsetHeight
      if (w === 0 || h === 0) return false
      canvas!.width  = Math.round(w * dpr)
      canvas!.height = Math.round(h * dpr)
      return true
    }

    async function init() {
      // Wait until the canvas has layout dimensions
      await new Promise<void>(resolve => {
        if (canvas!.offsetWidth > 0) { resolve(); return }
        const ro = new ResizeObserver(() => { if (canvas!.offsetWidth > 0) { ro.disconnect(); resolve() } })
        ro.observe(canvas!)
      })
      if (destroyed) return

      const data = await fetch(dataPath).then(r => r.json())
      if (destroyed) return

      syncSize() // set buffer right before renderer reads canvas.width/height

      if (renderer === 'team') {
        const { AgentivityTeamCanvas, DARK_THEME } = await import('./agentivity-canvas-team.js')
        if (destroyed) return
        instance = new AgentivityTeamCanvas(canvas, { theme: DARK_THEME, showLogo: false })
        instance.loadData(data)
        instance.simulate = simulate
      } else {
        // @ts-expect-error - plain IIFE script, no module exports
        await import('./agentivity-canvas-workflow.js')
        const Wc = (window as any).AgentivityWorkflowCanvas
        if (!Wc || destroyed) return

        // Both agent and workflow files use the generic entity wrapper
        // ({ kind, name, entryJson }) — agents nest their graph under entry.graph,
        // workflows ARE the graph (entry.nodes/connections directly).
        let workflowData = data
        if (data.entryJson) {
          const entry = typeof data.entryJson === 'string' ? JSON.parse(data.entryJson) : data.entryJson
          workflowData = entry.graph ?? entry
        }

        instance = new Wc(canvas, workflowData, { darkMode: true, showLogo: false })
        instance.fitToScreen?.()
        instance.simulate = simulate
      }

      // Re-sync size + refit on container resize
      const ro = new ResizeObserver(() => {
        if (destroyed) return
        syncSize()
        instance?.fitViewport?.()
        instance?.fitToScreen?.()
        instance?.render?.()
      })
      ro.observe(canvas!)
    }

    init().catch(console.error)
    return () => { destroyed = true }
  }, [dataPath, renderer, kind, simulate])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  )
}
