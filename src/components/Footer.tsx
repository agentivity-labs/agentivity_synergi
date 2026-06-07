import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="foot-inner">
          <div className="foot-brand">
            <Link href="/" className="brand">
              <span className="brand-synergi" style={{ fontSize: 22 }}>Synergi</span>
            </Link>
            <p className="lead">Browse and deploy pre-built AI agent teams &amp; workflows.</p>
            <p style={{ marginTop: 10, fontSize: 13, color: 'rgba(255,255,255,.3)' }}>
              Powered by <a href="https://agentivity.io" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,.5)', textDecoration: 'underline' }}>Agentivity</a>
            </p>
          </div>

          <div className="foot-col">
            <h4>Explore</h4>
            <Link href="/">All Templates</Link>
            <Link href="/?dept=Marketing">Marketing</Link>
            <Link href="/?dept=Finance">Finance</Link>
            <Link href="/?dept=Legal">Legal</Link>
          </div>

          <div className="foot-col">
            <h4>Resources</h4>
            <a href="https://agentivity.io" target="_blank" rel="noopener noreferrer">Agentivity</a>
            <a href="https://github.com/agentivity-labs/agentivity" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://agentivity.io/docs" target="_blank" rel="noopener noreferrer">Docs</a>
          </div>
        </div>

        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} Synergi. All rights reserved.</span>
          <span className="mono">Powered by Agentivity</span>
        </div>
      </div>
    </footer>
  )
}
