import type { MetadataRoute } from 'next'
import { getTemplates } from '@/data/registry'
import { SITE_URL } from '@/lib/site'

// /sitemap.xml: the catalogue and one entry per published Template. Rendered again at most once a minute, like the pages,
// so a Template published on the marketplace is listed without a build.
export const revalidate = 60

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const templates = await getTemplates()
  const latest = templates.reduce((max, template) => (template.updatedAt > max ? template.updatedAt : max), '')
  return [
    { url: `${SITE_URL}/`, lastModified: latest || undefined, changeFrequency: 'daily', priority: 1 },
    ...templates.map((template) => ({
      url: `${SITE_URL}/templates/${template.id}`,
      lastModified: template.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}
