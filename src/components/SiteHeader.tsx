'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import GitHubIcon from '@/components/GitHubIcon'
import { GITHUB_URL, NAV_LINKS, WAITLIST_URL, WEBSITE_URL, type NavLink } from '@/lib/site'

function NavItem({ link, onNavigate }: { link: NavLink; onNavigate?: () => void }) {
  // "Synergi" is this site: an in-app link, marked as the current section.
  if (link.href.startsWith('/')) {
    return <Link href={link.href} aria-current="page" onClick={onNavigate}>{link.label}</Link>
  }
  return <a href={link.href} onClick={onNavigate}>{link.label}</a>
}

/** Same header as the main website: wordmark, section links, GitHub, waitlist. */
export default function SiteHeader() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className={`sh${open ? ' is-open' : ''}`}>
      <div className="wrap sh-inner">
        <div className="sh-brand">
          <a href={WEBSITE_URL} aria-label="Agentivity website">
            {/* eslint-disable-next-line @next/next/no-img-element -- a small local SVG */}
            <img src="/agentivity-wordmark-navy.svg" alt="Agentivity" width={108} height={30} />
          </a>
          <Link href="/" className="sh-product">Synergi</Link>
        </div>

        <nav className="sh-links" aria-label="Main navigation">
          {NAV_LINKS.map((link) => <NavItem key={link.label} link={link} />)}
        </nav>

        <div className="sh-actions">
          <a className="sh-github" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            <GitHubIcon size={17} />Star on GitHub
          </a>
          <a className="btn btn--sm btn--navy" href={WAITLIST_URL}>Join the waitlist</a>
          <button
            className="sh-burger"
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="sh-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div className="sh-menu" id="sh-menu">
        <nav aria-label="Main navigation">
          {NAV_LINKS.map((link) => <NavItem key={link.label} link={link} onNavigate={() => setOpen(false)} />)}
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">Star on GitHub</a>
        </nav>
        <a className="btn btn--navy sh-menu-cta" href={WAITLIST_URL}>Join the waitlist</a>
      </div>
    </header>
  )
}
