import type { Metadata } from 'next'
import Script from 'next/script'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import { SITE_URL } from '@/lib/site'
import '@/styles/globals.css'

// Same typefaces as the main website: Instrument Serif for headlines, Hanken Grotesk for everything else.
const FONTS = 'https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Synergi — Ready-made AI Solutions for Agentivity', template: '%s | Synergi by Agentivity' },
  description: 'Browse ready-made AI Solutions for Agentivity. Each Template is a complete Solution in one file, with its team or workflow, its agents and its data tables, to import in the Studio.',
  openGraph: { siteName: 'Synergi by Agentivity', type: 'website', locale: 'en_US' },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONTS} />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        {/* The <agentivity-graph> web component. Its icon font must stay in the same folder as the script. */}
        <Script src="/vendor/agentivity-graph/agentivity-graph.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
