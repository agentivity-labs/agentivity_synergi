// Addresses and navigation shared by the header and the footer.
// They mirror the main website (agentivity_website) so both sites read as one.

export const SITE_URL = 'https://synergi.agentivity.io'
export const WEBSITE_URL = 'https://www.agentivity.io'
export const GITHUB_URL = 'https://github.com/agentivity-labs/agentivity'
export const START_URL = `${WEBSITE_URL}/start`
export const INSTALL_URL = `${WEBSITE_URL}/community`

export interface NavLink {
  label: string
  href: string
  /** Opens in a new tab: a site outside agentivity.io. */
  external?: boolean
}

/** Same entries, same order as the website header. "Synergi" is this site. */
export const NAV_LINKS: NavLink[] = [
  { label: 'Use Cases', href: `${WEBSITE_URL}/use-cases` },
  { label: 'Synergi', href: '/' },
  { label: 'Services', href: `${WEBSITE_URL}/services` },
  { label: 'Blog', href: `${WEBSITE_URL}/blog` },
  { label: 'Pricing', href: `${WEBSITE_URL}/pricing` },
  { label: 'Docs', href: `${WEBSITE_URL}/docs` },
]

/** The Product menu of the website header. */
export const PRODUCT_MENU = {
  label: 'Product',
  intro: {
    title: 'How it works',
    body: 'The whole picture: describe what you need to the Assistant, or build it by hand in the Studio. No code.',
    link: 'See how it works',
    href: `${WEBSITE_URL}/how-it-works`,
  },
  groups: [
    {
      title: 'Build',
      items: [
        { icon: 'team', label: 'Teams', body: 'AI specialists that work together', href: `${WEBSITE_URL}/teams` },
        { icon: 'agent', label: 'Agents', body: 'One specialist, one role, its own tools', href: `${WEBSITE_URL}/agents` },
        { icon: 'workflow', label: 'Workflows', body: 'Fixed steps, with a person who approves', href: `${WEBSITE_URL}/workflows` },
      ],
    },
    {
      title: 'Make it better',
      items: [
        { icon: 'prompt', label: 'Prompt Studio', body: 'Test and improve what your agents are told', href: `${WEBSITE_URL}/prompt-studio` },
        { icon: 'data', label: 'Knowledge Bases & Data Tables', body: 'Your documents and tables, for your agents', href: `${WEBSITE_URL}/knowledge-and-data` },
      ],
    },
    {
      title: 'Use it',
      items: [
        { icon: 'app', label: 'VibeApps', body: 'Apps your users simply talk to', href: `${WEBSITE_URL}/vibeapps` },
        { icon: 'assistant', label: 'Assistant', body: 'Build by describing what you need', href: `${WEBSITE_URL}/assistant` },
      ],
    },
  ],
  foot: [
    { label: 'Ready-made Solutions on Synergi', href: '/' },
    { label: 'Install the free Community edition', href: INSTALL_URL },
  ],
}

export const FOOTER_COLUMNS: { title: string; links: NavLink[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'How it works', href: `${WEBSITE_URL}/how-it-works` },
      { label: 'Assistant', href: `${WEBSITE_URL}/assistant` },
      { label: 'Teams', href: `${WEBSITE_URL}/teams` },
      { label: 'Agents', href: `${WEBSITE_URL}/agents` },
      { label: 'Workflows', href: `${WEBSITE_URL}/workflows` },
      { label: 'Prompt Studio', href: `${WEBSITE_URL}/prompt-studio` },
      { label: 'Knowledge & Data', href: `${WEBSITE_URL}/knowledge-and-data` },
      { label: 'VibeApps', href: `${WEBSITE_URL}/vibeapps` },
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
      { label: 'Licence', href: `${GITHUB_URL}/blob/main/LICENCE.md`, external: true },
      { label: 'Blog', href: `${WEBSITE_URL}/blog` },
      { label: 'Services', href: `${WEBSITE_URL}/services` },
      { label: 'Climate', href: `${WEBSITE_URL}/climate` },
      { label: 'Contact', href: 'mailto:hello@agentivity.io' },
      { label: 'Privacy Policy', href: `${WEBSITE_URL}/legal/privacy` },
      { label: 'Terms of Use', href: `${WEBSITE_URL}/legal/terms` },
      { label: 'Terms of Sale', href: `${WEBSITE_URL}/legal/terms-of-sale` },
      { label: 'Disclaimer', href: `${WEBSITE_URL}/legal/disclaimer` },
      { label: 'Brand Kit', href: `${WEBSITE_URL}/brand` },
      { label: 'Featured on', href: `${WEBSITE_URL}/featured` },
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
