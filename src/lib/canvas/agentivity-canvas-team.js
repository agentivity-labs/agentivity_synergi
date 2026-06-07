/**
 * agentivity-canvas-team.js — v5
 * Faithful to Agentivity Studio Team Studio.
 *
 * Nodes:        circular disc background + vertical hexagon (pointy top/bottom)
 *               Hexagon circumradius = NODE_H/2 = 80  (fits exactly in 140×160 box)
 *               Icon + label centred inside hex, same as Flutter TeamMemberHexNode
 * Connections:  concave dumbbell bands — tangent to disc edges, sides curve inward.
 *               Band endpoints sit on the disc circumference → seamless join.
 *               Discs drawn on top close the chord ends cleanly.
 * Group chat:   ring — each node connected to its two neighbors (circle layout)
 * Concurrent:   fan-out from first member (inferred, data has no connections)
 * Manager-led:  star from manager to each worker (inferred)
 *
 * Design tokens from Flutter source:
 *   NodeFlowTheme.dark  → canvasBg #1A1A1A, dot-grid #707070
 *   HexagonShape(vertical) → circumradius = nodeSize.height/2 = 80
 *   NodeTheme.dark      → nodeBg #2D2D2D, border #555555
 *   NeutralChromaticPalette.dark (base #161616):
 *     primary   tone(0.70) ≈ #B9B9B9   agentColor
 *     tertiary  tone(0.45) ≈ #7F7F7F   teamColor
 *     secondary tone(0.50) ≈ #8B8B8B   workflowColor
 *   ConnectionTheme.dark → #999999
 *   Accent (iris)        → #8B61FF  (entry-point only)
 */

// ─── Logo Agentivity (SVG embarqué) ─────────────────────────────────────────
const _LOGO_SVG = `<svg viewBox="0 0 569.654 157.825" xmlns="http://www.w3.org/2000/svg"><circle cx="50.03" cy="26.11" r="5" fill="COL"/><circle cx="43.78" cy="38.61" r="5" fill="COL"/><circle cx="56.28" cy="38.61" r="5" fill="COL"/><path fill="COL" d="m 47.723438,49.108088 c -5.135996,0 -9.824356,1.26616 -14.068356,3.79883 -4.244666,2.532 -7.597927,6.08115 -10.058593,10.64648 -1.807566,3.35271 -2.951524,7.07063 -3.431641,11.1543 h 12.654297 c 0.401165,-2.18968 1.107077,-4.17814 2.119141,-5.96485 1.676,-2.96066 3.869411,-5.2069 6.580078,-6.74023 2.710666,-1.534 5.634774,-2.30078 8.773434,-2.30078 3.13867,0 6.06473,0.78418 8.77539,2.35351 2.71067,1.56934 4.90342,3.85166 6.58008,6.84766 1.676,2.996 2.51367,6.52775 2.51367,10.59375 0,4.066 -0.83767,7.61448 -2.51367,10.64648 -1.67666,3.03134 -3.86941,5.33106 -6.58008,6.90039 -2.71066,1.56934 -5.63672,2.35352 -8.77539,2.35352 -3.06733,0 -5.972747,-0.80158 -8.718747,-2.40625 -2.746667,-1.60533 -4.958765,-3.94243 -6.634765,-7.00977 -0.926026,-1.69409 -1.597139,-3.54034 -2.011719,-5.53906 H 20.237114 c 0.516924,3.88196 1.636552,7.45833 3.359375,10.72852 2.460666,4.67266 5.795239,8.312012 10.003906,10.916012 4.208667,2.60334 8.845489,3.9043 13.910153,3.9043 4.56534,0 8.6306,-0.92658 12.19727,-2.78125 3.56667,-1.85467 6.38446,-4.17308 8.45312,-6.95508 v 8.77344 h 12.30469 V 50.070978 h -12.30469 v 8.56055 c -2.06866,-2.71067 -4.83168,-4.97626 -8.29101,-6.79493 -3.46,-1.81933 -7.50982,-2.72851 -12.14649,-2.72851 z"/><path fill="COL" d="m 140.70735,58.631008 v -8.56 h 12.305 v 59.920002 q 0,8.132 -3.424,14.499 -3.424,6.366 -9.897,10.004 -6.474,3.638 -15.462,3.638 -11.984,0 -19.902,-5.618 -7.918002,-5.617 -8.988002,-15.247 h 12.091002 q 1.391,4.601 5.939,7.436 4.547,2.836 10.86,2.836 7.383,0 11.931,-4.494 4.547,-4.494 4.547,-13.054 v -9.844 q -3.103,4.173 -8.399,7.008 -5.297,2.836 -12.038,2.836 -7.704,0 -14.07,-3.905 -6.367002,-3.906 -10.058002,-10.915002 -3.692,-7.008 -3.692,-15.889 0,-8.881 3.692,-15.729 3.691,-6.848 10.058002,-10.646 6.366,-3.799 14.07,-3.799 6.848,0 12.145,2.729 5.296,2.728 8.292,6.794 z m -17.869,1.07 q -4.708,0 -8.774,2.301 -4.066,2.3 -6.58,6.741 -2.515,4.44 -2.515,10.539 0,6.099 2.515,10.7 2.514,4.601 6.634,7.009 4.119,2.407 8.72,2.407 4.708,0 8.774,-2.354 4.066,-2.354 6.581,-6.901 2.514,-4.548 2.514,-10.647 0,-6.099 -2.514,-10.593 -2.515,-4.494 -6.581,-6.848 -4.066,-2.354 -8.774,-2.354 z"/><path fill="COL" d="m 222.66935,84.097008 h -45.047 q 0.535,7.062 5.243,11.342 4.708,4.28 11.556,4.28 9.844,0 13.91,-8.239 h 13.161 q -2.675,8.132 -9.683,13.322002 -7.009,5.189 -17.388,5.189 -8.453,0 -15.14,-3.798 -6.688,-3.799 -10.487,-10.701002 -3.798,-6.901 -3.798,-15.996 0,-9.095 3.692,-15.997 3.691,-6.901 10.378,-10.646 6.688,-3.745 15.355,-3.745 8.346,0 14.873,3.638 6.527,3.638 10.165,10.218 3.638,6.581 3.638,15.141 0,3.317 -0.428,5.992 z m -12.305,-9.844 q -0.107,-6.741 -4.815,-10.807 -4.708,-4.066 -11.663,-4.066 -6.313,0 -10.807,4.013 -4.494,4.012 -5.35,10.86 z"/><path fill="COL" d="m 289.00935,74.253008 v 34.775002 h -12.091 V 76.072008 q 0,-7.918 -3.959,-12.144 -3.959,-4.227 -10.807,-4.227 -6.848,0 -10.86,4.227 -4.013,4.226 -4.013,12.144 v 32.956002 h -12.198 V 50.071008 h 12.198 v 6.741 q 2.996,-3.638 7.65,-5.671 4.655,-2.033 9.898,-2.033 6.955,0 12.466,2.889 5.51,2.889 8.613,8.56 3.103,5.671 3.103,13.696 z"/><path fill="COL" d="m 318.75535,60.022008 v 32.635 q 0,3.317 1.551,4.762 1.552,1.444 5.297,1.444 h 7.49 v 10.165002 h -9.63 q -8.239,0 -12.626,-3.852 -4.387,-3.852 -4.387,-12.519002 v -32.635 h -6.955 v -9.951 h 6.955 v -14.659 h 12.305 v 14.659 h 14.338 v 9.951 z"/><path fill="COL" d="m 342.72335,34.449008 q 0,-3.317 2.247,-5.564 2.247,-2.247 5.564,-2.247 3.21,0 5.457,2.247 2.247,2.247 2.247,5.564 0,3.317 -2.247,5.564 -2.247,2.247 -5.457,2.247 -3.317,0 -5.564,-2.247 -2.247,-2.247 -2.247,-5.564 z m 13.803,15.622 v 58.957002 h -12.198 V 50.071008 Z"/><path fill="COL" d="m 395.36735,98.114008 16.692,-48.043 h 12.947 l -22.47,58.957002 h -14.552 l -22.363,-58.957002 h 13.054 z"/><path fill="COL" d="m 432.60335,34.449008 q 0,-3.317 2.247,-5.564 2.247,-2.247 5.564,-2.247 3.21,0 5.457,2.247 2.247,2.247 2.247,5.564 0,3.317 -2.247,5.564 -2.247,2.247 -5.457,2.247 -3.317,0 -5.564,-2.247 -2.247,-2.247 -2.247,-5.564 z m 13.803,15.622 v 58.957002 h -12.198 V 50.071008 Z"/><path fill="COL" d="m 476.68735,60.022008 v 32.635 q 0,3.317 1.552,4.762 1.551,1.444 5.296,1.444 h 7.49 v 10.165002 h -9.63 q -8.239,0 -12.626,-3.852 -4.387,-3.852 -4.387,-12.519002 v -32.635 h -6.955 v -9.951 h 6.955 v -14.659 h 12.305 v 14.659 h 14.338 v 9.951 z"/><path fill="COL" d="m 555.33235,50.071008 -36.166,86.670002 h -12.626 l 11.984,-28.676 -23.219,-57.994002 h 13.589 l 16.585,44.94 17.227,-44.94 z"/></svg>`;

