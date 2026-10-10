import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="wrap hero">
      <p className="eyebrow">Page not found</p>
      <h1>This page <em className="mark">got lost.</em></h1>
      <p className="hero-sub">It does not exist, or the Template was removed.</p>
      <div className="actions">
        <Link className="btn btn--navy" href="/">Browse the templates</Link>
      </div>
    </section>
  )
}
