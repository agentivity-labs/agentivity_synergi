import type { CatalogueTemplate } from '@/data/types'
import TemplateGraph from '@/components/TemplateGraph'

interface Props {
  template: CatalogueTemplate
  /** Above the fold: load the picture right away. */
  priority?: boolean
}

/**
 * The 3:2 illustration of a Template. The picture is hosted by the marketplace and shown straight from its URL
 * (never copied here; the `?v=` parameter is kept, it busts the cache when the picture changes).
 * Without a cover, the graph of the root stands in, still and at the same ratio.
 */
export default function TemplateCover({ template, priority = false }: Props) {
  const { cover } = template
  return (
    <div className="cover">
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element -- static export: the image stays on the marketplace storage
        <img
          src={cover.imageUrl}
          alt={cover.alt?.trim() || template.name}
          width={1200}
          height={800}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      ) : (
        <div className="cover-graph">
          <TemplateGraph src={template.rootUrl} source={template.rootSource} label={`Diagram of ${template.name}`} fit />
        </div>
      )}
    </div>
  )
}
