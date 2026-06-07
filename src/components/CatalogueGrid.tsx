'use client'

import { useState, useMemo } from 'react'
import type { TemplateEntry, TemplateKind } from '@/data/registry'
import TemplateCard from '@/components/TemplateCard'

interface Props {
  templates:   TemplateEntry[]
  departments: string[]
}

const KIND_FILTERS: { label: string; value: TemplateKind | 'all' }[] = [
  { label: 'All types',  value: 'all' },
  { label: 'Teams',      value: 'team' },
  { label: 'Agents',     value: 'agent' },
  { label: 'Workflows',  value: 'workflow' },
]

export default function CatalogueGrid({ templates, departments }: Props) {
  const [activeDept, setActiveDept] = useState('All')
  const [activeKind, setActiveKind] = useState<TemplateKind | 'all'>('all')
  const [search,     setSearch]     = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return templates.filter(t => {
      if (activeDept !== 'All' && t.department !== activeDept) return false
      if (activeKind !== 'all' && t.kind !== activeKind)        return false
      if (q && !t.name.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q)) return false
      return true
    })
  }, [templates, activeDept, activeKind, search])

  return (
    <>
      {/* Search */}
      <div className="search-wrap">
        <input
          className="search-input"
          type="search"
          placeholder="Search templates…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Search templates"
        />
      </div>

      {/* Type filter */}
      <div className="dept-filters" role="group" aria-label="Filter by type">
        {KIND_FILTERS.map(f => (
          <button
            key={f.value}
            className={`dept-btn${activeKind === f.value ? ' active' : ''}`}
            onClick={() => setActiveKind(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Department filter */}
      <div className="dept-filters" role="group" aria-label="Filter by department" style={{ marginTop: 8 }}>
        {departments.map(dept => (
          <button
            key={dept}
            className={`dept-btn${activeDept === dept ? ' active' : ''}`}
            onClick={() => setActiveDept(dept)}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="results-count mono">
        {filtered.length} template{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Grid */}
      <div className="tpl-grid">
        {filtered.length === 0 ? (
          <div className="empty-state">No templates match your filters.</div>
        ) : (
          filtered.map(t => <TemplateCard key={t.dataPath} template={t} />)
        )}
      </div>
    </>
  )
}
