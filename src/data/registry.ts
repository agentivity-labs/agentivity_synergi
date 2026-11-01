// Template catalogue, read from the Agentivity Marketplace API.
// The pages are static HTML that Next.js renders again at most once a minute (`revalidate`), so a published Template
// appears without a build. When the API is down, the last good pages stay online. Filtering happens in the browser.

import { FIXTURES } from './fixtures'
import type { CatalogueTemplate, CatalogueTemplateDetail, TemplateDetail, TemplateSummary } from './types'

export const MARKETPLACE_API_URL = (process.env.MARKETPLACE_API_URL ?? 'https://marketplace.agentivity.io').replace(/\/+$/, '')
const TEMPLATES_URL = `${MARKETPLACE_API_URL}/api/v1/templates`
const PAGE_SIZE = 100 // the API maximum

// Offline data for development and tests. A production build must never ship it.
const USE_FIXTURES = process.env.MARKETPLACE_FIXTURES === '1'
if (USE_FIXTURES && process.env.VERCEL_ENV === 'production') {
  throw new Error('MARKETPLACE_FIXTURES=1 is set on a production build. Remove it: fixtures are fake Templates.')
}

interface ApiError { error: { code: string; message: string } }
interface ApiList { data: TemplateSummary[]; meta: { total: number; limit: number; offset: number } }
interface ApiOne { data: TemplateDetail }

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  const body = (await response.json().catch(() => null)) as T | ApiError | null
  if (!response.ok || body === null || (typeof body === 'object' && 'error' in body)) {
    const reason = body && typeof body === 'object' && 'error' in body ? `${body.error.code}: ${body.error.message}` : `HTTP ${response.status}`
    throw new Error(`Marketplace API request failed (${reason}): ${url}`)
  }
  return body as T
}

const withLinks = <T extends TemplateSummary>(template: T): T & { fileUrl: string; rootUrl: string } => ({
  ...template,
  fileUrl: `${TEMPLATES_URL}/${encodeURIComponent(template.id)}/file`,
  rootUrl: `${TEMPLATES_URL}/${encodeURIComponent(template.id)}/root`,
})

async function fetchAllTemplates(): Promise<CatalogueTemplate[]> {
  const templates: CatalogueTemplate[] = []
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const page = await getJson<ApiList>(`${TEMPLATES_URL}?limit=${PAGE_SIZE}&offset=${offset}`)
    templates.push(...page.data.map(withLinks))
    if (page.data.length === 0 || offset + PAGE_SIZE >= page.meta.total) break
  }
  return templates
}

/** Every published Template, sorted by name (the API order). */
export function getTemplates(): Promise<CatalogueTemplate[]> {
  return USE_FIXTURES ? Promise.resolve(FIXTURES) : fetchAllTemplates()
}

/** One Template with its content list, or undefined when the id is unknown. */
export async function getTemplate(id: string): Promise<CatalogueTemplateDetail | undefined> {
  if (USE_FIXTURES) return FIXTURES.find((template) => template.id === id)
  const known = (await getTemplates()).some((template) => template.id === id)
  if (!known) return undefined
  const { data } = await getJson<ApiOne>(`${TEMPLATES_URL}/${encodeURIComponent(id)}`)
  return withLinks(data)
}