function _makeLogo(color) {
  const img = new Image();
  img.src = 'data:image/svg+xml,' + encodeURIComponent(_LOGO_SVG.replace(/COL/g, color));
  return img;
}
const _LOGO_DARK  = _makeLogo('#ffffff');
const _LOGO_LIGHT = _makeLogo('#152844');

// ─── Layout constants (mirrors TeamLayoutEngine.dart) ────────────────────────

export const NODE_W = 140;
export const NODE_H = 160;
const H_GAP = 130;
const V_GAP = 100;

// Visual constants
const DISC_R  = 92;   // disc radius (~12px halo around HEX_R=80)
const BAND_HW  = 65;   // band half-width at node disc (70% of DISC_R)
const HEX_R    = 80;   // hexagon circumradius = NODE_H/2

// Org-chart bracket dimensions (manager-led topology)
const ORG_STEM_HW = 55;  // dumbbell half-width at the node disc end of each stem
const ORG_BUS_R   = 14;  // relay disc radius at bus endpoints (controls bus bar height)

// Tentacle (concurrent topology)
const TENTACLE_HUB_HW = 28;   // band half-width at hub end of each tentacle
const TENTACLE_TIP_HW = 14;   // band half-width at worker disc end

// ─── Tunable parameters ───────────────────────────────────────────────────────
const BG_ALPHA      = 0.30;  // opacity of the disc/band background blob
const SIM_STEP_DUR  = 3.0;   // seconds per simulation step
// Idle node colour — should stay close to the canvas background so inactive
// nodes recede visually. Dark canvas = #1A1A1A (~10% L), light = #F4F4F5 (~96% L).
const IDLE_COLOR_DARK  = 'hsl(0,0%,30%)';   // dark  mode idle: just above canvas bg
const IDLE_COLOR_LIGHT = 'hsl(0,0%,80%)';   // light mode idle: just below canvas bg

// ─── Themes ──────────────────────────────────────────────────────────────────

export const DARK_THEME = {
  isDark: true,
  canvasBg:  '#1A1A1A',
  gridColor: 'rgba(112,112,112,0.40)',
  gridSize:  20,
  nodeBg:      '#2D2D2D',
  nodeBorder:  '#555555',
  nodeBorderW: 2,
  nodeRadius:  8,
  text:    '#E0E0E0',
  textDim: '#B0B0B0',
  // NeutralChromaticPalette.dark tones
  agentColor:    '#B9B9B9',
  teamColor:     '#7F7F7F',
  workflowColor: '#8B8B8B',
  connColor: '#999999',
  connW:     2,
  accent: '#8B61FF',
  // Disc + band rendering (no stroke on discs)
  discAlpha:  0.22,
  bandAlpha:  0.22,
  // Sidebar
  badgeBg:    'rgba(139,97,255,0.12)',
  badgeBorder:'rgba(139,97,255,0.30)',
  badgeText:  '#c4a8ff',
};

export const LIGHT_THEME = {
  isDark: false,
  canvasBg:  '#F4F4F5',
  gridColor: 'rgba(170,170,170,0.50)',
  gridSize:  20,
  nodeBg:      '#FFFFFF',
  nodeBorder:  '#E0E0E0',
  nodeBorderW: 2,
  nodeRadius:  8,
  text:    '#333333',
  textDim: '#666666',
  agentColor:    '#575757',
  teamColor:     '#8A8A8A',
  workflowColor: '#707070',
  connColor: '#888888',
  connW:     2,
  accent: '#6B41DF',
  discAlpha:  0.15,
  bandAlpha:  0.15,
  badgeBg:    'rgba(107,65,223,0.10)',
  badgeBorder:'rgba(107,65,223,0.28)',
  badgeText:  '#5B35CC',
};

// ─── Orchestrator metadata ────────────────────────────────────────────────────

export const ORCHESTRATOR_META = {
  sequential:    { label: 'Sequential',  icon: '→' },
  concurrent:    { label: 'Concurrent',  icon: '⇶' },
  handoff:       { label: 'Handoff',     icon: '⇄' },
  'group-chat':  { label: 'Group Chat',  icon: '◎' },
  groupChat:     { label: 'Group Chat',  icon: '◎' },
  'manager-led': { label: 'Manager-Led', icon: '⬡' },
  managerLed:    { label: 'Manager-Led', icon: '⬡' },
};

// ─── Layout engine ────────────────────────────────────────────────────────────

export function computeLayout(members, orchId, canvasW, canvasH) {
  if (!members?.length) return {};
  const cx = canvasW / 2, cy = canvasH / 2, out = {};
  switch (orchId) {
    case 'sequential':                    _seq(members, cx, cy, out);    break;
    case 'concurrent':                    _fan(members, cx, cy, out);    break;
    case 'handoff':                       _grid(members, cx, cy, out);   break;
    case 'group-chat': case 'groupChat':  _circle(members, cx, cy, out); break;
    case 'manager-led': case 'managerLed':_mgr(members, cx, cy, out);    break;
    default:                              _grid(members, cx, cy, out);
  }
  return out;
}

function _seq(m, cx, cy, o) {
  const tw = m.length * NODE_W + (m.length - 1) * H_GAP;
  const sx = cx - tw / 2;
  m.forEach((s, i) => { o[s.slotId] = { x: sx + i*(NODE_W+H_GAP), y: cy - NODE_H/2 }; });
}
function _fan(m, cx, cy, o) {
  if (m.length === 1) { o[m[0].slotId] = { x: cx-NODE_W/2, y: cy-NODE_H/2 }; return; }
  o[m[0].slotId] = { x: cx-NODE_W-H_GAP, y: cy-NODE_H/2 };
  const fan = m.slice(1), th = fan.length*NODE_H + (fan.length-1)*V_GAP;
  const sy = cy - th / 2;
  fan.forEach((s, i) => { o[s.slotId] = { x: cx+H_GAP, y: sy + i*(NODE_H+V_GAP) }; });
}
function _grid(m, cx, cy, o) {
  const cols = 3, rows = Math.ceil(m.length / cols);
  const gW = cols*NODE_W + (cols-1)*H_GAP, gH = rows*NODE_H + (rows-1)*V_GAP;
  m.forEach((s, i) => {
    o[s.slotId] = {
      x: cx - gW/2 + (i % cols)*(NODE_W+H_GAP),
      y: cy - gH/2 + Math.floor(i / cols)*(NODE_H+V_GAP),
    };
  });
}
function _circle(m, cx, cy, o) {
  const r = Math.max(140, (m.length*(NODE_W+H_GAP)) / (2*Math.PI) + 40);
  m.forEach((s, i) => {
    const a = 2*Math.PI*i/m.length - Math.PI/2;
    o[s.slotId] = { x: cx + r*Math.cos(a) - NODE_W/2, y: cy + r*Math.sin(a) - NODE_H/2 };
  });
}
function _mgr(m, cx, cy, o) {
  o[m[0].slotId] = { x: cx-NODE_W/2, y: cy-NODE_H-V_GAP*2 };
  const ws = m.slice(1); if (!ws.length) return;
  const tw = ws.length*NODE_W + (ws.length-1)*H_GAP;
  ws.forEach((s, i) => { o[s.slotId] = { x: cx - tw/2 + i*(NODE_W+H_GAP), y: cy }; });
}

