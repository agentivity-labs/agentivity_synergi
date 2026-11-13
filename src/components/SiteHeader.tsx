'use client'

import { useEffect, useRef, useState, type FocusEvent, type ReactNode } from 'react'
import Link from 'next/link'
import GitHubIcon from '@/components/GitHubIcon'
import { GITHUB_URL, INSTALL_URL, NAV_LINKS, PRODUCT_MENU, SOLUTIONS_MENU, START_URL, WEBSITE_URL, type NavLink } from '@/lib/site'

// Line icons of the Product menu, drawn on a 24px grid with the current colour.
const ICONS: Record<string, ReactNode> = {
  team: <><circle cx="12" cy="5" r="2.6" /><circle cx="5" cy="18" r="2.6" /><circle cx="12" cy="18" r="2.6" /><circle cx="19" cy="18" r="2.6" /><path d="M12 7.6v7.8M10.3 7l-4 8.6M13.7 7l4 8.6" /></>,
  agent: <><circle cx="12" cy="8" r="3.6" /><path d="M5 20c.8-3.6 3.6-5.6 7-5.6s6.2 2 7 5.6" /></>,
  workflow: <><rect x="3" y="4" width="6" height="5" rx="1.4" /><rect x="15" y="4" width="6" height="5" rx="1.4" /><rect x="9" y="15" width="6" height="5" rx="1.4" /><path d="M9 6.5h6M6 9v3.5h6V15M18 9v3.5h-6" /></>,
  prompt: <><path d="M4 6h10M4 12h7M4 18h10" /><path d="m16 11 2.2 2.2L22 9.4" /></>,
  data: <><ellipse cx="12" cy="5.5" rx="7" ry="2.6" /><path d="M5 5.5v13c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6v-13M5 12c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6" /></>,
  app: <><rect x="3" y="4" width="18" height="14" rx="2.4" /><path d="M8 21h8M7.5 9.5h9M7.5 13h5" /></>,
  assistant: <path d="M12 3.5 13.8 9l5.7.2-4.5 3.4 1.6 5.4L12 14.8 7.4 18l1.6-5.4L4.5 9.2 10.2 9z" />,
  desk: <><rect x="3" y="4" width="18" height="16" rx="2.4" /><path d="M9 4v16M12.5 9h5M12.5 13h3.5" /></>,
  plug: <path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4" />,
  maker: <path d="M14.5 5.5a4 4 0 0 0-5.3 5.3L3.5 16.5l4 4 5.7-5.7a4 4 0 0 0 5.3-5.3l-2.6 2.6-2.8-.6-.6-2.8z" />,
  agency: <><rect x="3" y="7" width="18" height="13" rx="2.4" /><path d="M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2M3 13h18" /></>,
}

type Menu = 'product' | 'solutions' | null

const Chevron = () => <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
const Icon = ({ name }: { name: string }) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[name]}</svg>

function NavItem({ link, onNavigate }: { link: NavLink; onNavigate?: () => void }) {
  // "Synergi" is this site: an in-app link, marked as the current section.
  if (link.href.startsWith('/')) {
    return <Link href={link.href} aria-current="page" onClick={onNavigate}>{link.label}</Link>
  }
  return <a href={link.href} onClick={onNavigate}>{link.label}</a>
}

