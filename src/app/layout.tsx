import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title:       { default: 'Synergi — AI Team & Workflow Templates', template: '%s | Synergi' },
  description: 'Browse and deploy pre-built AI agent teams and workflows. Built on Agentivity.',
  openGraph: {
    siteName: 'Synergi by Agentivity',
    type:     'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
        />
      </head>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