// ─── Material icon paths (24×24 viewBox) ─────────────────────────────────────

const _P = d => new Path2D(d);
const ICONS = {
  agent:    _P('M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'),
  agentSeq: _P('M4 9h4v2H4zm0 4h4v2H4zm6-4h4v2h-4zm0 4h4v2h-4zm6-4h4v2h-4zm0 4h4v2h-4zM9 7L8 6 4 10l4 4 1-1-3-3 3-3zm6 0l1-1 4 4-4 4-1-1 3-3-3-3z'),
  agentFan: _P('M14 4l2.29 2.29-2.88 2.88 1.42 1.42 2.88-2.88L20 10V4zm-4 0H4v6l2.29-2.29 4.71 4.7V20h2v-8.41l-5.29-5.3z'),
  agentHof: _P('M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z'),
  agentGrp: _P('M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z'),
  agentMgr: _P('M16.5 12c1.38 0 2.49-1.12 2.49-2.5S17.88 7 16.5 7C15.12 7 14 8.12 14 9.5s1.12 2.5 2.5 2.5zM9 11c1.66 0 2.99-1.34 2.99-3S10.66 5 9 5C7.34 5 6 6.34 6 8s1.34 3 3 3zm7.5 3c-1.83 0-5.5.92-5.5 2.75V19h11v-2.25c0-1.83-3.67-2.75-5.5-2.75zM9 13c-2.33 0-7 1.17-7 3.5V19h7v-2.25c0-.85.33-2.34 2.37-3.47C10.5 13.1 9.66 13 9 13z'),
  team:     _P('M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.13 1.1c-.37-.06-.74-.1-1.13-.1-.99 0-1.93.21-2.78.58C.48 14.9 0 15.62 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 3.43c0-.81-.48-1.53-1.22-1.85A6.95 6.95 0 0020 14c-.39 0-.76.04-1.13.1.4.68.63 1.46.63 2.29V18H24v-1.57zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z'),
  workflow: _P('M22 11V3h-7v3H9V3H2v8h7V8h2v10h4v3h7v-8h-7v3h-2V8h2v3h7zM7 9H4V5h3v4zm10 6h3v4h-3v-4zm0-12h3v4h-3V3z'),
  star:     _P('M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'),
};

function _iconFor(member, orchId) {
  if (member.memberType === 'team')     return ICONS.team;
  if (member.memberType === 'workflow') return ICONS.workflow;
  switch (orchId) {
    case 'sequential':                     return ICONS.agentSeq;
    case 'concurrent':                     return ICONS.agentFan;
    case 'handoff':                        return ICONS.agentHof;
    case 'group-chat': case 'groupChat':   return ICONS.agentGrp;
    case 'manager-led': case 'managerLed': return ICONS.agentMgr;
    default:                               return ICONS.agent;
  }
}

function _typeColor(type, T) {
  switch (type) {
    case 'team':     return T.teamColor;
    case 'workflow': return T.workflowColor;
    default:         return T.agentColor;
  }
}

// ─── Agent colour palette ─────────────────────────────────────────────────────
// Agents are assigned colours in order (wraps for large teams).
// dark  = active colour on dark canvas
// light = active colour on light canvas
// Idle state is always neutral grey.
const AGENT_PALETTE = [
  { dark: 'hsl(260, 75%, 68%)', light: 'hsl(260, 68%, 42%)' }, //  0 · indigo / violet
  { dark: 'hsl(160, 70%, 58%)', light: 'hsl(160, 60%, 32%)' }, //  1 · teal / mint
  { dark: 'hsl( 30, 80%, 65%)', light: 'hsl( 30, 70%, 38%)' }, //  2 · amber / orange
  { dark: 'hsl(200, 72%, 65%)', light: 'hsl(200, 65%, 36%)' }, //  3 · sky blue
  { dark: 'hsl(340, 72%, 68%)', light: 'hsl(340, 62%, 40%)' }, //  4 · rose / pink
  { dark: 'hsl( 85, 65%, 60%)', light: 'hsl( 85, 58%, 33%)' }, //  5 · lime / yellow-green
  { dark: 'hsl(300, 65%, 68%)', light: 'hsl(300, 58%, 40%)' }, //  6 · magenta / fuchsia
  { dark: 'hsl( 50, 82%, 62%)', light: 'hsl( 50, 74%, 35%)' }, //  7 · gold / yellow
  { dark: 'hsl(180, 68%, 60%)', light: 'hsl(180, 62%, 32%)' }, //  8 · cyan / aqua
  { dark: 'hsl(  0, 72%, 65%)', light: 'hsl(  0, 62%, 40%)' }, //  9 · red / coral
  { dark: 'hsl(220, 72%, 68%)', light: 'hsl(220, 65%, 40%)' }, // 10 · periwinkle / blue
  { dark: 'hsl(120, 60%, 58%)', light: 'hsl(120, 55%, 32%)' }, // 11 · green
];

function _simColor(index, active, isDark) {
  if (!active) return isDark ? IDLE_COLOR_DARK : IDLE_COLOR_LIGHT;
  const e = AGENT_PALETTE[index % AGENT_PALETTE.length];
  return isDark ? e.dark : e.light;
}

// ─── Simulation state machine ────────────────────────────────────────────────
// Returns { activeSlots: Set<string>, activeConns: Set<string 'a|b'> }
// given the team structure and current step index.

function _simStep(team, step) {
  const members = team.members;
  const orchId  = team.orchestratorId;
  const active  = new Set();
  const aConns  = new Set();
  const n       = members.length;
  if (!n) return { activeSlots: active, activeConns: aConns };

  const entry = team.entryPointMemberId ?? members[0].slotId;

  // Build directed adjacency from real connections
  const edges = (team.connections ?? []).map(c => [c.fromSlotId, c.toSlotId]);
  const nextOf = (slot) => edges.filter(([f]) => f === slot).map(([,t]) => t);

  switch (orchId) {
    case 'sequential': {
      // One node active at a time in member order
      const i = step % n;
      active.add(members[i].slotId);
      if (i + 1 < n) aConns.add(`${members[i].slotId}|${members[i+1].slotId}`);
      break;
    }
    case 'concurrent': {
      // Phase 0: source dispatches; phases 1…n-1: each worker active
      const src = members[0].slotId;
      const workers = members.slice(1).map(m => m.slotId);
      const phase = step % (workers.length + 2);
      if (phase === 0) {
        active.add(src);
        workers.forEach(w => aConns.add(`${src}|${w}`));
      } else if (phase <= workers.length) {
        active.add(src); active.add(workers[phase - 1]);
        aConns.add(`${src}|${workers[phase-1]}`);
      } else {
        active.add(src); // gathering results
      }
      break;
    }
    case 'handoff': {
      // DFS order — one agent active at a time, one outgoing edge highlighted
      const visited = new Set(), order = [];
      const dfs = (s) => {
        if (visited.has(s)) return; visited.add(s); order.push(s);
        nextOf(s).forEach(t => dfs(t));
      };
      dfs(entry);
      members.forEach(m => { if (!visited.has(m.slotId)) { visited.add(m.slotId); order.push(m.slotId); } });
      const i = step % order.length;
      active.add(order[i]);
      const nxt = order[(i + 1) % order.length];
      if (nextOf(order[i]).includes(nxt)) aConns.add(`${order[i]}|${nxt}`);
      break;
    }
    case 'group-chat':
    case 'groupChat': {
      // Round-robin: one node speaks at a time, highlights the ring band to its neighbor
      const i = step % n;
      active.add(members[i].slotId);
      const next = members[(i + 1) % n];
      aConns.add(`${members[i].slotId}|${next.slotId}`);
      break;
    }
    case 'manager-led':
    case 'managerLed': {
      const mgr = members[0].slotId;
      const workers = members.slice(1);
      const phase = step % (workers.length + 1);
      if (phase === 0) {
        active.add(mgr);
        workers.forEach(w => aConns.add(`${mgr}|${w.slotId}`));
      } else {
        active.add(mgr); active.add(workers[phase - 1].slotId);
        aConns.add(`${mgr}|${workers[phase-1].slotId}`);
      }
      break;
    }
    default: {
      active.add(members[step % n].slotId);
    }
  }
  return { activeSlots: active, activeConns: aConns };
}

