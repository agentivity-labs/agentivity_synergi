import { getRegistry, getDepartments } from '@/data/registry'
import CatalogueGrid from '@/components/CatalogueGrid'

export default function HomePage() {
  const templates    = getRegistry()
  const departments  = getDepartments()

  const teamCount     = templates.filter(t => t.kind === 'team').length
  const agentCount    = templates.filter(t => t.kind === 'agent').length
  const workflowCount = templates.filter(t => t.kind === 'workflow').length

  return (
    <>
      {/* Hero */}
      <section className="hero s-black">
        <div className="hero-blob" aria-hidden="true" />
        <div className="wrap hero-inner">
          <p className="eyebrow" style={{ color: 'var(--mint)' }}>Synergi by Agentivity</p>
          <h1 className="h1">
            Pre-built AI teams<br />
            <span className="grad-text">ready to deploy.</span>
          </h1>
          <p className="sub">
            Browse battle-tested agent teams, individual agents and workflows.
            Pick one, customise it, and run it in minutes.
          </p>
          <div className="hero-cta">
            <a className="btn btn-primary lg" href="https://agentivity.com" target="_blank" rel="noopener noreferrer">
              Start for free
            </a>
            <a className="btn btn-ghost lg" href="https://github.com/agentivity-labs/agentivity" target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="n">{templates.length}</div>
              <div className="l">Total templates</div>
            </div>
            <div className="hero-stat">
              <div className="n">{teamCount}</div>
              <div className="l">Agent teams</div>
            </div>
            <div className="hero-stat">
              <div className="n">{agentCount}</div>
              <div className="l">Agents</div>
            </div>
            <div className="hero-stat">
              <div className="n">{workflowCount}</div>
              <div className="l">Workflows</div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalogue */}
      <section className="catalogue s-black">
        <div className="wrap">
          <div className="catalogue-head">
            <p className="eyebrow" style={{ color: 'rgba(255,255,255,.4)' }}>Browse</p>
            <h2 className="h2" style={{ color: '#fff', marginTop: 12 }}>All templates</h2>
          </div>

          <CatalogueGrid templates={templates} departments={departments} />
        </div>
      </section>
    </>
  )
}
