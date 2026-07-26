// Template catalog — sourced from the Agentivity Marketplace API, not local
// files. Fetched at build time (this site is a static export — `output:
// 'export'` in next.config.ts — so there is no per-request server to hit the
// API live; the catalog is snapshotted whenever the site is rebuilt/redeployed).

const MARKETPLACE_API_URL = process.env.MARKETPLACE_API_URL ?? 'https://marketplace.agentivity.io'
const PAGE_SIZE = 100

export type TemplateKind = 'agent' | 'team' | 'workflow'
export type CanvasRenderer = 'team' | 'workflow'

export interface TemplateEntry {
  id: string
  slug: string
  name: string
  description: string
  department: string
  kind: TemplateKind
  canvasRenderer: CanvasRenderer
  dataPath: string
  agentCount?: number
}

interface MarketplaceTemplateSummary {
  slug: string
  name: string
  description: string
  department: string
  kind: TemplateKind
  canvas_renderer: CanvasRenderer
  agent_count: number | null
}

interface MarketplaceListResponse {
  data: MarketplaceTemplateSummary[]
  meta: { total: number; limit: number; offset: number }
}

function toTemplateEntry(row: MarketplaceTemplateSummary): TemplateEntry {
  return {
    // The marketplace's own id (slug) — same value used as both id and slug
    // throughout this site, mirroring how the source entity files work (a
    // team wrapper's only id lives at entryJson.id, there's no separate one).
    id: row.slug,
    slug: row.slug,
    name: row.name,
    description: row.description,
    department: row.department,
    kind: row.kind,
    canvasRenderer: row.canvas_renderer,
    // .../raw returns `content` unwrapped — the exact { kind, name, entryJson }
    // wrapper, fetchable client-side by the canvas renderer and downloadable
    // as-is, same shape this site always worked with.
    dataPath: `${MARKETPLACE_API_URL}/api/v1/templates/${encodeURIComponent(row.slug)}/raw`,
    agentCount: row.agent_count ?? undefined,
  }
}

async function fetchAllTemplates(): Promise<TemplateEntry[]> {
  const entries: TemplateEntry[] = []
  let offset = 0

  while (true) {
    const url = `${MARKETPLACE_API_URL}/api/v1/templates?limit=${PAGE_SIZE}&offset=${offset}`
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`Marketplace API request failed (${res.status}): ${url}`)
    }
    const body = (await res.json()) as MarketplaceListResponse
    entries.push(...body.data.map(toTemplateEntry))

    offset += PAGE_SIZE
    if (offset >= body.meta.total) break
  }

  return entries
}

let _cache: Promise<TemplateEntry[]> | null = null
export function getRegistry(): Promise<TemplateEntry[]> {
  if (!_cache) _cache = fetchAllTemplates()
  return _cache
}

export async function getTemplateBySlug(slug: string): Promise<TemplateEntry | undefined> {
  const registry = await getRegistry()
  return registry.find(t => t.slug === slug)
}

export async function getDepartments(): Promise<string[]> {
  const registry = await getRegistry()
  const deps = new Set(registry.map(t => t.department))
  return ['All', ...Array.from(deps).sort()]
}
