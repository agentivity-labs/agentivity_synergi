// Fake Templates, in the exact shapes of the marketplace API, for working offline and for tests.
// Used only when MARKETPLACE_FIXTURES=1 (see registry.ts). Never used in production.
import type { CatalogueTemplateDetail, RootKind, TemplateRootSource } from './types'

const AUTHOR = { id: 'example-studio', name: 'Example Studio', url: 'https://example.com', avatarUrl: null, bio: 'A fictional author, used by the offline fixtures.' }
const NO_BIO_AUTHOR = { id: 'jane-doe', name: 'Jane Doe', url: null, avatarUrl: null, bio: null }
const DATE = '2026-10-01T09:00:00Z'

// A 3:2 picture that needs no network: stands in for a hosted cover.
const SAMPLE_COVER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><rect width="600" height="400" fill="#E8ECF4"/>' +
      '<circle cx="190" cy="200" r="70" fill="#FFC83D"/><rect x="300" y="130" width="170" height="140" rx="22" fill="#152844"/></svg>',
  )

interface Member { position: string; id: string; name: string; role: string; group?: string }

function teamSource(name: string, orchestratorId: string, members: Member[], chain: boolean, managerPosition: string | null = null): TemplateRootSource {
  const connections = chain
    ? members.slice(1).map((member, index) => ({ fromTopologyPositionId: members[index].position, toTopologyPositionId: member.position, types: ['message'], handoffReason: null }))
    : []
  const entry = {
    orchestratorId,
    members: members.map((member) => ({
      topologyPositionId: member.position,
      memberEntityId: member.id,
      memberType: 'agent',
      displayName: member.name,
      role: member.role,
      icon: { type: 'material', value: 'E248', color: null, assembly: null },
      group: member.group ?? null,
    })),
    connections,
    goal: `Fixture team: ${name}.`,
    managerAgentId: managerPosition,
    maxAgentIterations: null,
    groupColors: {},
    annotations: [],
    id: `fixture-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name,
    role: `Fixture team: ${name}.`,
    tags: ['solution'],
    createdAt: DATE,
    updatedAt: DATE,
  }
  return {
    kind: 'team',
    name,
    entryJson: JSON.stringify(entry),
    members: Object.fromEntries(members.map((member) => [member.id, { kind: 'agent', name: member.name, role: member.role, tags: [] }])),
  }
}

interface Step { id: string; nodeType: string; label: string }

function graphOf(id: string, name: string, steps: Step[]) {
  return {
    id,
    name,
    entryNode: steps[0].id,
    updatedAt: DATE,
    nodes: steps.map((step, index) => ({
      id: step.id,
      nodeType: step.nodeType,
      position: { x: 200 + index * 320, y: 260 },
      zIndex: 0,
      inputs: {},
      inputsMetadata: {},
      metadata: { displayName: step.label },
    })),
    connections: steps.slice(1).map((step, index) => ({ from: steps[index].id, fromPort: 'out', to: step.id, toPort: 'in' })),
  }
}

function workflowSource(name: string, steps: Step[]): TemplateRootSource {
  const entry = { ...graphOf('fixture-workflow', name, steps), metadata: {}, dataTables: {}, annotations: [], role: `Fixture workflow: ${name}.`, tags: ['solution'], createdAt: DATE }
  return { kind: 'workflow', name, entryJson: JSON.stringify(entry), members: {} }
}

function agentSource(name: string): TemplateRootSource {
  const graph = graphOf('fixture-agent-graph', name, [{ id: 'ai_node_1', nodeType: 'ai.node', label: name }])
  const entry = { graph, id: 'fixture-agent', name, role: `Fixture agent: ${name}.`, tags: ['solution'], createdAt: DATE, updatedAt: DATE }
  return { kind: 'agent', name, entryJson: JSON.stringify(entry), members: {} }
}

interface FixtureInput {
  id: string
  name: string
  tagline: string | null
  description: string
  tags: string[]
  language: string
  rootKind: RootKind
  counts: { agents: number; teams: number; workflows: number; dataTables: number }
  requires: { credentials: string[]; plugins: string[] }
  cover: boolean
  author?: typeof AUTHOR | typeof NO_BIO_AUTHOR
  contents: { kind: string; name: string; role: string | null; depth: number }[]
  rootSource: TemplateRootSource
}

function fixture(input: FixtureInput): CatalogueTemplateDetail {
  return {
    id: input.id,
    version: '1.0.0',
    name: input.name,
    tagline: input.tagline,
    description: input.description,
    tags: input.tags,
    language: input.language,
    author: input.author ?? AUTHOR,
    license: null,
    cover: input.cover ? { imageUrl: SAMPLE_COVER, alt: `Illustration of ${input.name}` } : null,
    root: { kind: input.rootKind, id: `fixture-root-${input.id}`, name: input.name },
    counts: input.counts,
    requires: input.requires,
    sizeBytes: 48_512,
    createdAt: DATE,
    updatedAt: DATE,
    contents: input.contents.map((item, index) => ({ ...item, id: `fixture-${input.id}-${index}` })),
    fileUrl: null,
    rootUrl: null,
    rootSource: input.rootSource,
  }
}

const supportMembers: Member[] = [
  { position: 'triage', id: 'f-triage', name: 'Triage Agent', role: 'Reads each request and sends it to the right specialist.' },
  { position: 'billing', id: 'f-billing', name: 'Billing Specialist', role: 'Answers questions about invoices and payments.' },
  { position: 'delivery', id: 'f-delivery', name: 'Delivery Specialist', role: 'Tracks orders and solves delivery problems.' },
  { position: 'technical', id: 'f-technical', name: 'Technical Support', role: 'Diagnoses product faults step by step.' },
]

const noteMembers: Member[] = [
  { position: 'researcher', id: 'f-researcher', name: 'Researcher', role: 'Gathers what each competitor published this week.', group: 'Research' },
  { position: 'writer', id: 'f-writer', name: 'Writer', role: 'Turns the findings into a one-page note.', group: 'Writing' },
  { position: 'reviewer', id: 'f-reviewer', name: 'Reviewer', role: 'Checks the note against the findings.', group: 'Writing' },
]

const leadMembers: Member[] = [
  { position: 'manager', id: 'f-lead-manager', name: 'Sales Lead', role: 'Plans the qualification and hands out the work.' },
  { position: 'profiler', id: 'f-profiler', name: 'Company Profiler', role: 'Summarises what the prospect company does.' },
  { position: 'scorer', id: 'f-scorer', name: 'Fit Scorer', role: 'Scores the fit against the ideal customer profile.' },
]

export const FIXTURES: CatalogueTemplateDetail[] = [
  fixture({
    id: 'support-desk',
    name: 'Support Desk',
    tagline: 'A support desk that routes every request.',
    description:
      'A handoff team for customer support. A triage agent reads each request and passes it to the right specialist: billing, delivery or technical support.\n\nUse it as a starting point for your own support process: rename the specialists, adapt their roles, and connect your order data.',
    tags: ['support', 'customer-service'],
    language: 'en',
    rootKind: 'team',
    counts: { agents: 4, teams: 1, workflows: 0, dataTables: 1 },
    requires: { credentials: ['llm'], plugins: [] },
    cover: false,
    contents: [
      { kind: 'team', name: 'Support Desk', role: 'Handoff team that routes each request.', depth: 0 },
      ...supportMembers.map((member) => ({ kind: 'agent', name: member.name, role: member.role, depth: 1 })),
      { kind: 'datatable', name: 'orders', role: null, depth: 2 },
    ],
    rootSource: teamSource('Support Desk', 'handoff', supportMembers, true),
  }),
  fixture({
    id: 'weekly-competitor-note',
    name: 'Weekly Competitor Note',
    tagline: null,
    description: 'A sequential team that prepares a one-page note on what your competitors published this week: a researcher gathers the facts, a writer drafts the note and a reviewer checks it against the findings.',
    tags: ['marketing', 'research'],
    language: 'en',
    rootKind: 'team',
    counts: { agents: 3, teams: 1, workflows: 0, dataTables: 0 },
    requires: { credentials: ['llm', 'search'], plugins: [] },
    cover: true,
    contents: [
      { kind: 'team', name: 'Weekly Competitor Note', role: 'Sequential team: research, write, review.', depth: 0 },
      ...noteMembers.map((member) => ({ kind: 'agent', name: member.name, role: member.role, depth: 1 })),
    ],
    rootSource: teamSource('Weekly Competitor Note', 'sequential', noteMembers, true),
  }),
  fixture({
    id: 'controle-factures',
    name: 'Contrôle des factures',
    tagline: 'Chaque facture lue, chaque doute signalé.',
    description: 'Un workflow qui lit une facture fournisseur, vérifie ses montants et demande une validation quand quelque chose ne colle pas.',
    tags: ['finance'],
    language: 'fr',
    rootKind: 'workflow',
    counts: { agents: 0, teams: 0, workflows: 1, dataTables: 1 },
    requires: { credentials: ['llm', 'email'], plugins: [] },
    cover: true,
    author: NO_BIO_AUTHOR,
    contents: [
      { kind: 'workflow', name: 'Contrôle des factures', role: 'Lit, vérifie et fait valider une facture.', depth: 0 },
      { kind: 'datatable', name: 'factures', role: null, depth: 1 },
    ],
    rootSource: workflowSource('Contrôle des factures', [
      { id: 'form', nodeType: 'interaction.form', label: 'Invoice form' },
      { id: 'read', nodeType: 'document.extract_text', label: 'Read the file' },
      { id: 'check', nodeType: 'ai.node', label: 'Check the figures' },
      { id: 'approve', nodeType: 'interaction.human', label: 'Approval' },
    ]),
  }),
  fixture({
    id: 'meeting-notes',
    name: 'Meeting Notes',
    tagline: 'From a transcript to decisions and next steps.',
    description: 'A single agent that turns a meeting transcript into a short summary, the decisions taken and the list of next steps with an owner for each.',
    tags: ['productivity'],
    language: 'en',
    rootKind: 'agent',
    counts: { agents: 1, teams: 0, workflows: 0, dataTables: 0 },
    requires: { credentials: [], plugins: [] },
    cover: false,
    author: NO_BIO_AUTHOR,
    contents: [{ kind: 'agent', name: 'Meeting Notes', role: 'Summarises a transcript into decisions and next steps.', depth: 0 }],
    rootSource: agentSource('Meeting Notes'),
  }),
  fixture({
    id: 'lead-qualifier',
    name: 'Lead Qualifier',
    tagline: 'Know which prospects deserve a call.',
    description: 'A manager-led team that profiles a prospect company, scores how well it fits your ideal customer and prepares the first message. The sales lead decides who works on what, request by request.',
    tags: ['sales', 'marketing', 'crm', 'b2b', 'outreach'],
    language: 'en',
    rootKind: 'team',
    counts: { agents: 3, teams: 1, workflows: 1, dataTables: 2 },
    requires: { credentials: ['llm'], plugins: ['emarketing'] },
    cover: true,
    contents: [
      { kind: 'team', name: 'Lead Qualifier', role: 'Manager-led team that qualifies a prospect.', depth: 0 },
      ...leadMembers.map((member) => ({ kind: 'agent', name: member.name, role: member.role, depth: 1 })),
      { kind: 'workflow', name: 'Send first message', role: 'Prepares and sends the first email after approval.', depth: 1 },
      { kind: 'datatable', name: 'prospects', role: null, depth: 2 },
      { kind: 'datatable', name: 'ideal_customer_profile', role: null, depth: 2 },
    ],
    rootSource: teamSource('Lead Qualifier', 'manager-led', leadMembers, false, 'manager'),
  }),
]
