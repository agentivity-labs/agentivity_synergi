'use client'

import { useEffect, useMemo, useState } from 'react'
import type { CatalogueTemplate } from '@/data/types'
import TemplateCard from '@/components/TemplateCard'
import { collectLanguages, collectTags, filterTemplates, languageName } from '@/lib/templates'

interface Props {
  templates: CatalogueTemplate[]
}

/** Reads the filters kept in the address, so a filtered view can be shared or reloaded. */
function readAddress(): { query: string; tags: string[]; language: string } {
  const params = new URLSearchParams(window.location.search)
  return { query: params.get('q') ?? '', tags: params.getAll('tag'), language: params.get('language') ?? '' }
}

/**
 * The catalogue with its filters. The site is static: the list comes from the build, and filtering happens here,
 * with the same rules as the marketplace API (every tag must match, search terms match the start of a word).
 */
export default function Catalogue({ templates }: Props) {
  const [query, setQuery] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [language, setLanguage] = useState('')
  const [ready, setReady] = useState(false)

  const allTags = useMemo(() => collectTags(templates), [templates])
  const languages = useMemo(() => collectLanguages(templates), [templates])

  useEffect(() => {
    const initial = readAddress()
    setQuery(initial.query)
    setTags(initial.tags.filter((tag) => allTags.some((entry) => entry.tag === tag)))
    setLanguage(languages.includes(initial.language) ? initial.language : '')
    setReady(true)
  }, [allTags, languages])

  useEffect(() => {
    if (!ready) return
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    tags.forEach((tag) => params.append('tag', tag))
    if (language) params.set('language', language)
    const search = params.toString()
    window.history.replaceState(null, '', `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`)
  }, [ready, query, tags, language])

  const filtered = useMemo(() => filterTemplates(templates, { query, tags, language }), [templates, query, tags, language])
  const filtering = query.trim() !== '' || tags.length > 0 || language !== ''

  const toggleTag = (tag: string) => setTags((current) => (current.includes(tag) ? current.filter((entry) => entry !== tag) : [...current, tag]))
  const reset = () => { setQuery(''); setTags([]); setLanguage('') }

  return (
    <>
      <form className="filters" role="search" aria-label="Filter templates" onSubmit={(event) => event.preventDefault()}>
        <div className="filters-row">
          <label className="field field--search">
            <span className="field-label">Search</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Support, invoices, travel"
              autoComplete="off"
            />
          </label>

          {languages.length > 1 && (
            <label className="field">
              <span className="field-label">Language</span>
              <select value={language} onChange={(event) => setLanguage(event.target.value)}>
                <option value="">Any language</option>
                {languages.map((code) => <option key={code} value={code}>{languageName(code)}</option>)}
              </select>
            </label>
          )}
        </div>

        {allTags.length > 0 && (
          <fieldset className="tag-filter">
            <legend className="field-label">Tags</legend>
            <div className="tag-filter-list">
              {allTags.map(({ tag, count }) => (
                <button
                  key={tag}
                  type="button"
                  className={`chip${tags.includes(tag) ? ' is-on' : ''}`}
                  aria-pressed={tags.includes(tag)}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}<span className="chip-count" aria-hidden="true">{count}</span>
                </button>
              ))}
            </div>
          </fieldset>
        )}
      </form>

      <div className="results-bar">
        <p className="results-count" role="status" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'template' : 'templates'}
          {filtering && templates.length !== filtered.length ? ` of ${templates.length}` : ''}
        </p>
        {filtering && <button type="button" className="text-button" onClick={reset}>Clear filters</button>}
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <p className="empty-title">No template matches these filters.</p>
          <p>Remove a tag or try another word.</p>
          <button type="button" className="btn btn--sm btn--line" onClick={reset}>Clear filters</button>
        </div>
      ) : (
        <div className="card-grid">
          {filtered.map((template, index) => <TemplateCard key={template.id} template={template} priority={index < 3} />)}
        </div>
      )}
    </>
  )
}
