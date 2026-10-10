// Shapes served by the Agentivity Marketplace API (`/api/v1/templates`).
// Reference: template-format.md, sections 2 and 10. No field is added here that the reference does not define.

export type RootKind = 'team' | 'workflow' | 'agent'

export interface TemplateAuthor {
  id: string | null
  name: string
  url: string | null
  avatarUrl: string | null
  bio: string | null
}

export interface TemplateCover {
  /** Hosted by the marketplace. Displayed straight from this URL, `?v=` included (cache). */
  imageUrl: string
  alt: string | null
}

export interface TemplateCounts {
  agents: number
  teams: number
  workflows: number
  dataTables: number
}

export interface TemplateRequires {
  credentials: string[]
  plugins: string[]
}

export interface TemplateSummary {
  id: string
  version: string
  name: string
  tagline: string | null
  description: string
  tags: string[]
  language: string
  author: TemplateAuthor
  license: string | null
  cover: TemplateCover | null
  root: { kind: RootKind; id: string; name: string }
  counts: TemplateCounts
  requires: TemplateRequires
  sizeBytes: number
  createdAt: string
  updatedAt: string
}

export interface TemplateContentItem {
  kind: string
  id: string
  name: string
  role: string | null
  /** 0 is the root. */
  depth: number
}

export interface TemplateDetail extends TemplateSummary {
  contents: TemplateContentItem[]
}

/** What `<agentivity-graph>` draws: the output of `GET /templates/{id}/root`. */
export interface TemplateRootSource {
  kind: RootKind
  name: string
  entryJson: string
  members: Record<string, { kind: string; name: string; role: string | null; tags: string[] }>
}

/** A Template as the pages use it: the API data plus the two public URLs a browser needs. */
export interface TemplateLinks {
  /** `GET /templates/{id}/file`: the download. Null with fixtures, which have no file. */
  fileUrl: string | null
  /** `GET /templates/{id}/root`: the graph input. Null with fixtures, which carry `rootSource` instead. */
  rootUrl: string | null
  /** Only set by fixtures. */
  rootSource?: TemplateRootSource
}

export type CatalogueTemplate = TemplateSummary & TemplateLinks
export type CatalogueTemplateDetail = TemplateDetail & TemplateLinks