//
// Correct disc-tangent cubic bezier.
//
// The tangent to disc A's circle at A_top (in band n,p space) is T_A = (hwAc, -dA).
// Setting C1 = A_top + k1 * T_A satisfies d|P-A_center|²/dt |t=0 = 0 for any k1 > 0
// (dot product of radius with tangent is always zero) → the curve exits tangentially,
// no "dip-back" into the disc, and BAND_HW increases → wider band, guaranteed.
//
// In (n,p) coordinates:
//   C1 = (dA + k1*hwAc,  hwAc - k1*dA)
//   Maximum concavity when C1_p = 0  →  k1_full = hwAc/dA, c1n_full = ra²/dA
//
// When c1n_full + c2n_full > len, the control points would cross → S-curve → CONVEX.
// Fix: scale k1 uniformly so c1n + c2n ≤ len * 0.88.
// After scaling, C1_p = hwAc*(1 - scale) ≥ 0 → still concave, just less so.

// Returns the dumbbell Path2D, or null if the two centres are too close.
function _dumbbellPath(ax, ay, ra, bx, by, rb, hwA, hwB) {
  const dx=bx-ax, dy=by-ay, len=Math.hypot(dx,dy);
  if (len < 8) return null;
  const nx=dx/len, ny=dy/len, px=-ny, py=nx;

  const hwAc = Math.min(hwA, ra * 0.97);
  const hwBc = Math.min(hwB, rb * 0.97);

  const dA = Math.sqrt(Math.max(0, ra*ra - hwAc*hwAc));
  const dB = Math.sqrt(Math.max(0, rb*rb - hwBc*hwBc));

  const A_top = { x: ax+nx*dA+px*hwAc, y: ay+ny*dA+py*hwAc };
  const A_bot = { x: ax+nx*dA-px*hwAc, y: ay+ny*dA-py*hwAc };
  const B_top = { x: bx-nx*dB+px*hwBc, y: by-ny*dB+py*hwBc };
  const B_bot = { x: bx-nx*dB-px*hwBc, y: by-ny*dB-py*hwBc };

  const c1n_full = dA > 1 ? ra*ra/dA : len*0.40;
  const c2n_full = dB > 1 ? rb*rb/dB : len*0.40;
  const total  = c1n_full + c2n_full;
  const budget = len * 0.88;
  const sc     = total > budget ? budget / total : 1.0;

  const c1n = Math.max(c1n_full * sc, dA + 0.5);
  const c2n = Math.max(c2n_full * sc, dB + 0.5);

  const k1  = hwAc > 0.5 ? (c1n - dA) / hwAc : 0;
  const k2  = hwBc > 0.5 ? (c2n - dB) / hwBc : 0;
  const c1p = Math.max(0, hwAc - k1 * dA);
  const c2p = Math.max(0, hwBc - k2 * dB);

  const C1t = { x: ax+nx*c1n+px*c1p, y: ay+ny*c1n+py*c1p };
  const C2t = { x: bx-nx*c2n+px*c2p, y: by-ny*c2n+py*c2p };
  const C1b = { x: ax+nx*c1n-px*c1p, y: ay+ny*c1n-py*c1p };
  const C2b = { x: bx-nx*c2n-px*c2p, y: by-ny*c2n-py*c2p };

  const path = new Path2D();
  path.moveTo(A_top.x, A_top.y);
  path.bezierCurveTo(C1t.x, C1t.y, C2t.x, C2t.y, B_top.x, B_top.y);
  path.lineTo(B_bot.x, B_bot.y);
  path.bezierCurveTo(C2b.x, C2b.y, C1b.x, C1b.y, A_bot.x, A_bot.y);
  path.closePath();
  return path;
}

// Curved band for tentacle (concurrent) topology.
// Tentacle arm with elbow bezier. Both disc connections are smooth (disc-tangent).
// Key: B_top/B_bot and CP2 use the ARRIVAL direction (horizontal for H-dominant,
// vertical for V-dominant) so the band is centred on the worker disc's axis.
function _tentaclePath(ax, ay, ra, bx, by, rb, hwA, hwB) {
  const dx=bx-ax, dy=by-ay, len=Math.hypot(dx,dy);
  if (len < 8) return null;
  const nx=dx/len, ny=dy/len, px=-ny, py=nx;

  const hwAc = Math.min(hwA, ra * 0.97);
  const hwBc = Math.min(hwB, rb * 0.97);

  // Hub side: disc-tangent in direct connection direction (same as _dumbbellPath)
  const dA = Math.sqrt(Math.max(0, ra*ra - hwAc*hwAc));
  const A_top = { x: ax+nx*dA+px*hwAc, y: ay+ny*dA+py*hwAc };
  const A_bot = { x: ax+nx*dA-px*hwAc, y: ay+ny*dA-py*hwAc };

  // Arrival direction at worker: axis-aligned so the band is centred on the disc
  const isH = Math.abs(dx) / len >= 0.15;
  const anx = isH ? Math.sign(dx) : 0;   // unit arrival direction
  const any = isH ? 0 : Math.sign(dy);
  const apx = -any, apy = anx;            // arrival perpendicular

  const dB = Math.sqrt(Math.max(0, rb*rb - hwBc*hwBc));
  const B_top = { x: bx-anx*dB+apx*hwBc, y: by-any*dB+apy*hwBc };
  const B_bot = { x: bx-anx*dB-apx*hwBc, y: by-any*dB-apy*hwBc };

  // CP distances — disc-tangent smooth at hub (direct dir) and worker (arrival dir)
  const c1n_f = dA > 1 ? ra*ra/dA : len*0.40;
  const c2n_f = dB > 1 ? rb*rb/dB : len*0.40;
  const budget = len * 0.88;
  const sc = (c1n_f+c2n_f) > budget ? budget/(c1n_f+c2n_f) : 1.0;
  const c1n = Math.max(c1n_f*sc, dA+0.5);
  const c2n = Math.max(c2n_f*sc, dB+0.5);
  const k1 = hwAc > 0.5 ? (c1n-dA)/hwAc : 0;
  const k2 = hwBc > 0.5 ? (c2n-dB)/hwBc : 0;
  const c1p = Math.max(0, hwAc - k1*dA);
  const c2p = Math.max(0, hwBc - k2*dB);

  // CP1 (hub): elbow X = midX, Y from disc-tangent (approximates smooth exit)
  // CP2 (worker): full disc-tangent in arrival direction (exact smooth arrival)
  const midX = (ax + bx) * 0.5;
  const midY = (ay + by) * 0.5;
  let C1t, C2t, C1b, C2b;
  if (isH) {
    C1t = { x: midX+px*c1p,        y: ay+ny*c1n+py*c1p };
    C2t = { x: bx-anx*c2n+apx*c2p, y: by-any*c2n+apy*c2p };
    C1b = { x: midX-px*c1p,        y: ay+ny*c1n-py*c1p };
    C2b = { x: bx-anx*c2n-apx*c2p, y: by-any*c2n-apy*c2p };
  } else {
    C1t = { x: ax+nx*c1n+px*c1p, y: midY+py*c1p };
    C2t = { x: bx-anx*c2n+apx*c2p, y: midY+apy*c2p };
    C1b = { x: ax+nx*c1n-px*c1p, y: midY-py*c1p };
    C2b = { x: bx-anx*c2n-apx*c2p, y: midY-apy*c2p };
  }

  const path = new Path2D();
  path.moveTo(A_top.x, A_top.y);
  path.bezierCurveTo(C1t.x, C1t.y, C2t.x, C2t.y, B_top.x, B_top.y);
  path.lineTo(B_bot.x, B_bot.y);
  path.bezierCurveTo(C2b.x, C2b.y, C1b.x, C1b.y, A_bot.x, A_bot.y);
  path.closePath();
  return path;
}

