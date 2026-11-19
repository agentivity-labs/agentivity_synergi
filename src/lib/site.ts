// Addresses and navigation shared by the header and the footer.
// They mirror the main website (agentivity_website) so both sites read as one.

export const SITE_URL = 'https://synergi.agentivity.io'
export const WEBSITE_URL = 'https://www.agentivity.io'
export const GITHUB_URL = 'https://github.com/agentivity-labs/agentivity'
export const START_URL = `${WEBSITE_URL}/start`
export const INSTALL_URL = `${WEBSITE_URL}/community`
// The terms of the trial, under its main button, as on the website (its plans.json holds the length).
export const TRIAL_NOTE = '14-day trial · no card · AI usage billed by your provider'

export interface NavLink {
  label: string
  href: string
  /** Opens in a new tab: a site outside agentivity.io. */
  external?: boolean
}

/** Same entries, same order as the website header. "Synergi" is this site. */
export const NAV_LINKS: NavLink[] = [
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
        { icon: 'plug', label: 'Connections', body: 'The apps and AI models it works with', href: `${WEBSITE_URL}/connections` },
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
        { icon: 'desk', label: 'Desk', body: 'Where your whole team uses your AI teams', href: `${WEBSITE_URL}/desk` },
      ],
    },
  ],
  foot: [
    { label: 'Ready-made Solutions on Synergi', href: '/' },
    { label: 'Install the free Community edition', href: INSTALL_URL },
  ],
}

/** The Solutions menu of the website header: the solutions by department (a group shows once one of its solutions is live;
 * a solution without a page says "Soon"), and who they are built for. */
export const SOLUTIONS_MENU = {
  label: 'Solutions',
  byDepartment: 'By department',
  soon: 'Soon',
  groups: [
    { title: 'Sales', items: [
      { label: 'Lead Researcher' },
      { label: 'Quote Desk', href: `${WEBSITE_URL}/solutions/quote-desk` },
      { label: 'Product Compare Team', href: `${WEBSITE_URL}/solutions/product-compare-team` },
      { label: 'Account Manager' },
    ] },
    { title: 'Support', items: [
      { label: 'Service Desk', href: `${WEBSITE_URL}/solutions/service-desk` },
      { label: 'Complaint Handler' },
      { label: 'Order Support Agent' },
      { label: 'Subscription Care' },
    ] },
    { title: 'Finance', items: [
      { label: 'Invoice Clerk', href: `${WEBSITE_URL}/solutions/invoice-clerk` },
      { label: 'Cash Flow Analyst' },
      { label: 'Monthly Report' },
      { label: 'Contract Checker', href: `${WEBSITE_URL}/solutions/contract-checker` },
    ] },
    { title: 'People (HR)', items: [
      { label: 'CV Screener', href: `${WEBSITE_URL}/solutions/cv-screener` },
      { label: 'Onboarding Coordinator' },
      { label: 'Recruiter' },
      { label: 'Training Coordinator' },
    ] },
    { title: 'Marketing', items: [
      { label: 'Image Creator', href: `${WEBSITE_URL}/solutions/image-creator` },
      { label: 'Blog Writer Team' },
      { label: 'Social Media Manager' },
      { label: 'Email Marketer' },
    ] },
    { title: 'Personal & fun', items: [
      { label: 'Trip Planner', href: `${WEBSITE_URL}/solutions/trip-planner` },
      { label: 'Training Coach', href: `${WEBSITE_URL}/solutions/training-coach` },
      { label: 'Meal Planner' },
      { label: 'Game Master Team' },
    ] },
    { title: 'Creators', items: [
      { label: 'Video Script Team' },
      { label: 'Podcast Notes' },
      { label: 'Newsletter Writer' },
      { label: 'Thumbnail Creator' },
    ] },
  ] as { title: string; items: { label: string; href?: string }[] }[],
  all: { label: 'View all on Synergi', href: '/' },
  builtFor: {
    title: 'Built for',
    items: [
      { icon: 'maker', label: 'Your own projects', body: 'Automate your own work and side projects', href: `${WEBSITE_URL}/solutions/your-own-projects` },
      { icon: 'agency', label: 'Freelancers & agencies', body: 'Deliver automations and AI to your clients', href: `${WEBSITE_URL}/solutions/freelancers-and-agencies` },
      { icon: 'desk', label: 'Companies', body: 'Your best way of doing the work, used by everyone', href: `${WEBSITE_URL}/desk` },
    ],
    company: { label: 'The whole AI company', body: 'Northmoor: departments run by AI teams' },
  },
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
      { label: 'Solutions', href: `${WEBSITE_URL}/solutions` },
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
