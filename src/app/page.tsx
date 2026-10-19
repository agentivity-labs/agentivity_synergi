import { getTemplates } from '@/data/registry'
import Catalogue from '@/components/Catalogue'
import { WEBSITE_URL } from '@/lib/site'

const STEPS = [
  { title: 'Pick a Template', body: 'Each one is a complete Solution: a team, a workflow or an agent, with everything it needs.' },
  { title: 'Download the file', body: 'One file carries everything. No account is needed to download it.' },
  { title: 'Import it in the Studio', body: 'In the Agentivity Studio, open Templates, then Import from file. Then make it yours.' },
]

export default async function HomePage() {
  const templates = await getTemplates()

  return (
    <>
      <section className="wrap hero">
        <p className="eyebrow">Synergi · Templates for Agentivity</p>
        <h1>Ready-made AI Solutions. <em className="mark">Import one, make it yours.</em></h1>
        <p className="hero-sub">
          A Template is a complete Solution in one file. Download it, import it in the Studio, and adapt it to the way you work.
        </p>
        <div className="actions">
          <a className="btn btn--navy" href="#catalogue">Browse the templates</a>
          <a className="btn btn--line" href={`${WEBSITE_URL}/how-it-works`}>See how Agentivity works</a>
        </div>
      </section>

      <section className="band band--mist" id="catalogue" aria-labelledby="catalogue-title">
        <div className="wrap wrap--wide sec">
          <header className="sec-head">
            <p className="eyebrow">Catalogue</p>
            <h2 className="h2" id="catalogue-title">Find a <em>starting point.</em></h2>
          </header>
          <Catalogue templates={templates} />
        </div>
      </section>

      <section className="wrap sec" aria-labelledby="how-title">
        <header className="sec-head">
          <p className="eyebrow">How to use one</p>
          <h2 className="h2" id="how-title">Three steps, <em>no code.</em></h2>
        </header>
        <ol className="steps">
          {STEPS.map((step, index) => (
            <li key={step.title}>
              <span className="steps-n" aria-hidden="true">{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="band band--yellow" aria-labelledby="cta-title">
        <div className="wrap final">
          <h2 id="cta-title">No Studio yet? <em>Start free.</em></h2>
          <p className="final-sub">The Community edition of Agentivity is free and runs on your own server. Hosted plans are on the way.</p>
          <div className="actions">
            <a className="btn btn--navy" href={`${WEBSITE_URL}/community`}>Install Community</a>
            <a className="btn btn--line" href={`${WEBSITE_URL}/pricing`}>See the editions</a>
          </div>
        </div>
      </section>
    </>
  )
}
