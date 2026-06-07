import fs from 'fs'
import path from 'path'

export type TemplateKind = 'agent' | 'team' | 'workflow'
export type CanvasRenderer = 'team' | 'workflow'

export interface TemplateEntry {
  id: string
  slug: string
  name: string
  description: string
  department: string
  kind: TemplateKind
  canvasRenderer: CanvasRenderer
  dataPath: string
  agentCount?: number
}

function cleanDepartment(folderName: string): string {
  return folderName.replace(/ Dep$/, '').trim()
}

function parseAgenticFile(filePath: string): Omit<TemplateEntry, 'department' | 'dataPath' | 'slug'> | null {
  try {
    const raw   = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    if (!raw.id || typeof raw.id !== 'string') return null

    const kind: TemplateKind = raw.kind === 'team' ? 'team' : 'agent'
    const entry = typeof raw.entryJson === 'string' ? JSON.parse(raw.entryJson) : raw.entryJson

    const name        = (entry?.name ?? entry?.team?.name ?? '').trim()
    const description = (entry?.description ?? entry?.team?.description ?? entry?.goal ?? '').trim()
    const agentCount  = kind === 'team' ? (entry?.members?.length ?? 0) : undefined

    if (!name) return null

    return { id: raw.id, name, description, kind, canvasRenderer: kind === 'team' ? 'team' : 'workflow', agentCount }
  } catch {
    return null
  }
}

function parseWorkflowFile(filePath: string): Omit<TemplateEntry, 'department' | 'dataPath' | 'slug'> | null {
  try {
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    if (!raw.id || typeof raw.id !== 'string') return null
    if (!raw.nodes || !Array.isArray(raw.nodes) || raw.nodes.length === 0) return null

    // skip e2e test fixtures
    const name = (raw.name ?? '').trim()
    if (!name || name.startsWith('E2E') || name.startsWith('e2e')) return null

    return { id: raw.id, name, description: (raw.description ?? '').trim(), kind: 'workflow', canvasRenderer: 'workflow' }
  } catch {
    return null
  }
}

function urlEncodePath(...segments: string[]): string {
  return segments.map(s => encodeURIComponent(s)).join('/')
}

export function buildRegistry(): TemplateEntry[] {
  const entries: TemplateEntry[] = []
  const publicDir = path.join(process.cwd(), 'public', 'data')

  // --- agentic (agents + teams) ---
  const agenticDir = path.join(publicDir, 'agentic')
  if (fs.existsSync(agenticDir)) {
    for (const deptFolder of fs.readdirSync(agenticDir)) {
      const deptPath = path.join(agenticDir, deptFolder)
      if (!fs.statSync(deptPath).isDirectory()) continue

      const department = cleanDepartment(deptFolder)
      for (const file of fs.readdirSync(deptPath)) {
        if (!file.endsWith('.json')) continue
        const parsed = parseAgenticFile(path.join(deptPath, file))
        if (!parsed) continue

        entries.push({
          ...parsed,
          slug:       parsed.id,
          department,
          dataPath:   `/data/agentic/${urlEncodePath(deptFolder)}/${encodeURIComponent(file)}`,
        })
      }
    }
  }

  // --- workflows ---
  const workflowsDir = path.join(publicDir, 'workflows')
  if (fs.existsSync(workflowsDir)) {
    const scan = (dir: string, department: string) => {
      for (const entry of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, entry)
        if (fs.statSync(fullPath).isDirectory()) { scan(fullPath, entry); continue }
        if (!entry.endsWith('.json')) continue

        const parsed = parseWorkflowFile(fullPath)
        if (!parsed) continue

        const rel    = path.relative(path.join(publicDir, 'workflows'), fullPath)
        const urlPath = '/data/workflows/' + rel.split(path.sep).map(encodeURIComponent).join('/')

        entries.push({ ...parsed, slug: parsed.id, department, dataPath: urlPath })
      }
    }
    scan(workflowsDir, 'General')
  }

  // deduplicate by dataPath (unique per file, more reliable than id)
  const seen = new Set<string>()
  return entries.filter(e => {
    if (!e.id || !e.slug || !e.dataPath) return false
    if (seen.has(e.dataPath)) return false
    seen.add(e.dataPath)
    return true
  })
}

let _cache: TemplateEntry[] | null = null
export function getRegistry(): TemplateEntry[] {
  if (!_cache) _cache = buildRegistry()
  return _cache
}

export function getTemplateBySlug(slug: string): TemplateEntry | undefined {
  return getRegistry().find(t => t.slug === slug)
}

export function getDepartments(): string[] {
  const deps = new Set(getRegistry().map(t => t.department))
  return ['All', ...Array.from(deps).sort()]
}
