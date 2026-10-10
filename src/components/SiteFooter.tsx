import Link from 'next/link'
import { FOOTER_COLUMNS, WEBSITE_URL, type NavLink } from '@/lib/site'

function FooterLink({ link }: { link: NavLink }) {
  if (link.href.startsWith('/')) return <Link href={link.href}>{link.label}</Link>
  if (link.external) return <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
  return <a href={link.href}>{link.label}</a>
}

/** Same footer as the main website. */
export default function SiteFooter() {
  return (
    <footer className="sf">
      <div className="wrap">
        <div className="sf-grid">
          <div className="sf-brand">
            <a href={WEBSITE_URL} aria-label="Agentivity website">
              {/* eslint-disable-next-line @next/next/no-img-element -- a small local SVG */}
              <img src="/agentivity-wordmark-navy.svg" alt="Agentivity" width={94} height={26} loading="lazy" />
            </a>
            <p>Build your AI team. Free to start, yours to extend.</p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div className="sf-col" key={column.title}>
              <h2>{column.title}</h2>
              {column.links.map((link) => <FooterLink key={link.label} link={link} />)}
            </div>
          ))}
        </div>

        <div className="sf-bottom">© {new Date().getFullYear()} Agentivity · Synergi, the Template library of agentivity.io</div>
      </div>
    </footer>
  )
}
