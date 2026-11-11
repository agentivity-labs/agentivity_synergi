import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

// /robots.txt: every page may be read, and the sitemap says where the Templates are.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