function _drawDumbbellBand(ctx, ax, ay, ra, bx, by, rb, hwA, hwB, fillStyle) {
  const path = _dumbbellPath(ax, ay, ra, bx, by, rb, hwA, hwB);
  if (!path) return;
  ctx.fillStyle = fillStyle;
  ctx.fill(path);
}

// ─── Transparent colour helper ───────────────────────────────────────────────
// Returns the same colour at alpha=0, for smooth radial-gradient disc edges.
function _hslTransparent(color) {
  if (color.startsWith('hsl('))  return color.replace('hsl(', 'hsla(').replace(')', ',0)');
  if (color.startsWith('rgb('))  return color.replace('rgb(', 'rgba(').replace(')', ',0)');
  if (color.startsWith('#') && color.length >= 7) {
    const r = parseInt(color.slice(1,3),16), g = parseInt(color.slice(3,5),16), b = parseInt(color.slice(5,7),16);
    return `rgba(${r},${g},${b},0)`;
  }
  return 'rgba(0,0,0,0)';
}

// ─── Main renderer ────────────────────────────────────────────────────────────

export class AgentivityTeamCanvas {
  #el; #ctx; #theme;
  #team = null; #agents = {};
  #layout = {};
  #nodeColors    = new Map();  // slotId → { idle, active } color strings
  #nodeHueIndex  = new Map();  // slotId → index into SIM_HUES
  #offscreen     = null;
  #vp = { x: 0, y: 0, zoom: 1 };
  #t = 0; #raf = null;
  #drag = false; #lastPt = null; #pinch = null; #bnd = null;
  // Simulation
  #sim = false;
  #simStep  = 0;
  #simPhaseT = 0;
  #simStepDur = SIM_STEP_DUR;
  #simState = { activeSlots: new Set(), activeConns: new Set() };

  #showLogo = true;

  constructor(canvas, { theme = DARK_THEME, showLogo = true } = {}) {
    this.#el  = canvas;
    this.#ctx = canvas.getContext('2d');
    this.#theme = theme;
    this.#showLogo = showLogo;
    this.#bind();
    this.#loop();
  }

  // ── Public API ──────────────────────────────────────────────────────────────

