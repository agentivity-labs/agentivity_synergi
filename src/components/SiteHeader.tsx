'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import GitHubIcon from '@/components/GitHubIcon'
import { GITHUB_URL, INSTALL_URL, NAV_LINKS, PRODUCT_MENU, START_URL, WEBSITE_URL, type NavLink } from '@/lib/site'

// Line icons of the Product menu, drawn on a 24px grid with the current colour.
const ICONS: Record<string, ReactNode> = {
  team: <><circle cx="12" cy="5" r="2.6" /><circle cx="5" cy="18" r="2.6" /><circle cx="12" cy="18" r="2.6" /><circle cx="19" cy="18" r="2.6" /><path d="M12 7.6v7.8M10.3 7l-4 8.6M13.7 7l4 8.6" /></>,
  agent: <><circle cx="12" cy="8" r="3.6" /><path d="M5 20c.8-3.6 3.6-5.6 7-5.6s6.2 2 7 5.6" /></>,
  workflow: <><rect x="3" y="4" width="6" height="5" rx="1.4" /><rect x="15" y="4" width="6" height="5" rx="1.4" /><rect x="9" y="15" width="6" height="5" rx="1.4" /><path d="M9 6.5h6M6 9v3.5h6V15M18 9v3.5h-6" /></>,
  prompt: <><path d="M4 6h10M4 12h7M4 18h10" /><path d="m16 11 2.2 2.2L22 9.4" /></>,
  data: <><ellipse cx="12" cy="5.5" rx="7" ry="2.6" /><path d="M5 5.5v13c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6v-13M5 12c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6" /></>,
  app: <><rect x="3" y="4" width="18" height="14" rx="2.4" /><path d="M8 21h8M7.5 9.5h9M7.5 13h5" /></>,
  assistant: <path d="M12 3.5 13.8 9l5.7.2-4.5 3.4 1.6 5.4L12 14.8 7.4 18l1.6-5.4L4.5 9.2 10.2 9z" />,
}

function NavItem({ link, onNavigate }: { link: NavLink; onNavigate?: () => void }) {
  // "Synergi" is this site: an in-app link, marked as the current section.
  if (link.href.startsWith('/')) {
    return <Link href={link.href} aria-current="page" onClick={onNavigate}>{link.label}</Link>
  }
  return <a href={link.href} onClick={onNavigate}>{link.label}</a>
}

/** Same header as the main website: wordmark, Product menu, section links, GitHub, start button. */
export default function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [productOpen, setProductOpen] = useState(false)
  const header = useRef<HTMLElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (!open && !productOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      if (productOpen) {
        setProductOpen(false)
        trigger.current?.focus()
      }
    }
    const onClick = (event: MouseEvent) => {
      if (!header.current?.contains(event.target as Node)) setProductOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('click', onClick)
    }
  }, [open, productOpen])

  // The Product menu opens on click, and on hover with a mouse.
  const hover = (entering: boolean) => {
    if (!window.matchMedia('(hover: hover)').matches) return
    clearTimeout(hoverTimer.current)
    if (entering) setProductOpen(true)
    else hoverTimer.current = setTimeout(() => setProductOpen(false), 180)
  }
  const hoverHandlers = { onMouseEnter: () => hover(true), onMouseLeave: () => hover(false) }

  return (
    <header ref={header} className={`sh${open ? ' is-open' : ''}${productOpen ? ' pm-open' : ''}`}>
      <div className="wrap sh-inner">
        <div className="sh-brand">
          <a href={WEBSITE_URL} aria-label="Agentivity website">
            {/* eslint-disable-next-line @next/next/no-img-element -- a small local SVG */}
            <img src="/agentivity-wordmark-navy.svg" alt="Agentivity" width={108} height={30} />
          </a>
          <Link href="/" className="sh-product">Synergi</Link>
        </div>

        <nav className="sh-links" aria-label="Main navigation">
          <button
            ref={trigger}
            className="pm-trigger"
            type="button"
            aria-expanded={productOpen}
            aria-controls="pm-panel"
            onClick={() => setProductOpen((value) => !value)}
            {...hoverHandlers}
          >
            {PRODUCT_MENU.label}
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          {NAV_LINKS.map((link) => <NavItem key={link.label} link={link} />)}
        </nav>

        <div className="sh-actions">
          <a className="sh-github" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            <GitHubIcon size={17} />Star on GitHub
          </a>
          <a className="btn btn--sm btn--navy" href={START_URL}>Start free</a>
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

      <div
        className="pm-panel"
        id="pm-panel"
        onBlur={(event) => { if (!header.current?.contains(event.relatedTarget as Node)) setProductOpen(false) }}
        {...hoverHandlers}
      >
        <div className="wrap">
          <div className="pm-grid">
            <a className="pm-intro" href={PRODUCT_MENU.intro.href}>
              <strong>{PRODUCT_MENU.intro.title}</strong>
              <span>{PRODUCT_MENU.intro.body}</span>
              <span className="pm-intro-link">{PRODUCT_MENU.intro.link} →</span>
            </a>
            {PRODUCT_MENU.groups.map((group) => (
              <div className="pm-col" key={group.title}>
                <p className="pm-col-title">{group.title}</p>
                {group.items.map((item) => (
                  <a className="pm-item" href={item.href} key={item.label}>
                    <span className="pm-ico"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[item.icon]}</svg></span>
                    <span className="pm-txt"><b>{item.label}</b><span>{item.body}</span></span>
                  </a>
                ))}
              </div>
            ))}
          </div>
          <div className="pm-foot">
            {PRODUCT_MENU.foot.map((link) => (
              link.href.startsWith('/')
                ? <Link key={link.label} href={link.href} onClick={() => setProductOpen(false)}>{link.label} →</Link>
                : <a key={link.label} href={link.href}>{link.label} →</a>
            ))}
          </div>
        </div>
      </div>

      <div className="sh-menu" id="sh-menu">
        <nav aria-label="Main navigation">
          <details className="sh-menu-product">
            <summary>{PRODUCT_MENU.label}</summary>
            <div className="sh-menu-group">
              <a href={PRODUCT_MENU.intro.href}>{PRODUCT_MENU.intro.title}</a>
              {PRODUCT_MENU.groups.map((group) => (
                <div key={group.title}>
                  <p>{group.title}</p>
                  {group.items.map((item) => <a href={item.href} key={item.label}>{item.label}</a>)}
                </div>
              ))}
            </div>
          </details>
          {NAV_LINKS.map((link) => <NavItem key={link.label} link={link} onNavigate={() => setOpen(false)} />)}
          <a href={INSTALL_URL}>Install Community</a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">Star on GitHub</a>
        </nav>
        <a className="btn btn--navy sh-menu-cta" href={START_URL}>Start free</a>
      </div>
    </header>
  )
}
