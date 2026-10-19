// Run with `npm test` (Node 23.6 or later: it reads the TypeScript sources directly, no build step).
// Covers the pure presentation and filtering rules, on the offline fixtures.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { FIXTURES } from '../src/data/fixtures.ts'
import { cardSummary, collectLanguages, collectTags, describeCounts, describeRequirements, filterTemplates, kindLabel, truncate } from '../src/lib/templates.ts'

const ids = (templates) => templates.map((template) => template.id).sort()
const all = { query: '', tags: [], language: '' }

test('fixtures have the shape of the marketplace API', () => {
  assert.ok(FIXTURES.length >= 3)
  for (const template of FIXTURES) {
    assert.match(template.id, /^[a-z0-9-]{3,64}$/)
    assert.ok(['team', 'workflow', 'agent'].includes(template.root.kind))
    assert.equal(template.contents[0].depth, 0, 'the first content item is the root')
    assert.ok(template.cover === null || typeof template.cover.imageUrl === 'string')
    assert.doesNotThrow(() => JSON.parse(template.rootSource.entryJson))
  }
  assert.ok(FIXTURES.some((template) => template.cover === null), 'one fixture has no cover')
})

test('describeCounts leaves out what is absent and handles the singular', () => {
  assert.equal(describeCounts({ teams: 1, agents: 13, workflows: 0, dataTables: 2 }), '1 team · 13 agents · 2 data tables')
  assert.equal(describeCounts({ teams: 0, agents: 1, workflows: 0, dataTables: 1 }), '1 agent · 1 data table')
  assert.equal(describeCounts({ teams: 0, agents: 0, workflows: 1, dataTables: 0 }), '1 workflow')
  assert.equal(describeCounts({ teams: 0, agents: 1, workflows: 0, dataTables: 0, knowledgeBases: 2 }), '1 agent · 2 knowledge bases')
  assert.equal(kindLabel('knowledgebase'), 'Knowledge base')
})

test('cardSummary prefers the tagline, otherwise the start of the description', () => {
  assert.equal(cardSummary({ tagline: 'Short and clear.', description: 'A long description.' }), 'Short and clear.')
  const summary = cardSummary({ tagline: null, description: 'word '.repeat(80) }, 60)
  assert.ok(summary.length <= 61 && summary.endsWith('…'))
  assert.equal(truncate('Fits already.', 60), 'Fits already.')
})

test('describeRequirements speaks plain words', () => {
  assert.deepEqual(describeRequirements({ credentials: ['llm'], plugins: [] }), ['A connection to an AI model'])
  assert.deepEqual(describeRequirements({ credentials: [], plugins: [] }), [])
  assert.equal(describeRequirements({ credentials: ['llm'], plugins: ['emarketing'] }).length, 2)
})

test('every selected tag must match', () => {
  assert.deepEqual(ids(filterTemplates(FIXTURES, { ...all, tags: ['marketing'] })), ['lead-qualifier', 'weekly-competitor-note'])
  assert.deepEqual(ids(filterTemplates(FIXTURES, { ...all, tags: ['marketing', 'sales'] })), ['lead-qualifier'])
  assert.deepEqual(filterTemplates(FIXTURES, { ...all, tags: ['marketing', 'finance'] }), [])
})

test('search matches the start of a word in name, tagline, description and tags', () => {
  assert.deepEqual(ids(filterTemplates(FIXTURES, { ...all, query: 'supp' })), ['support-desk'])
  assert.deepEqual(ids(filterTemplates(FIXTURES, { ...all, query: 'crm' })), ['lead-qualifier'], 'a tag is searchable')
  assert.deepEqual(filterTemplates(FIXTURES, { ...all, query: 'upport' }), [], 'the middle of a word does not match')
  assert.deepEqual(ids(filterTemplates(FIXTURES, { ...all, query: 'competitor note' })), ['weekly-competitor-note'], 'every term must match')
})

test('language filter and the lists that feed the filters', () => {
  assert.deepEqual(ids(filterTemplates(FIXTURES, { ...all, language: 'fr' })), ['controle-factures'])
  assert.deepEqual(collectLanguages(FIXTURES), ['en', 'fr'])
  assert.equal(collectTags(FIXTURES)[0].tag, 'marketing', 'the most used tag comes first')
})
