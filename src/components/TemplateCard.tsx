import Link from 'next/link'
import type { CatalogueTemplate } from '@/data/types'
import TemplateCover from '@/components/TemplateCover'
import { cardSummary, describeCounts } from '@/lib/templates'

const VISIBLE_TAGS = 3

interface Props {
  template: CatalogueTemplate
  priority?: boolean
}

/** One Template in the catalogue, as a compact row: the cover as a thumbnail on the left, the name, two lines and the facts on the right. */
export default function TemplateCard({ template, priority = false }: Props) {
  const hiddenTags = template.tags.length - VISIBLE_TAGS
  return (
    <article className="card">
      <TemplateCover template={template} priority={priority} />
      <div className="card-body">
        <h3>
          {/* The link stretches over the whole card (see .card-link::after). */}
          <Link href={`/templates/${template.id}`} className="card-link">{template.name}</Link>
        </h3>
        <p className="card-summary">{cardSummary(template)}</p>
        <div className="card-foot">
          <p className="card-contents">{describeCounts(template.counts)} <span className="card-author">· By {template.author.name}</span></p>
          {template.tags.length > 0 && (
            <ul className="tags" aria-label="Tags">
              {template.tags.slice(0, VISIBLE_TAGS).map((tag) => <li key={tag} className="tag">{tag}</li>)}
              {hiddenTags > 0 && <li className="tag tag--more" aria-label={`${hiddenTags} more tags`}>+{hiddenTags}</li>}
            </ul>
          )}
        </div>
      </div>
    </article>
  )
}
