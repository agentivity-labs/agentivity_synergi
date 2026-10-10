// JSX typing for `<agentivity-graph>`, the standalone web component of the Agentivity SDK
// (public/vendor/agentivity-graph/agentivity-graph.js). It only renders in the browser.
import type { DetailedHTMLProps, HTMLAttributes } from 'react'

interface AgentivityGraphAttributes extends HTMLAttributes<HTMLElement> {
  /** A URL answering JSON, with or without the marketplace `{ data }` envelope. */
  src?: string
  /** Plays a demonstration run. Ignored when the visitor prefers reduced motion. */
  autoplay?: ''
  /** Zoom and pan. Absent: a still picture that lets the page scroll. */
  interactive?: ''
  'step-ms'?: number
  theme?: 'light' | 'dark'
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'agentivity-graph': DetailedHTMLProps<AgentivityGraphAttributes, HTMLElement>
    }
  }
}

declare global {
  interface AgentivityGraphElement extends HTMLElement {
    /** The JSON to draw. Wins over `src`. */
    source: unknown
  }
}
