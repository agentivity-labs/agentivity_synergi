// Addresses and navigation shared by the header and the footer.
// They mirror the main website (agentivity_website) so both sites read as one.

export const SITE_URL = 'https://synergi.agentivity.io'
export const WEBSITE_URL = 'https://www.agentivity.io'
export const GITHUB_URL = 'https://github.com/agentivity-labs/agentivity'
export const WAITLIST_URL = `${WEBSITE_URL}/#cta`

export interface NavLink {
  label: string
  href: string
  /** Opens in a new tab: a site outside agentivity.io. */
  external?: boolean
}

/** Same entries, same order as the website header. "Synergi" is this site. */
export const NAV_LINKS: NavLink[] = [
  { label: 'How it works', href: `${WEBSITE_URL}/how-it-works` },
  { label: 'Use Cases', href: `${WEBSITE_URL}/use-cases` },
  { label: 'Synergi', href: '/' },
  { label: 'Services', href: `${WEBSITE_URL}/services` },
  { label: 'Blog', href: `${WEBSITE_URL}/blog` },
  { label: 'Pricing', href: `${WEBSITE_URL}/pricing` },
  { label: 'Docs', href: `${WEBSITE_URL}/docs` },
]

export const FOOTER_COLUMNS: { title: string; links: NavLink[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'How it works', href: `${WEBSITE_URL}/how-it-works` },
      { label: 'Use Cases', href: `${WEBSITE_URL}/use-cases` },
      { label: 'Services', href: `${WEBSITE_URL}/services` },
      { label: 'Pricing', href: `${WEBSITE_URL}/pricing` },
      { label: 'Docs', href: `${WEBSITE_URL}/docs` },
      { label: 'Synergi', href: '/' },
      { label: 'Labs', href: 'https://labs.agentivity.io', external: true },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'GitHub', href: GITHUB_URL, external: true },
      { label: 'Licence', href: `${WEBSITE_URL}/pricing#licence` },
      { label: 'Blog', href: `${WEBSITE_URL}/blog` },
      { label: 'Contact', href: 'mailto:hello@agentivity.io' },
      { label: 'Privacy Policy', href: `${WEBSITE_URL}/legal/privacy` },
      { label: 'Terms of Use', href: `${WEBSITE_URL}/legal/terms` },
      { label: 'Disclaimer', href: `${WEBSITE_URL}/legal/disclaimer` },
      { label: 'Brand Kit', href: `${WEBSITE_URL}/brand` },
    ],
  },
  {
    title: 'Compare',
    links: [
      { label: 'vs n8n', href: `${WEBSITE_URL}/compare/agentivity-vs-n8n` },
      { label: 'vs Dify', href: `${WEBSITE_URL}/compare/agentivity-vs-dify` },
      { label: 'vs Make', href: `${WEBSITE_URL}/compare/agentivity-vs-make` },
    ],
  },
]