/** Same header as the main website: wordmark, Product and Solutions menus, section links, GitHub, start button. */
export default function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState<Menu>(null)
  const header = useRef<HTMLElement>(null)
  const productTrigger = useRef<HTMLButtonElement>(null)
  const solutionsTrigger = useRef<HTMLButtonElement>(null)
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (!open && !menu) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      if (menu) {
        setMenu(null)
        ;(menu === 'product' ? productTrigger : solutionsTrigger).current?.focus()
      }
    }
    const onClick = (event: MouseEvent) => {
      if (!header.current?.contains(event.target as Node)) setMenu(null)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('click', onClick)
    }
  }, [open, menu])

  // A menu opens on click, and on hover with a mouse.
  const hover = (which: Menu, entering: boolean) => {
    if (!window.matchMedia('(hover: hover)').matches) return
    clearTimeout(hoverTimer.current)
    if (entering) setMenu(which)
    else hoverTimer.current = setTimeout(() => setMenu(null), 180)
  }
  const hoverOn = (which: Menu) => ({ onMouseEnter: () => hover(which, true), onMouseLeave: () => hover(which, false) })
  const toggle = (which: Menu) => setMenu((value) => (value === which ? null : which))
  const leave = (event: FocusEvent<HTMLDivElement>) => { if (!header.current?.contains(event.relatedTarget as Node)) setMenu(null) }
  const groups = SOLUTIONS_MENU.groups

  return (
    <header ref={header} className={`sh${open ? ' is-open' : ''}${menu ? ' pm-open' : ''}`}>
      <div className="wrap sh-inner">
        <div className="sh-brand">
          <a href={WEBSITE_URL} aria-label="Agentivity website">
            {/* eslint-disable-next-line @next/next/no-img-element -- a small local SVG */}
            <img src="/agentivity-wordmark-navy.svg" alt="Agentivity" width={108} height={30} />
          </a>
          <Link href="/" className="sh-product">Synergi</Link>
        </div>

        <nav className="sh-links" aria-label="Main navigation">
          <button ref={productTrigger} className="pm-trigger" type="button" aria-expanded={menu === 'product'} aria-controls="pm-panel" onClick={() => toggle('product')} {...hoverOn('product')}>
            {PRODUCT_MENU.label}<Chevron />
          </button>
          <button ref={solutionsTrigger} className="pm-trigger" type="button" aria-expanded={menu === 'solutions'} aria-controls="sm-panel" onClick={() => toggle('solutions')} {...hoverOn('solutions')}>
            {SOLUTIONS_MENU.label}<Chevron />
          </button>
          {NAV_LINKS.map((link) => <NavItem key={link.label} link={link} />)}
        </nav>

        <div className="sh-actions">
          <a className="sh-github" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            <GitHubIcon size={17} />Star on GitHub
          </a>
          <a className="btn btn--sm btn--navy" href={START_URL}>Start your trial</a>
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

      <div className={`pm-panel sm-panel${menu === 'solutions' ? ' is-open' : ''}`} id="sm-panel" onBlur={leave} {...hoverOn('solutions')}>
        <div className="wrap">
          <div className="sm-grid">
            <div className="sm-depts">
              <p className="pm-col-title">{SOLUTIONS_MENU.byDepartment}</p>
              <div className="sm-groups">
                {groups.map((group) => (
                  <div className="sm-group" key={group.title}>
                    <p className="sm-group-title">{group.title}</p>
                    <ul>
                      {group.items.map((item) => (
                        <li key={item.label}>
                          {item.href
                            ? <a className="sm-sol" href={item.href}>{item.label}</a>
                            : <span className="sm-sol sm-sol--soon">{item.label} <span className="sm-soon">{SOLUTIONS_MENU.soon}</span></span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <Link className="sm-all" href={SOLUTIONS_MENU.all.href} onClick={() => setMenu(null)}>{SOLUTIONS_MENU.all.label} →</Link>
            </div>
            <div className="sm-built">
              <p className="sm-built-title">{SOLUTIONS_MENU.builtFor.title}</p>
              {SOLUTIONS_MENU.builtFor.items.map((item) => (
                <a className="sm-built-item" href={item.href} key={item.label}>
                  <span className="sm-built-ico"><Icon name={item.icon} /></span>
                  <span className="pm-txt"><b>{item.label}</b><span>{item.body}</span></span>
                </a>
              ))}
              <p className="sm-company"><b>{SOLUTIONS_MENU.builtFor.company.label}</b><span>{SOLUTIONS_MENU.builtFor.company.body}</span><span className="sm-soon">{SOLUTIONS_MENU.soon}</span></p>
            </div>
          </div>
        </div>
      </div>

      <div className={`pm-panel${menu === 'product' ? ' is-open' : ''}`} id="pm-panel" onBlur={leave} {...hoverOn('product')}>
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
                    <span className="pm-ico"><Icon name={item.icon} /></span>
                    <span className="pm-txt"><b>{item.label}</b><span>{item.body}</span></span>
                  </a>
                ))}
              </div>
            ))}
          </div>
          <div className="pm-foot">
            {PRODUCT_MENU.foot.map((link) => (
              link.href.startsWith('/')
                ? <Link key={link.label} href={link.href} onClick={() => setMenu(null)}>{link.label} →</Link>
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
          <details className="sh-menu-product">
            <summary>{SOLUTIONS_MENU.label}</summary>
            <div className="sh-menu-group">
              {groups.map((group) => (
                <div key={group.title}>
                  <p>{group.title}</p>
                  {group.items.map((item) => item.href
                    ? <a href={item.href} key={item.label}>{item.label}</a>
                    : <span className="sh-menu-soon" key={item.label}>{item.label} <span className="sm-soon">{SOLUTIONS_MENU.soon}</span></span>)}
                </div>
              ))}
              <p>{SOLUTIONS_MENU.builtFor.title}</p>
              {SOLUTIONS_MENU.builtFor.items.map((item) => <a href={item.href} key={item.label}>{item.label}</a>)}
              <Link href={SOLUTIONS_MENU.all.href} onClick={() => setOpen(false)}>{SOLUTIONS_MENU.all.label}</Link>
            </div>
          </details>
          {NAV_LINKS.map((link) => <NavItem key={link.label} link={link} onNavigate={() => setOpen(false)} />)}
          <a href={INSTALL_URL}>Install Community</a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">Star on GitHub</a>
        </nav>
        <a className="btn btn--navy sh-menu-cta" href={START_URL}>Start your trial</a>
      </div>
    </header>
  )
}