  loadData(raw) {
    // Native format : { id, kind, entryJson: "<JSON string>" }
    // Legacy format : { team: {...}, agents: { uuid: {name} } }
    let team, agents;
    if (typeof raw.entryJson === 'string') {
      team   = JSON.parse(raw.entryJson);
      agents = {};
    } else {
      team   = raw.team;
      agents = raw.agents ?? {};
    }
    this.#team   = team;
    this.#agents = agents;
    this.#bnd    = null;
    this.#layout = computeLayout(
      team.members, team.orchestratorId,
      this.#el.width, this.#el.height,
    );
    this.#assignNodeColors(team.members);
    this.#simStep  = 0;
    this.#simPhaseT = 0;
    this.#simState = this.#sim ? _simStep(team, 0) : { activeSlots: new Set(), activeConns: new Set() };
    this.#fit();
  }

  setTheme(theme) { this.#theme = theme; if (this.#team) this.#assignNodeColors(this.#team.members); }
  fitViewport()   { this.#fit(); }

  /** Enable/disable simulation. When enabled, the canvas drives a step-by-step
   *  state machine that shows which agent is working and which band is active. */
  set simulate(v) {
    this.#sim = !!v;
    if (this.#team) {
      this.#simStep   = 0;
      this.#simPhaseT = 0;
      this.#simState  = this.#sim
        ? _simStep(this.#team, 0)
        : { activeSlots: new Set(), activeConns: new Set() };
    }
  }
  get simulate() { return this.#sim; }
  destroy() {
    if (this.#raf) cancelAnimationFrame(this.#raf);
    this.#unbind();
  }

  // ── Viewport fit ────────────────────────────────────────────────────────────

  #getBounds() {
    if (this.#bnd) return this.#bnd;
    const pts = Object.values(this.#layout);
    if (!pts.length) return this.#bnd = { minX:0, minY:0, maxX:800, maxY:500 };
    let [minX, minY, maxX, maxY] = [Infinity, Infinity, -Infinity, -Infinity];
    for (const p of pts) {
      minX = Math.min(minX, p.x);        minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x+NODE_W); maxY = Math.max(maxY, p.y+NODE_H);
    }
    // Expand bounds to include disc overflow
    const d = DISC_R;
    return this.#bnd = { minX: minX-d, minY: minY-d, maxX: maxX+d, maxY: maxY+d };
  }

  #fit() {
    const pad = 12, b = this.#getBounds();
    const cw = this.#el.width, ch = this.#el.height;
    const cW = b.maxX - b.minX, cH = b.maxY - b.minY;
    const zoom = Math.min((cw-pad*2)/cW, (ch-pad*2)/cH, 3.0);
    this.#vp = {
      x: cw/2 - (b.minX + cW/2) * zoom,
      y: ch/2 - (b.minY + cH/2) * zoom,
      zoom,
    };
  }

  // ── Render loop ─────────────────────────────────────────────────────────────

  #loop() {
    const tick = () => {
      this.#t += 0.01;  // ~60fps → ~0.6s/unit; used for continuous animations
      // Advance simulation step (dt ≈ 1/60 s)
      if (this.#sim && this.#team) {
        this.#simPhaseT += 1/60;
        if (this.#simPhaseT >= this.#simStepDur) {
          this.#simPhaseT -= this.#simStepDur;
          this.#simStep++;
          this.#simState = _simStep(this.#team, this.#simStep);
        }
      }
      this.#render();
      this.#raf = requestAnimationFrame(tick);
    };
    this.#raf = requestAnimationFrame(tick);
  }

  #render() {
    const ctx = this.#ctx, T = this.#theme, t = this.#t;
    const cw = this.#el.width, ch = this.#el.height;

    // Background
    ctx.fillStyle = T.canvasBg;
    ctx.fillRect(0, 0, cw, ch);

    // Dot grid (screen space)
    this.#renderGrid(ctx, cw, ch, T);

    if (!this.#team) {
      ctx.fillStyle = T.textDim; ctx.font = '13px system-ui,sans-serif';
      ctx.textAlign = 'center'; ctx.fillText('No data', cw/2, ch/2); ctx.textAlign = 'left';
      return;
    }

    // Pre-compute visual connections once per frame
    const conns = this.#buildConns();

    // Layer 1: bands + discs on OffscreenCanvas, composited at discAlpha (no stacking artefacts)
    this.#renderBackground(ctx, T, conns, t);

    ctx.save();
    ctx.translate(this.#vp.x, this.#vp.y);
    ctx.scale(this.#vp.zoom, this.#vp.zoom);

    // Layer 2: flow particles (world-space)
    this.#renderParticles(ctx, T, conns, t);
    // Layer 3: hex nodes
    this.#renderCards(ctx, T, t);

    ctx.restore();

    // HUD zoom
    ctx.font = '10px system-ui,monospace';
    ctx.fillStyle = T.textDim; ctx.textAlign = 'right'; ctx.globalAlpha = 0.35;
    ctx.fillText(`${Math.round(this.#vp.zoom*100)}%`, cw-12, ch-12);
    ctx.globalAlpha = 1; ctx.textAlign = 'left';

    // Logo watermark (espace écran, bas à gauche)
    if (this.#showLogo) {
      const img = T.isDark ? _LOGO_DARK : _LOGO_LIGHT;
      if (img.complete && img.naturalWidth > 0) {
        const logoW = 108;
        const logoH = logoW * (157.825 / 569.654);
        const margin = 14;
        ctx.globalAlpha = 0.40;
        ctx.drawImage(img, margin, ch - logoH - margin, logoW, logoH);
        ctx.globalAlpha = 1;
      }
    }
  }

  // ── Dot grid ────────────────────────────────────────────────────────────────

  #renderGrid(ctx, cw, ch, T) {
    const gs = T.gridSize;
    const ox = ((this.#vp.x % gs) + gs) % gs;
    const oy = ((this.#vp.y % gs) + gs) % gs;
    ctx.fillStyle = T.gridColor;
    for (let x = ox; x < cw; x += gs)
      for (let y = oy; y < ch; y += gs) {
        ctx.beginPath(); ctx.arc(x, y, 0.85, 0, Math.PI*2); ctx.fill();
      }
  }

  // ── Connection builder ───────────────────────────────────────────────────────
  // Returns array of { ax, ay, bx, by, color, seed, isHub? }

  #buildConns() {
    const team = this.#team, L = this.#layout, T = this.#theme;
    const members = team.members, orchId = team.orchestratorId;
    const result = [];

    const nc = pos => ({ x: pos.x + NODE_W/2, y: pos.y + NODE_H/2 });
    const col = (type) => _typeColor(type, T);

    // Real connections from JSON (handoff, sequential with data)
    const real = (team.connections ?? []).filter(c => L[c.fromSlotId] && L[c.toSlotId]);

    if (real.length > 0) {
      // Directed transitive reduction: remove A→C if A→M and M→C exist (directed).
      // Uses directed pairs only so triangles are handled correctly.
      const dirSet = new Set(real.map(c => `${c.fromSlotId}|${c.toSlotId}`));
      const isConn = (a, b) => dirSet.has(`${a}|${b}`);

      // Transitive reduction: remove A→C if A→M and M→C exist for some member M
      const reduced = real.filter(c => {
        return !members.some(m => {
          const mid = m.slotId;
          if (mid === c.fromSlotId || mid === c.toSlotId) return false;
          return isConn(c.fromSlotId, mid) && isConn(mid, c.toSlotId);
        });
      });

      reduced.forEach((c, i) => {
        const fp = nc(L[c.fromSlotId]), tp = nc(L[c.toSlotId]);
        const aActive = this.#simState.activeSlots.has(c.fromSlotId);
        const bActive = this.#simState.activeSlots.has(c.toSlotId);
        const cA = this.#nodeColors.get(c.fromSlotId) ?? { idle: T.agentColor, active: T.accent };
        const cB = this.#nodeColors.get(c.toSlotId)   ?? { idle: T.agentColor, active: T.accent };
        const connKey = `${c.fromSlotId}|${c.toSlotId}`;
        const connActive = this.#simState.activeConns.has(connKey);
        result.push({ ax: fp.x, ay: fp.y, bx: tp.x, by: tp.y,
          colorA: aActive ? cA.active : cA.idle,
          colorB: bActive ? cB.active : cB.idle,
          slotA: c.fromSlotId, slotB: c.toSlotId,
          connActive, seed: i*0.17 });
      });
      return result;
    }

    // Inferred connections
    switch (orchId) {
      case 'concurrent': {
        const src = members[0]; if (!L[src.slotId]) break;
        const sp = nc(L[src.slotId]);
        const sA = this.#simState.activeSlots.has(src.slotId);
        const cSrc = this.#nodeColors.get(src.slotId) ?? { idle: T.agentColor, active: T.accent };
        members.slice(1).forEach((m, i) => {
          const tp = L[m.slotId]; if (!tp) return;
          const tc = nc(tp);
          const sB = this.#simState.activeSlots.has(m.slotId);
          const cM = this.#nodeColors.get(m.slotId) ?? { idle: T.agentColor, active: T.accent };
          const connKey = `${src.slotId}|${m.slotId}`;
          result.push({ ax: sp.x, ay: sp.y, bx: tc.x, by: tc.y,
            colorA: sA ? cSrc.active : cSrc.idle,
            colorB: sB ? cM.active   : cM.idle,
            slotA: src.slotId, slotB: m.slotId,
            connActive: this.#simState.activeConns.has(connKey),
            seed: i*0.23, isTentacle: true });
        });
        break;
      }
      case 'manager-led':
      case 'managerLed': {
        // Org-chart hierarchy: bracket shape drawn in #renderBackground (isOrgChart flag).
        // Each conn carries manager→worker endpoints for simulation/particles.
        const mgr = members[0]; if (!L[mgr.slotId]) break;
        const workers = members.slice(1); if (!workers.length) break;
        const mgrC = nc(L[mgr.slotId]);
        const sA   = this.#simState.activeSlots.has(mgr.slotId);
        const cMgr = this.#nodeColors.get(mgr.slotId) ?? { idle: T.agentColor, active: T.accent };
        const mgrColor = sA ? cMgr.active : cMgr.idle;

        workers.forEach((m, i) => {
          const tp = L[m.slotId]; if (!tp) return;
          const tc = nc(tp);
          const sB      = this.#simState.activeSlots.has(m.slotId);
          const cM      = this.#nodeColors.get(m.slotId) ?? { idle: T.agentColor, active: T.accent };
          const connKey = `${mgr.slotId}|${m.slotId}`;
          result.push({
            ax: mgrC.x, ay: mgrC.y, bx: tc.x, by: tc.y,
            colorA: mgrColor,
            colorB: sB ? cM.active : cM.idle,
            slotA: mgr.slotId, slotB: m.slotId,
            connActive: this.#simState.activeConns.has(connKey),
            seed: i * 0.23,
            isOrgChart: true,
          });
        });
        break;
      }
      case 'group-chat':
      case 'groupChat': {
        // Ring: each node connects to the next neighbor around the circle
        members.forEach((m, i) => {
          const next = members[(i + 1) % members.length];
          const p = L[m.slotId], np = L[next.slotId]; if (!p || !np) return;
          const mc = nc(p), nextc = nc(np);
          const sA = this.#simState.activeSlots.has(m.slotId);
          const sB = this.#simState.activeSlots.has(next.slotId);
          const cM = this.#nodeColors.get(m.slotId)    ?? { idle: T.agentColor, active: T.accent };
          const cN = this.#nodeColors.get(next.slotId) ?? { idle: T.agentColor, active: T.accent };
          const connKey = `${m.slotId}|${next.slotId}`;
          result.push({ ax: mc.x, ay: mc.y, bx: nextc.x, by: nextc.y,
            colorA: sA ? cM.active : cM.idle,
            colorB: sB ? cN.active : cN.idle,
            slotA: m.slotId, slotB: next.slotId,
            connActive: this.#simState.activeConns.has(connKey),
            seed: i*0.31 });
        });
        break;
      }
    }
    return result;
  }

  // ── Background (OffscreenCanvas) ─────────────────────────────────────────────
  // All bands + discs drawn at alpha=1 on an OffscreenCanvas, then composited
  // at discAlpha in one drawImage call. No alpha-stacking artefacts, gradients work.

  #renderBackground(ctx, T, conns, t) {
    const cw = this.#el.width, ch = this.#el.height;
    const L = this.#layout, members = this.#team.members;
    if (!this.#offscreen || this.#offscreen.width !== cw || this.#offscreen.height !== ch) {
      this.#offscreen = new OffscreenCanvas(cw, ch);
    }
    const oc = this.#offscreen;
    const octx = oc.getContext('2d');
    octx.clearRect(0, 0, cw, ch);
    octx.save();
    octx.translate(this.#vp.x, this.#vp.y);
    octx.scale(this.#vp.zoom, this.#vp.zoom);

    // ── Build unified composite shape (union of all discs + bands + hub) ────
    // One Path2D → one clip region → fill inside with gradient field.
    // No separate draw passes, no alpha stacking, no visible seams.
    const shape = new Path2D();
    const addedDiscs = new Set();
    const addDisc = (cx, cy, r) => {
      const dp = new Path2D(); dp.arc(cx, cy, r, 0, Math.PI * 2, true); shape.addPath(dp);
    };
    // Standard connections: disc + dumbbell band
    for (const c of conns) {
      if (c.isOrgChart || c.isTentacle) continue;
      if (c.slotA && !addedDiscs.has(c.slotA)) { addDisc(c.ax, c.ay, DISC_R); addedDiscs.add(c.slotA); }
      if (c.slotB && !addedDiscs.has(c.slotB)) { addDisc(c.bx, c.by, DISC_R); addedDiscs.add(c.slotB); }
      const bp = _dumbbellPath(c.ax, c.ay, DISC_R, c.bx, c.by, DISC_R, BAND_HW, BAND_HW);
      if (bp) shape.addPath(bp);
    }

    // Tentacle connections (concurrent / pieuvre): curved bezier band, thick at hub, thin at tip
    for (const c of conns) {
      if (!c.isTentacle) continue;
      if (c.slotA && !addedDiscs.has(c.slotA)) { addDisc(c.ax, c.ay, DISC_R); addedDiscs.add(c.slotA); }
      if (c.slotB && !addedDiscs.has(c.slotB)) { addDisc(c.bx, c.by, DISC_R); addedDiscs.add(c.slotB); }
      const tp = _tentaclePath(c.ax, c.ay, DISC_R, c.bx, c.by, DISC_R, TENTACLE_HUB_HW, TENTACLE_TIP_HW);
      if (tp) shape.addPath(tp);
    }

    // Org-chart connections: node discs + dumbbell hierarchy (smooth bezier at every junction)
    // Layout: manager disc → tapered stem → relay disc at bus level → horizontal bus → relay disc → tapered stem → worker disc
    const orgConns = conns.filter(c => c.isOrgChart);
    if (orgConns.length > 0) {
      for (const c of orgConns) {
        if (c.slotA && !addedDiscs.has(c.slotA)) { addDisc(c.ax, c.ay, DISC_R); addedDiscs.add(c.slotA); }
        if (c.slotB && !addedDiscs.has(c.slotB)) { addDisc(c.bx, c.by, DISC_R); addedDiscs.add(c.slotB); }
      }
      const mgrX  = orgConns[0].ax, mgrY = orgConns[0].ay;
      const wy    = orgConns[0].by;
      const wxs   = orgConns.map(c => c.bx);
      const busY  = (mgrY + wy) * 0.5;
      const busR  = ORG_BUS_R;
      const hw    = ORG_STEM_HW;
      const hwb   = Math.floor(hw * 0.5);   // 50% narrower at bus junction end

      // Bus bar extent: spans manager + all workers
      const allBusX = [mgrX, ...wxs];
      const busXMin = Math.min(...allBusX), busXMax = Math.max(...allBusX);

      // Bus: flat rectangle (CCW path: down→right→up→left) + sphere at each extremity
      const busRect = new Path2D();
      busRect.moveTo(busXMin, busY - busR);
      busRect.lineTo(busXMin, busY + busR);
      busRect.lineTo(busXMax, busY + busR);
      busRect.lineTo(busXMax, busY - busR);
      busRect.closePath();
      shape.addPath(busRect);
      const addSphere = (rx) => { const dp = new Path2D(); dp.arc(rx, busY, busR, 0, Math.PI * 2, true); shape.addPath(dp); };
      addSphere(busXMin);
      if (busXMax !== busXMin) addSphere(busXMax);

      // Manager vertical stem: drawn UPWARD (bus level → manager disc) — CCW winding ✓
      const mgrStem = _dumbbellPath(mgrX, busY, busR, mgrX, mgrY, DISC_R, hwb, hw);
      if (mgrStem) shape.addPath(mgrStem);

      // Worker vertical stems: drawn UPWARD (worker disc → bus level) — CCW winding ✓
      for (const wx of wxs) {
        const wStem = _dumbbellPath(wx, wy, DISC_R, wx, busY, busR, hw, hwb);
        if (wStem) shape.addPath(wStem);
      }
    }

    for (const m of members) {
      if (addedDiscs.has(m.slotId)) continue;
      const p = L[m.slotId]; if (!p) continue;
      addDisc(p.x + NODE_W / 2, p.y + NODE_H / 2, DISC_R);
    }

    // ── Paint gradient field, then mask to shape (antialiased via destination-in) ──
    // Base fill = idle grey; each active disc centre is a coloured control point
    // painted via radial gradient on top → smooth gradient between agent colours.
    const idleColor = T.isDark ? IDLE_COLOR_DARK : IDLE_COLOR_LIGHT;
    const big = Math.max(cw, ch) * 4;
    octx.fillStyle = idleColor;
    octx.fillRect(-big, -big, big * 2, big * 2);

    // Per-node colour spotlights — idle first, active last (priority on top).
    const nodeSpots = [];
    const seenSlots = new Set();
    const pushSpot = (slotId, cx, cy) => {
      if (seenSlots.has(slotId)) return; seenSlots.add(slotId);
      const nc  = this.#nodeColors.get(slotId);
      const act = this.#simState.activeSlots.has(slotId);
      nodeSpots.push({ cx, cy, color: nc ? (act ? nc.active : nc.idle) : idleColor, act });
    };
    for (const c of conns) {
      if (c.slotA) pushSpot(c.slotA, c.ax, c.ay);
      if (c.slotB) pushSpot(c.slotB, c.bx, c.by);
    }
    for (const m of members) {
      const p = L[m.slotId]; if (!p) continue;
      pushSpot(m.slotId, p.x + NODE_W / 2, p.y + NODE_H / 2);
    }
    nodeSpots.sort((a, b) => (a.act ? 1 : 0) - (b.act ? 1 : 0));

    for (const { cx, cy, color, act } of nodeSpots) {
      if (!act) continue;  // idle already covered by base fill
      const tc   = _hslTransparent(color);
      const grad = octx.createRadialGradient(cx, cy, 0, cx, cy, DISC_R * 2.2);
      grad.addColorStop(0, color);
      grad.addColorStop(1, tc);
      octx.fillStyle = grad;
      octx.fillRect(-big, -big, big * 2, big * 2);
    }

    // Mask gradient field to shape boundary — fill() is antialiased, clip() is not.
    // fillStyle must be opaque so destination-in preserves all pixels inside the shape.
    octx.globalCompositeOperation = 'destination-in';
    octx.fillStyle = '#fff';
    octx.fill(shape, 'nonzero');
    octx.globalCompositeOperation = 'source-over';

    octx.restore();

    ctx.save();
    ctx.globalAlpha = BG_ALPHA;
    ctx.drawImage(oc, 0, 0);
    ctx.restore();
  }

  // ── Flow particles (directional, 2 per connection) ──────────────────────────

  #renderParticles(ctx, T, conns, t) {
    if (!this.#sim) return;
    const baseColor = T.isDark ? '255,255,255' : '0,0,0';
    for (const c of conns) {
      if (!c.connActive) continue;
      for (let p = 0; p < 2; p++) {
        const phase = ((t * 0.28 + c.seed + p * 0.5) % 1);
        const px = c.ax + phase*(c.bx - c.ax);
        const py = c.ay + phase*(c.by - c.ay);
        const fadeIn  = Math.min(phase * 6, 1);
        const fadeOut = Math.min((1 - phase) * 6, 1);
        const alpha = fadeIn * fadeOut * 0.85;
        if (alpha < 0.01) continue;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = `rgba(${baseColor},1)`;
        ctx.beginPath(); ctx.arc(px, py, 2.8, 0, Math.PI*2); ctx.fill();
        ctx.restore();
      }
    }
  }

  // ── Per-node color palette ───────────────────────────────────────────────────
  // Hues distributed evenly starting from iris accent ~265°.
  // Low saturation keeps it subtle; discs/bands look harmonious together.

  #assignNodeColors(members) {
    this.#nodeColors   = new Map();
    this.#nodeHueIndex = new Map();
    const isDark = this.#theme.isDark;
    members.forEach((m, i) => {
      this.#nodeHueIndex.set(m.slotId, i);
      this.#nodeColors.set(m.slotId, {
        idle:   _simColor(i, false, isDark),
        active: _simColor(i, true,  isDark),
      });
    });
  }

  // ── Node cards ───────────────────────────────────────────────────────────────

  #renderCards(ctx, T, t) {
    const L = this.#layout, members = this.#team.members, orchId = this.#team.orchestratorId;
    for (const m of members) {
      const p = L[m.slotId]; if (!p) continue;
      const isEntry  = m.slotId === this.#team.entryPointMemberId;
      const isActive = this.#simState.activeSlots.has(m.slotId);
      this.#drawHex(ctx, T, m, p.x, p.y, isEntry, orchId, isActive, t);
    }
  }

  // Vertical hexagon node (pointy top/bottom, circumradius HEX_R = 80)
  // Mirrors Flutter: HexagonShape(orientation: HexagonOrientation.vertical)
  #drawHex(ctx, T, member, x, y, isEntry, orchId, isActive = false, t = 0) {
    const nc2   = this.#nodeColors.get(member.slotId);
    const color = nc2 ? (isActive ? nc2.active : nc2.idle) : _typeColor(member.memberType, T);
    const label = this.#resolveName(member);
    const cx = x + NODE_W / 2;
    const cy = y + NODE_H / 2;

    // Active pulse: node shifts slightly up and glows
    // (no translate animation — only border changes)

    ctx.save();

    // Hex background
    ctx.fillStyle   = T.nodeBg;
    ctx.globalAlpha = 1;
    this.#hexPath(ctx, cx, cy, HEX_R);
    ctx.fill();

    // Hex border — active nodes get accent border
    ctx.strokeStyle = (isActive && this.#sim) ? T.accent
      : isEntry ? T.accent : T.nodeBorder;
    ctx.lineWidth   = (isActive && this.#sim) ? 2.0
      : isEntry ? 2.0 : T.nodeBorderW;
    ctx.globalAlpha = (isActive && this.#sim) ? 0.90
      : isEntry ? 0.75 : 0.50;
    this.#hexPath(ctx, cx, cy, HEX_R);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Icon (24×24 Material path), centred slightly above vertical centre
    {
      const icx = cx - 12;
      const icy = cy - 28;
      ctx.save();
      ctx.translate(icx, icy);
      ctx.fillStyle   = color;
      ctx.globalAlpha = (this.#sim && !isActive) ? 0.35 : 0.90;
      ctx.fill(_iconFor(member, orchId));
      ctx.restore();
    }

    // Label (up to 2 lines, centred)
    ctx.fillStyle    = T.text;
    ctx.globalAlpha  = (this.#sim && !isActive) ? 0.40 : 1;
    ctx.font         = 'bold 11px system-ui,-apple-system,sans-serif';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'top';
    this.#wrapText(ctx, label, cx, cy + 4, NODE_W - 32, 13, 2);

    // Type caption
    ctx.font        = '9px system-ui,sans-serif';
    ctx.fillStyle   = color;
    ctx.globalAlpha = 0.55;
    const cap = member.memberType.charAt(0).toUpperCase() + member.memberType.slice(1);
    ctx.fillText(cap, cx, cy + 36);
    ctx.globalAlpha = 1;

    ctx.restore();

  }

  // ── Utilities ────────────────────────────────────────────────────────────────

  // Vertical hexagon path (pointy top/bottom), circumradius r, centred at (cx,cy)
  #hexPath(ctx, cx, cy, r) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 3;  // start at top vertex
      const hx = cx + r * Math.cos(a);
      const hy = cy + r * Math.sin(a);
      if (i === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
  }

  #wrapText(ctx, text, cx, y, maxW, lh, maxLines) {
    const words = String(text ?? '').split(' ');
    let line = '', ln = 0;
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line, cx, y + ln * lh);
        if (++ln >= maxLines) { ctx.fillText('…', cx, y + ln * lh); return; }
        line = w;
      } else line = test;
    }
    if (line) ctx.fillText(line, cx, y + ln * lh);
  }

  #resolveName(member) {
    if (member.displayName) return member.displayName;
    const a = this.#agents[member.memberEntityId];
    if (a?.name) return a.name;
    return member.slotId.charAt(0).toUpperCase() + member.slotId.slice(1);
  }

  // ── Events ───────────────────────────────────────────────────────────────────

  #onWheel = e => {
    e.preventDefault();
    const rect = this.#el.getBoundingClientRect(), dpr = window.devicePixelRatio;
    const mx = (e.clientX - rect.left) * dpr, my = (e.clientY - rect.top) * dpr;
    const f = e.deltaY > 0 ? 0.9 : 1.1;
    const nz = Math.min(Math.max(this.#vp.zoom * f, 0.08), 5);
    this.#vp.x = mx - (mx - this.#vp.x) * (nz / this.#vp.zoom);
    this.#vp.y = my - (my - this.#vp.y) * (nz / this.#vp.zoom);
    this.#vp.zoom = nz;
  };
  #onDown = e => {
    this.#drag = true; this.#lastPt = { x: e.clientX, y: e.clientY };
    this.#el.setPointerCapture(e.pointerId);
  };
  #onMove = e => {
    if (!this.#drag || !this.#lastPt) return;
    const dpr = window.devicePixelRatio;
    this.#vp.x += (e.clientX - this.#lastPt.x) * dpr;
    this.#vp.y += (e.clientY - this.#lastPt.y) * dpr;
    this.#lastPt = { x: e.clientX, y: e.clientY };
  };
  #onUp = () => { this.#drag = false; this.#lastPt = null; };
  #onTouchStart = e => {
    if (e.touches.length === 2)
      this.#pinch = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
  };
  #onTouchMove = e => {
    if (e.touches.length !== 2 || this.#pinch == null) return;
    e.preventDefault();
    const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    const rect = this.#el.getBoundingClientRect(), dpr = window.devicePixelRatio;
    const px = ((e.touches[0].clientX + e.touches[1].clientX)/2 - rect.left) * dpr;
    const py = ((e.touches[0].clientY + e.touches[1].clientY)/2 - rect.top)  * dpr;
    const nz = Math.min(Math.max(this.#vp.zoom * (d / this.#pinch), 0.08), 5);
    this.#vp.x = px - (px - this.#vp.x) * (nz / this.#vp.zoom);
    this.#vp.y = py - (py - this.#vp.y) * (nz / this.#vp.zoom);
    this.#vp.zoom = nz; this.#pinch = d;
  };
  #onTouchEnd = () => { this.#pinch = null; };

  #bind() {
    const c = this.#el;
    c.addEventListener('wheel',       this.#onWheel,      { passive: false });
    c.addEventListener('pointerdown', this.#onDown);
    c.addEventListener('pointermove', this.#onMove);
    c.addEventListener('pointerup',   this.#onUp);
    c.addEventListener('touchstart',  this.#onTouchStart, { passive: true });
    c.addEventListener('touchmove',   this.#onTouchMove,  { passive: false });
    c.addEventListener('touchend',    this.#onTouchEnd);
    c.style.cursor = 'grab';
    c.addEventListener('pointerdown', () => c.style.cursor = 'grabbing');
    c.addEventListener('pointerup',   () => c.style.cursor = 'grab');
  }
  #unbind() {
    const c = this.#el;
    ['wheel','pointerdown','pointermove','pointerup','touchstart','touchmove','touchend']
      .forEach(ev => c.removeEventListener(ev, this[`#on${ev[0].toUpperCase()+ev.slice(1)}`]));
  }
}
