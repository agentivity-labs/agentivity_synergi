'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav${scrolled ? ' scrolled' : ''}`}>
      <div className="wrap nav-inner">
        <Link href="/" className="brand">
          <span className="brand-synergi">Synergi</span>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          <Link href="/">Templates</Link>
          <a href="https://agentivity.io" target="_blank" rel="noopener noreferrer">Agentivity</a>
        </nav>

        <div className="nav-cta">
          <a className="btn btn-primary" href="https://agentivity.io" target="_blank" rel="noopener noreferrer">
            Get started free
          </a>
        </div>
      </div>
    </header>
  )
}
