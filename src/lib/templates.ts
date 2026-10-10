// Pure helpers for presenting and filtering Templates. No I/O and only type imports,
// so the same file runs in the browser, at build time and under `node --test`.
import type { TemplateContentItem, TemplateCounts, TemplateRequires, TemplateSummary } from '../data/types'

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English', zh: 'Chinese', hi: 'Hindi', es: 'Spanish', fr: 'French',
  ar: 'Arabic', pt: 'Portuguese', ru: 'Russian', de: 'German', ja: 'Japanese',
}

export function languageName(code: string): string {
  return LANGUAGE_NAMES[code] ?? code.toUpperCase()
}

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`

/** "1 team · 13 agents · 2 data tables". Kinds with a count of zero are left out. */
export function describeCounts(counts: TemplateCounts): string {
  const parts: string[] = []
  if (counts.teams > 0) parts.push(plural(counts.teams, 'team', 'teams'))
  if (counts.workflows > 0) parts.push(plural(counts.workflows, 'workflow', 'workflows'))
  if (counts.agents > 0) parts.push(plural(counts.agents, 'agent', 'agents'))
  if (counts.dataTables > 0) parts.push(plural(counts.dataTables, 'data table', 'data tables'))
  return parts.join(' · ')
}

/** Cuts at a word boundary and adds an ellipsis, so a card never ends in the middle of a word. */
export function truncate(text: string, max: number): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s.,;:—–-]+$/, '') + '…'
}

/** The line under the name on a card: the tagline, or the start of the description. */
export function cardSummary(template: Pick<TemplateSummary, 'tagline' | 'description'>, max = 120): string {
  return template.tagline?.trim() || truncate(template.description, max)
}

const KIND_LABELS: Record<string, string> = {
  team: 'Team', workflow: 'Workflow', agent: 'Agent', datatable: 'Data table',
}

export function kindLabel(kind: string): string {
  return KIND_LABELS[kind.toLowerCase()] ?? kind
}

const CREDENTIAL_LABELS: Record<string, string> = {
  llm: 'A connection to an AI model',
  search: 'A web search service',
  email: 'An email account to send from',
}

/** What the user must have, in plain words. An empty list means nothing is required. */
export function describeRequirements(requires: TemplateRequires): string[] {
  const credentials = requires.credentials.map((family) => CREDENTIAL_LABELS[family] ?? `A “${family}” connection`)
  const plugins = requires.plugins.map((id) => `The “${id}” plugin`)
  return [...credentials, ...plugins]
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
}

export interface TagCount { tag: string; count: number }

/** Every tag in use, most used first, then alphabetical. */
export function collectTags(templates: Pick<TemplateSummary, 'tags'>[]): TagCount[] {
  const counts = new Map<string, number>()
  for (const template of templates) {
    for (const tag of template.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}

export function collectLanguages(templates: Pick<TemplateSummary, 'language'>[]): string[] {
  return [...new Set(templates.map((template) => template.language))].sort((a, b) => languageName(a).localeCompare(languageName(b)))
}

export interface CatalogueFilter {
  query: string
  /** All of them must be on the Template. */
  tags: string[]
  /** Empty means any language. */
  language: string
}

const words = (text: string) => text.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean)

/**
 * Same rules as the marketplace API, applied in the browser on the build-time list:
 * every search term must start a word of the name, tagline, description or tags; every tag must match.
 */
export function filterTemplates<T extends TemplateSummary>(templates: T[], filter: CatalogueFilter): T[] {
  const terms = words(filter.query)
  return templates.filter((template) => {
    if (filter.language && template.language !== filter.language) return false
    if (!filter.tags.every((tag) => template.tags.includes(tag))) return false
    if (terms.length === 0) return true
    const haystack = words([template.name, template.tagline ?? '', template.description, template.tags.join(' ')].join(' '))
    return terms.every((term) => haystack.some((word) => word.startsWith(term)))
  })
}

/** Splits a plain-text description into paragraphs. */
export function paragraphs(text: string): string[] {
  return text.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean)
}

/** Depth 0 is the root: the indentation of a content row starts after it. */
export function contentIndent(item: Pick<TemplateContentItem, 'depth'>): number {
  return Math.max(0, Math.min(item.depth, 4))
}
