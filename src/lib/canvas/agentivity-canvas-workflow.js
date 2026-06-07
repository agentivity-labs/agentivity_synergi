// agentivity-canvas-workflow.js
// Rendu canvas d'un workflow Agentivity — port fidèle du WorkflowStudio Flutter.
// Aucune dépendance externe.

(function (global) {
  'use strict';

  // ── Logo Agentivity (SVG embarqué, placeholder COL remplacé au runtime) ──
  // SVG nettoyé — transform du groupe cercles appliqué directement sur cx/cy.
  // viewBox 569.654 × 157.825 (ratio ≈ 3.61:1)
  const _LOGO_SVG = `<svg viewBox="0 0 569.654 157.825" xmlns="http://www.w3.org/2000/svg"><circle cx="50.03" cy="26.11" r="5" fill="COL"/><circle cx="43.78" cy="38.61" r="5" fill="COL"/><circle cx="56.28" cy="38.61" r="5" fill="COL"/><path fill="COL" d="m 47.723438,49.108088 c -5.135996,0 -9.824356,1.26616 -14.068356,3.79883 -4.244666,2.532 -7.597927,6.08115 -10.058593,10.64648 -1.807566,3.35271 -2.951524,7.07063 -3.431641,11.1543 h 12.654297 c 0.401165,-2.18968 1.107077,-4.17814 2.119141,-5.96485 1.676,-2.96066 3.869411,-5.2069 6.580078,-6.74023 2.710666,-1.534 5.634774,-2.30078 8.773434,-2.30078 3.13867,0 6.06473,0.78418 8.77539,2.35351 2.71067,1.56934 4.90342,3.85166 6.58008,6.84766 1.676,2.996 2.51367,6.52775 2.51367,10.59375 0,4.066 -0.83767,7.61448 -2.51367,10.64648 -1.67666,3.03134 -3.86941,5.33106 -6.58008,6.90039 -2.71066,1.56934 -5.63672,2.35352 -8.77539,2.35352 -3.06733,0 -5.972747,-0.80158 -8.718747,-2.40625 -2.746667,-1.60533 -4.958765,-3.94243 -6.634765,-7.00977 -0.926026,-1.69409 -1.597139,-3.54034 -2.011719,-5.53906 H 20.237114 c 0.516924,3.88196 1.636552,7.45833 3.359375,10.72852 2.460666,4.67266 5.795239,8.312012 10.003906,10.916012 4.208667,2.60334 8.845489,3.9043 13.910153,3.9043 4.56534,0 8.6306,-0.92658 12.19727,-2.78125 3.56667,-1.85467 6.38446,-4.17308 8.45312,-6.95508 v 8.77344 h 12.30469 V 50.070978 h -12.30469 v 8.56055 c -2.06866,-2.71067 -4.83168,-4.97626 -8.29101,-6.79493 -3.46,-1.81933 -7.50982,-2.72851 -12.14649,-2.72851 z"/><path fill="COL" d="m 140.70735,58.631008 v -8.56 h 12.305 v 59.920002 q 0,8.132 -3.424,14.499 -3.424,6.366 -9.897,10.004 -6.474,3.638 -15.462,3.638 -11.984,0 -19.902,-5.618 -7.918002,-5.617 -8.988002,-15.247 h 12.091002 q 1.391,4.601 5.939,7.436 4.547,2.836 10.86,2.836 7.383,0 11.931,-4.494 4.547,-4.494 4.547,-13.054 v -9.844 q -3.103,4.173 -8.399,7.008 -5.297,2.836 -12.038,2.836 -7.704,0 -14.07,-3.905 -6.367002,-3.906 -10.058002,-10.915002 -3.692,-7.008 -3.692,-15.889 0,-8.881 3.692,-15.729 3.691,-6.848 10.058002,-10.646 6.366,-3.799 14.07,-3.799 6.848,0 12.145,2.729 5.296,2.728 8.292,6.794 z m -17.869,1.07 q -4.708,0 -8.774,2.301 -4.066,2.3 -6.58,6.741 -2.515,4.44 -2.515,10.539 0,6.099 2.515,10.7 2.514,4.601 6.634,7.009 4.119,2.407 8.72,2.407 4.708,0 8.774,-2.354 4.066,-2.354 6.581,-6.901 2.514,-4.548 2.514,-10.647 0,-6.099 -2.514,-10.593 -2.515,-4.494 -6.581,-6.848 -4.066,-2.354 -8.774,-2.354 z"/><path fill="COL" d="m 222.66935,84.097008 h -45.047 q 0.535,7.062 5.243,11.342 4.708,4.28 11.556,4.28 9.844,0 13.91,-8.239 h 13.161 q -2.675,8.132 -9.683,13.322002 -7.009,5.189 -17.388,5.189 -8.453,0 -15.14,-3.798 -6.688,-3.799 -10.487,-10.701002 -3.798,-6.901 -3.798,-15.996 0,-9.095 3.692,-15.997 3.691,-6.901 10.378,-10.646 6.688,-3.745 15.355,-3.745 8.346,0 14.873,3.638 6.527,3.638 10.165,10.218 3.638,6.581 3.638,15.141 0,3.317 -0.428,5.992 z m -12.305,-9.844 q -0.107,-6.741 -4.815,-10.807 -4.708,-4.066 -11.663,-4.066 -6.313,0 -10.807,4.013 -4.494,4.012 -5.35,10.86 z"/><path fill="COL" d="m 289.00935,74.253008 v 34.775002 h -12.091 V 76.072008 q 0,-7.918 -3.959,-12.144 -3.959,-4.227 -10.807,-4.227 -6.848,0 -10.86,4.227 -4.013,4.226 -4.013,12.144 v 32.956002 h -12.198 V 50.071008 h 12.198 v 6.741 q 2.996,-3.638 7.65,-5.671 4.655,-2.033 9.898,-2.033 6.955,0 12.466,2.889 5.51,2.889 8.613,8.56 3.103,5.671 3.103,13.696 z"/><path fill="COL" d="m 318.75535,60.022008 v 32.635 q 0,3.317 1.551,4.762 1.552,1.444 5.297,1.444 h 7.49 v 10.165002 h -9.63 q -8.239,0 -12.626,-3.852 -4.387,-3.852 -4.387,-12.519002 v -32.635 h -6.955 v -9.951 h 6.955 v -14.659 h 12.305 v 14.659 h 14.338 v 9.951 z"/><path fill="COL" d="m 342.72335,34.449008 q 0,-3.317 2.247,-5.564 2.247,-2.247 5.564,-2.247 3.21,0 5.457,2.247 2.247,2.247 2.247,5.564 0,3.317 -2.247,5.564 -2.247,2.247 -5.457,2.247 -3.317,0 -5.564,-2.247 -2.247,-2.247 -2.247,-5.564 z m 13.803,15.622 v 58.957002 h -12.198 V 50.071008 Z"/><path fill="COL" d="m 395.36735,98.114008 16.692,-48.043 h 12.947 l -22.47,58.957002 h -14.552 l -22.363,-58.957002 h 13.054 z"/><path fill="COL" d="m 432.60335,34.449008 q 0,-3.317 2.247,-5.564 2.247,-2.247 5.564,-2.247 3.21,0 5.457,2.247 2.247,2.247 2.247,5.564 0,3.317 -2.247,5.564 -2.247,2.247 -5.457,2.247 -3.317,0 -5.564,-2.247 -2.247,-2.247 -2.247,-5.564 z m 13.803,15.622 v 58.957002 h -12.198 V 50.071008 Z"/><path fill="COL" d="m 476.68735,60.022008 v 32.635 q 0,3.317 1.552,4.762 1.551,1.444 5.296,1.444 h 7.49 v 10.165002 h -9.63 q -8.239,0 -12.626,-3.852 -4.387,-3.852 -4.387,-12.519002 v -32.635 h -6.955 v -9.951 h 6.955 v -14.659 h 12.305 v 14.659 h 14.338 v 9.951 z"/><path fill="COL" d="m 555.33235,50.071008 -36.166,86.670002 h -12.626 l 11.984,-28.676 -23.219,-57.994002 h 13.589 l 16.585,44.94 17.227,-44.94 z"/></svg>`;

  function _makeLogo(color) {
    const img = new Image();
    img.src = 'data:image/svg+xml,' + encodeURIComponent(_LOGO_SVG.replace(/COL/g, color));
    return img;
  }
  // Pré-chargement au niveau module (une seule fois)
  const _LOGO_DARK  = _makeLogo('#ffffff');   // blanc sur fond sombre
  const _LOGO_LIGHT = _makeLogo('#152844');   // bleu officiel Agentivity sur fond clair

  // ── Dimensions (Flutter WorkflowNodeTheme nodeSize=168×160) ──────────────
  const NODE_W   = 168;
  const NODE_H   = 160;
  const NODE_R   = 12;    // borderRadius
  const RES_F    = 0.55;  // sizeFactor nœud resource
  const RES_R    = NODE_H * RES_F / 2;   // rayon cercle resource = 44
  const PORT_R   = 8;     // portSize/2 (portSize=16 Flutter)
  const CONN_W   = 2.0;   // épaisseur connexion data
  const RES_W    = 1.6;   // épaisseur connexion resource
  const ARROW_SZ = 10;    // demi-taille flèche

  // ── Simulation ────────────────────────────────────────────────────────────
  const SIM_STEP_DUR = 2.5;   // secondes par étape d'exécution
  const SIM_PULSE_HZ = 1.8;   // Hz du pulsing (comme Flutter _pulseAnimation)

  // Layout nœud (calqué sur WorkflowNodeTile avec contentPadding 10×12)
  const N_PAD_H  = 10;   // padding horizontal
  const N_PAD_V  = 12;   // padding vertical top
  const N_ICON_H = 86;   // hauteur zone icône (Expanded)
  const N_GAP    = 8;    // gap entre icône et texte
  const N_NAME_H = 18;   // hauteur ligne nom
  const N_TYPE_H = 14;   // hauteur ligne type
  const N_ICON_Y = N_PAD_V + N_ICON_H / 2;   // centre Y icône = 55
  const N_NAME_Y = N_PAD_V + N_ICON_H + N_GAP;  // = 106
  const N_TYPE_Y = N_NAME_Y + N_NAME_H + 2;   // = 126
  const N_ICON_SZ = 54;   // taille de l'icône dessinée

  // ── Couleurs dark / light ─────────────────────────────────────────────────
  const DARK = {
    canvas:     '#13151a',
    nodeBg:     '#1d2029',
    nodeBgRes:  '#1a2028',
    border:     '#303d50',
    text:       '#dde6f0',
    textSub:    '#6a7f96',
    connData:   '#3d5068',
    connRes:    '#2d5e42',
    portFill:   '#253545',
    portStroke: '#3a5060',
    annotText:  0.9,    // alpha multiplicateur
    grid:       'rgba(255,255,255,0.035)',
  };
  const LIGHT = {
    canvas:     '#eff1f5',
    nodeBg:     '#ffffff',
    nodeBgRes:  '#f8fafc',
    border:     '#b0c0cc',
    text:       '#1a202c',
    textSub:    '#607080',
    connData:   '#7090a8',
    connRes:    '#3a7850',
    portFill:   '#d0e0e8',
    portStroke: '#98b0bc',
    annotText:  1.0,
    grid:       'rgba(0,0,0,0.04)',
  };

  // ── Couleur d'accent par catégorie (une seule couleur, comme la couleur serveur Flutter) ──
  const CAT = {
    ai:          '#5b55e8',
    imagegen:    '#e05530',
    content:     '#8b5cf6',
    seo:         '#0891b2',
    storage:     '#d97706',
    web:         '#10b981',
    core:        '#64748b',
    foreach:     '#6366f1',
    layout:      '#ec4899',
    wordpress:   '#3b82f6',
    app:         '#3b82f6',
    interaction: '#14b8a6',
    default:     '#64748b',
  };

  function nodeCategory(t) {
    if (t.startsWith('ai.'))               return 'ai';
    if (t.startsWith('imagegen.'))         return 'imagegen';
    if (t.startsWith('content.'))          return 'content';
    if (t.startsWith('seo.'))              return 'seo';
    if (t.startsWith('storage.'))          return 'storage';
    if (t.startsWith('web.'))              return 'web';
    if (t.startsWith('core.foreach'))      return 'foreach';
    if (t.startsWith('core.'))             return 'core';
    if (t.startsWith('layout.'))           return 'layout';
    if (t.startsWith('app.cms.wordpress')) return 'wordpress';
    if (t.startsWith('wordpress.'))        return 'wordpress';
    if (t.startsWith('app.'))             return 'app';
    if (t.startsWith('interaction.'))      return 'interaction';
    return 'default';
  }
  function catColor(t) { return CAT[nodeCategory(t)] ?? CAT.default; }

  // ── Icônes dessinées en canvas ────────────────────────────────────────────
  // Chaque fonction : drawIcon(ctx, cx, cy, sz, color)
  // sz = taille totale en unités graphe (≈54)

  function iconAI(ctx, cx, cy, sz, col) {
    // Réseau de neurones : hexagone + 6 branches
    const r = sz * 0.38, nr = sz * 0.10, br = sz * 0.06;
    const lw = sz * 0.07;
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw;
    // Branches
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI / 3) - Math.PI / 6;
      const ox = cx + r * Math.cos(a), oy = cy + r * Math.sin(a);
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ox, oy); ctx.stroke();
      ctx.beginPath(); ctx.arc(ox, oy, br, 0, Math.PI * 2); ctx.fill();
    }
    // Hexagone
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI / 3) - Math.PI / 6;
      ctx[i === 0 ? 'moveTo' : 'lineTo'](cx + r * Math.cos(a), cy + r * Math.sin(a));
    }
    ctx.closePath(); ctx.stroke();
    // Nœud central
    ctx.beginPath(); ctx.arc(cx, cy, nr, 0, Math.PI * 2); ctx.fill();
  }

  function iconImagegen(ctx, cx, cy, sz, col) {
    // Cadre photo + montagne + soleil
    const w = sz * 0.8, h = sz * 0.65, x = cx - w / 2, y = cy - h / 2;
    const lw = sz * 0.07;
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw;
    // Cadre
    roundRectPath(ctx, x, y, w, h, sz * 0.06); ctx.stroke();
    // Montagne
    ctx.beginPath();
    ctx.moveTo(x + w * 0.12, y + h * 0.88);
    ctx.lineTo(x + w * 0.42, y + h * 0.40);
    ctx.lineTo(x + w * 0.62, y + h * 0.62);
    ctx.lineTo(x + w * 0.78, y + h * 0.35);
    ctx.lineTo(x + w * 0.90, y + h * 0.88);
    ctx.closePath(); ctx.lineWidth = lw * 0.7; ctx.stroke();
    // Soleil
    ctx.beginPath();
    ctx.arc(x + w * 0.25, y + h * 0.28, sz * 0.09, 0, Math.PI * 2); ctx.fill();
  }

  function iconContent(ctx, cx, cy, sz, col) {
    // Document avec coin plié + lignes de texte
    const w = sz * 0.65, h = sz * 0.82, x = cx - w / 2, y = cy - h / 2;
    const fold = w * 0.26;
    const lw = sz * 0.07;
    ctx.strokeStyle = col; ctx.lineWidth = lw;
    // Contour document
    ctx.beginPath();
    ctx.moveTo(x, y); ctx.lineTo(x + w - fold, y);
    ctx.lineTo(x + w, y + fold); ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h); ctx.closePath(); ctx.stroke();
    // Coin plié
    ctx.beginPath();
    ctx.moveTo(x + w - fold, y);
    ctx.lineTo(x + w - fold, y + fold);
    ctx.lineTo(x + w, y + fold); ctx.stroke();
    // Lignes texte
    ctx.lineWidth = lw * 0.75;
    const lx1 = x + w * 0.16, lx2 = x + w * 0.84, lx3 = x + w * 0.60;
    for (let i = 0; i < 3; i++) {
      const ly = y + h * 0.40 + i * h * 0.17;
      ctx.beginPath();
      ctx.moveTo(lx1, ly);
      ctx.lineTo(i === 2 ? lx3 : lx2, ly); ctx.stroke();
    }
  }

  function iconSEO(ctx, cx, cy, sz, col) {
    // Loupe
    const r = sz * 0.28, lw = sz * 0.08;
    const ox = cx - sz * 0.06, oy = cy - sz * 0.06;
    ctx.strokeStyle = col; ctx.lineWidth = lw;
    ctx.beginPath(); ctx.arc(ox, oy, r, 0, Math.PI * 2); ctx.stroke();
    // Manche
    ctx.beginPath();
    const a = Math.PI * 0.75;
    ctx.moveTo(ox + r * Math.cos(a), oy + r * Math.sin(a));
    ctx.lineTo(cx + sz * 0.30, cy + sz * 0.30);
    ctx.lineWidth = lw * 1.4; ctx.stroke();
  }

  function iconStorage(ctx, cx, cy, sz, col) {
    // Pile de cylindres DB
    const rx = sz * 0.36, ry = sz * 0.11, gap = sz * 0.22;
    const lw = sz * 0.07;
    ctx.strokeStyle = col; ctx.lineWidth = lw;
    for (let i = 0; i < 3; i++) {
      const ycyl = cy - sz * 0.28 + i * gap;
      ctx.beginPath(); ctx.ellipse(cx, ycyl, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
      if (i < 2) {
        ctx.beginPath();
        ctx.moveTo(cx - rx, ycyl); ctx.lineTo(cx - rx, ycyl + gap);
        ctx.moveTo(cx + rx, ycyl); ctx.lineTo(cx + rx, ycyl + gap);
        ctx.stroke();
      }
    }
  }

  function iconWeb(ctx, cx, cy, sz, col) {
    // Globe : cercle + méridiens + parallèles
    const r = sz * 0.38, lw = sz * 0.07;
    ctx.strokeStyle = col; ctx.lineWidth = lw;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    // Méridien central
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 0.5, r, 0, 0, Math.PI * 2); ctx.stroke();
    // Parallèles
    for (const frac of [0.38, -0.38]) {
      const py2 = cy + frac * r;
      const pr  = Math.sqrt(r * r - (frac * r) * (frac * r));
      ctx.beginPath();
      ctx.ellipse(cx, py2, pr, pr * 0.18, 0, 0, Math.PI * 2); ctx.stroke();
    }
    // Équateur
    ctx.beginPath();
    ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy); ctx.stroke();
  }

  function iconCore(ctx, cx, cy, sz, col) {
    // Engrenage
    const r = sz * 0.34, ir = sz * 0.17, teeth = 7, lw = sz * 0.07;
    const tr = sz * 0.10, ta = (Math.PI * 2 / teeth);
    ctx.strokeStyle = col; ctx.lineWidth = lw;
    ctx.beginPath();
    for (let i = 0; i < teeth; i++) {
      const a0 = ta * i - Math.PI / 2;
      const a1 = a0 + ta * 0.35, a2 = a0 + ta * 0.65;
      ctx.lineTo(cx + r * Math.cos(a0 - ta * 0.18), cy + r * Math.sin(a0 - ta * 0.18));
      ctx.lineTo(cx + (r + tr) * Math.cos(a1 - ta * 0.1), cy + (r + tr) * Math.sin(a1 - ta * 0.1));
      ctx.lineTo(cx + (r + tr) * Math.cos(a2 + ta * 0.1), cy + (r + tr) * Math.sin(a2 + ta * 0.1));
      ctx.lineTo(cx + r * Math.cos(a2 + ta * 0.18), cy + r * Math.sin(a2 + ta * 0.18));
    }
    ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, ir, 0, Math.PI * 2); ctx.stroke();
  }

  function iconForeach(ctx, cx, cy, sz, col) {
    // Flèches circulaires (boucle)
    const r = sz * 0.34, lw = sz * 0.08, aw = sz * 0.12;
    ctx.strokeStyle = col; ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI * 0.15, Math.PI * 1.85); ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI * 1.15, Math.PI * 2.85); ctx.stroke();
    // Flèches
    const drawTip = (ax, ay, angle) => {
      ctx.save(); ctx.translate(ax, ay); ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(-aw, -aw * 0.5); ctx.lineTo(-aw, aw * 0.5);
      ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.restore();
    };
    drawTip(cx + r, cy + sz * 0.05, -Math.PI * 0.3);
    drawTip(cx - r, cy - sz * 0.05, Math.PI * 0.7);
  }

  function iconLayout(ctx, cx, cy, sz, col) {
    // Grille de blocs (layout page)
    const lw = sz * 0.065;
    ctx.strokeStyle = col; ctx.lineWidth = lw;
    const bw = sz * 0.70, bh = sz * 0.78, x = cx - bw / 2, y = cy - bh / 2;
    roundRectPath(ctx, x, y, bw, bh * 0.30, sz * 0.05); ctx.stroke();
    roundRectPath(ctx, x, y + bh * 0.36, bw * 0.44, bh * 0.60, sz * 0.05); ctx.stroke();
    roundRectPath(ctx, x + bw * 0.52, y + bh * 0.36, bw * 0.48, bh * 0.60, sz * 0.05); ctx.stroke();
  }

  function iconWordpress(ctx, cx, cy, sz, col) {
    // Cercle + lettre W
    const r = sz * 0.38, lw = sz * 0.07;
    ctx.strokeStyle = col; ctx.lineWidth = lw;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    // W
    const ww = r * 1.05, wh = r * 0.80;
    const wx = cx - ww / 2, wy = cy - wh / 2;
    ctx.beginPath();
    ctx.moveTo(wx, wy);
    ctx.lineTo(wx + ww * 0.20, wy + wh);
    ctx.lineTo(cx, wy + wh * 0.40);
    ctx.lineTo(wx + ww * 0.80, wy + wh);
    ctx.lineTo(wx + ww, wy);
    ctx.lineWidth = lw * 1.3; ctx.stroke();
  }

  function iconInteraction(ctx, cx, cy, sz, col) {
    // Formulaire : rectangle + lignes + case à cocher
    const w = sz * 0.72, h = sz * 0.78, x = cx - w / 2, y = cy - h / 2;
    const lw = sz * 0.07;
    ctx.strokeStyle = col; ctx.lineWidth = lw;
    roundRectPath(ctx, x, y, w, h, sz * 0.06); ctx.stroke();
    // Case à cocher
    const cbsz = sz * 0.15, cbx = x + sz * 0.10, cby = y + h * 0.17;
    roundRectPath(ctx, cbx, cby, cbsz, cbsz, sz * 0.03); ctx.stroke();
    ctx.beginPath(); // coche
    ctx.moveTo(cbx + cbsz * 0.18, cby + cbsz * 0.52);
    ctx.lineTo(cbx + cbsz * 0.42, cby + cbsz * 0.80);
    ctx.lineTo(cbx + cbsz * 0.85, cby + cbsz * 0.18);
    ctx.lineWidth = lw * 0.85; ctx.stroke();
    // Lignes texte
    ctx.lineWidth = lw * 0.75;
    const lx1 = cbx + cbsz + sz * 0.08, lx2 = x + w - sz * 0.10;
    const lys = [cby + cbsz * 0.50, y + h * 0.45, y + h * 0.64, y + h * 0.83];
    for (let i = 0; i < lys.length; i++) {
      ctx.beginPath();
      ctx.moveTo(i === 0 ? lx1 : cbx, lys[i]);
      ctx.lineTo(i < 2 ? lx2 : lx2 * 0.80 + cbx * 0.20, lys[i]); ctx.stroke();
    }
  }

  function iconApp(ctx, cx, cy, sz, col) {
    // Fenêtre app
    const w = sz * 0.72, h = sz * 0.78, x = cx - w / 2, y = cy - h / 2;
    const lw = sz * 0.07, barH = h * 0.22;
    ctx.strokeStyle = col; ctx.lineWidth = lw;
    roundRectPath(ctx, x, y, w, h, sz * 0.07); ctx.stroke();
    // Barre de titre
    ctx.beginPath();
    ctx.moveTo(x, y + barH); ctx.lineTo(x + w, y + barH); ctx.stroke();
    // Boutons dans la barre
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(x + sz * 0.12 + i * sz * 0.16, y + barH / 2, sz * 0.05, 0, Math.PI * 2);
      ctx.fillStyle = col; ctx.fill();
    }
    // Grille de contenu (4 cases)
    const cw2 = (w - sz * 0.12) / 2, ch2 = (h - barH - sz * 0.12) / 2;
    for (let r2 = 0; r2 < 2; r2++) {
      for (let c2 = 0; c2 < 2; c2++) {
        roundRectPath(
          ctx,
          x + sz * 0.06 + c2 * (cw2 + sz * 0.06),
          y + barH + sz * 0.06 + r2 * (ch2 + sz * 0.06),
          cw2, ch2, sz * 0.04,
        );
        ctx.lineWidth = lw * 0.6; ctx.stroke();
      }
    }
  }

  function iconDefault(ctx, cx, cy, sz, col) {
    // Diamant générique
    ctx.strokeStyle = col; ctx.lineWidth = sz * 0.08;
    const r = sz * 0.38;
    ctx.beginPath();
    ctx.moveTo(cx, cy - r); ctx.lineTo(cx + r, cy);
    ctx.lineTo(cx, cy + r); ctx.lineTo(cx - r, cy);
    ctx.closePath(); ctx.stroke();
  }

  const ICON_DRAWERS = {
    ai:          iconAI,
    imagegen:    iconImagegen,
    content:     iconContent,
    seo:         iconSEO,
    storage:     iconStorage,
    web:         iconWeb,
    core:        iconCore,
    foreach:     iconForeach,
    layout:      iconLayout,
    wordpress:   iconWordpress,
    app:         iconApp,
    interaction: iconInteraction,
    default:     iconDefault,
  };

  function drawNodeIcon(ctx, nodeType, cx, cy, sz, col) {
    const cat = nodeCategory(nodeType);
    const fn  = ICON_DRAWERS[cat] ?? ICON_DRAWERS.default;
    ctx.save();
    fn(ctx, cx, cy, sz, col);
    ctx.restore();
  }

  // ── Helpers géométrie ─────────────────────────────────────────────────────

  function roundRectPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y,     x + w, y + r,     r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h,     x, y + h - r,     r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y,         x + r, y,         r);
    ctx.closePath();
  }

  function diamondPath(ctx, cx, cy, s) {
    ctx.beginPath();
    ctx.moveTo(cx,     cy - s);
    ctx.lineTo(cx + s, cy);
    ctx.lineTo(cx,     cy + s);
    ctx.lineTo(cx - s, cy);
    ctx.closePath();
  }

  function drawArrow(ctx, x, y, angle, size, color) {
    ctx.save();
    ctx.translate(x, y); ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-size * 0.85, -size * 0.48);
    ctx.lineTo(-size * 0.85,  size * 0.48);
    ctx.closePath();
    ctx.fillStyle = color; ctx.fill();
    ctx.restore();
  }

  function ellipsis(ctx, text, maxW) {
    if (ctx.measureText(text).width <= maxW) return text;
    let t = text;
    while (t.length > 1 && ctx.measureText(t + '…').width > maxW) t = t.slice(0, -1);
    return t + '…';
  }

  // Texte wrappé sur plusieurs lignes (retourne tableau de lignes)
  function wrapText(ctx, text, maxW) {
    const words = text.split(' ');
    const lines = [];
    let cur = '';
    for (const w of words) {
      const test = cur ? cur + ' ' + w : w;
      if (ctx.measureText(test).width > maxW && cur) {
        lines.push(cur);
        cur = w;
      } else {
        cur = test;
      }
    }
    if (cur) lines.push(cur);
    return lines;
  }

  // ── Port offset formulas (GraphDataBuilder.dart) ──────────────────────────

  function verticalPortOffset(idx, total, H) {
    if (total <= 0) return 0;
    if (total === 1) return H / 2;
    const margin = total <= 2 ? H * 0.35 : H * 0.15;
    const span   = H - 2 * margin;
    return margin + (span / (total - 1)) * idx + PORT_R / 2;
  }

  function horizontalPortOffset(idx, total, W) {
    if (total <= 0) return 0;
    if (total === 1) return W / 2 + PORT_R / 2;
    const margin = total <= 2 ? W * 0.35 : W * 0.15;
    const span   = W - 2 * margin;
    return margin + (span / (total - 1)) * idx + PORT_R / 2;
  }

  // ── Classe principale ─────────────────────────────────────────────────────

  class AgentivityWorkflowCanvas {
    #canvas;
    #ctx;
    #workflow;
    #isDark;
    #T;
    #viewport;

    #nodes       = [];
    #conns       = [];
    #annotations = [];

    #isPanning   = false;
    #panStart    = { x: 0, y: 0 };
    #panVp       = { x: 0, y: 0, zoom: 1 };
    #rafPending  = false;

    #showLogo  = true;

    // Simulation
    #sim       = false;
    #simT      = 0;        // temps absolu animation (s)
    #simStep   = 0;        // indice de l'étape courante
    #simPhaseT = 0;        // temps écoulé dans l'étape
    #simPlan   = [];       // Array<Set<nodeId>> — niveaux topologiques
    #simResMap = new Map(); // stdNodeId → Set<resourceNodeId>
    #simRaf    = null;

    constructor(canvas, workflow, options = {}) {
      this.#canvas   = canvas;
      this.#ctx      = canvas.getContext('2d');
      this.#workflow = workflow;
      this.#isDark   = options.darkMode !== false;
      this.#T        = this.#isDark ? DARK : LIGHT;
      this.#showLogo = options.showLogo !== false;

      this.#viewport = { x: 0, y: 0, zoom: 1 };

      this.#preprocess();
      this.#setupInteraction();
      this.fitToScreen();
    }

    // ── Prétraitement ──────────────────────────────────────────────────────

    #preprocess() {
      const wf    = this.#workflow;
      const nodes = wf.nodes       ?? [];
      const conns = wf.connections ?? [];
      const annots= wf.annotations ?? [];

      // Identifier nœuds resource
      const resourceIds = new Set();
      for (const c of conns) {
        if (c.fromPort === 'resource') resourceIds.add(c.from);
      }

      // Listes de ports par nœud
      const dataIn  = {};
      const dataOut = {};
      const resIn   = {};
      for (const n of nodes) {
        dataIn[n.id]  = new Set();
        dataOut[n.id] = new Set();
        resIn[n.id]   = new Set();
      }
      for (const c of conns) {
        if (c.fromPort === 'resource') {
          resIn[c.to]?.add(c.toPort || 'in');
        } else {
          dataOut[c.from]?.add(c.fromPort || 'out');
          dataIn[c.to]?.add(c.toPort     || 'in');
        }
      }

      // ── Tri des ports par position spatiale du nœud connecté ───────────────
      // Principe : si le nœud source/cible est à gauche (X faible) ou en haut
      // (Y faible), son port doit apparaître en premier. Cela minimise les
      // croisements de connexions sans avoir besoin des métadonnées du catalogue.

      // Lookup de position rapide
      const posLookup = {};
      for (const n of nodes) posLookup[n.id] = { x: n.position.x, y: n.position.y };

      // Accumulateur : pour chaque (nodeId, portId), on collecte la position
      // moyenne des nœuds connectés selon l'axe pertinent.
      const riX  = {};  // resource inputs  → moyenne X source
      const diY  = {};  // data inputs      → moyenne Y source
      const doY  = {};  // data outputs     → moyenne Y cible

      const acc = (map, key, val) => {
        if (!map[key]) map[key] = { sum: 0, n: 0 };
        map[key].sum += val; map[key].n++;
      };
      const avg = (map, key) => { const e = map[key]; return e ? e.sum / e.n : 0; };

      for (const c of conns) {
        const sp = posLookup[c.from], dp = posLookup[c.to];
        if (!sp || !dp) continue;
        const fp = c.fromPort || 'out', tp = c.toPort || 'in';
        if (c.fromPort === 'resource') {
          acc(riX, `${c.to}.${tp}`, sp.x);        // port bas → trié par X source
        } else {
          acc(doY, `${c.from}.${fp}`, dp.y);       // port droit → trié par Y cible
          acc(diY, `${c.to}.${tp}`,   sp.y);       // port gauche → trié par Y source
        }
      }

      const sortByPos = (nodeId, portSet, map) =>
        [...portSet].sort((a, b) => avg(map, `${nodeId}.${a}`) - avg(map, `${nodeId}.${b}`));

      this.#nodes = nodes.map(n => {
        const isRes = resourceIds.has(n.id);
        const name  = [n.metadata?.label, n.metadata?.name, n.metadata?.displayName, n.id]
          .find(v => v && v.trim()) || n.id;
        return {
          id:          n.id,
          nodeType:    n.nodeType,
          x:           n.position.x,
          y:           n.position.y,
          zIndex:      n.zIndex ?? 0,
          isResource:  isRes,
          dataInputs:  sortByPos(n.id, dataIn[n.id],  diY),
          dataOutputs: sortByPos(n.id, dataOut[n.id], doY),
          resInputs:   sortByPos(n.id, resIn[n.id],   riX),
          displayName: name,
        };
      });

      const nodeMap = {};
      for (const n of this.#nodes) nodeMap[n.id] = n;

      const portPos = (nodeId, portId, isOutput, isResPort) => {
        const n = nodeMap[nodeId];
        if (!n) return null;
        if (n.isResource) return { x: n.x + NODE_W / 2, y: n.y };
        if (isResPort) {
          const idx  = n.resInputs.indexOf(portId);
          const tot  = n.resInputs.length || 1;
          return { x: n.x + horizontalPortOffset(idx < 0 ? 0 : idx, tot, NODE_W), y: n.y + NODE_H };
        }
        if (isOutput) {
          const idx  = n.dataOutputs.indexOf(portId);
          const tot  = n.dataOutputs.length || 1;
          return { x: n.x + NODE_W, y: n.y + verticalPortOffset(idx < 0 ? 0 : idx, tot, NODE_H) };
        }
        const idx  = n.dataInputs.indexOf(portId);
        const tot  = n.dataInputs.length || 1;
        return { x: n.x, y: n.y + verticalPortOffset(idx < 0 ? 0 : idx, tot, NODE_H) };
      };

      this.#conns = conns.map((c, i) => {
        const isRes = c.fromPort === 'resource';
        if (!nodeMap[c.from] || !nodeMap[c.to]) return null;
        return {
          id:         i,
          fromId:     c.from,
          toId:       c.to,
          isResource: isRes,
          src: isRes
            ? { x: nodeMap[c.from].x + NODE_W / 2, y: nodeMap[c.from].y }
            : portPos(c.from, c.fromPort || 'out', true, false),
          dst: isRes
            ? portPos(c.to, c.toPort || 'in', false, true)
            : portPos(c.to, c.toPort  || 'in', false, false),
        };
      }).filter(Boolean);

      this.#annotations = annots.map(a => ({
        id:      a.id,
        x:       a.position.x, y: a.position.y,
        w:       a.size.width,  h: a.size.height,
        color:   a.color   || '#334155',
        content: a.content || '',
        zIndex:  a.zIndex  ?? -1,
      }));
    }

    // ── Simulation ────────────────────────────────────────────────────────

    /** Construit le plan d'exécution par tri topologique (Kahn) sur les nœuds standard. */
    #buildSimPlan() {
      const rawConns    = this.#workflow.connections ?? [];
      const standardNds = this.#nodes.filter(n => !n.isResource);
      const stdIds      = new Set(standardNds.map(n => n.id));

      // Carte nœud standard → ressources qui y sont connectées
      const resMap = new Map();
      for (const n of standardNds) resMap.set(n.id, new Set());
      for (const c of rawConns) {
        if (c.fromPort === 'resource' && stdIds.has(c.to)) {
          resMap.get(c.to)?.add(c.from);
        }
      }
      this.#simResMap = resMap;

      // Kahn : in-degree et adjacence sur les nœuds standard uniquement
      const inDeg = new Map();
      const adj   = new Map();
      for (const n of standardNds) { inDeg.set(n.id, 0); adj.set(n.id, []); }
      for (const c of rawConns) {
        if (c.fromPort === 'resource') continue;
        if (!stdIds.has(c.from) || !stdIds.has(c.to)) continue;
        inDeg.set(c.to, (inDeg.get(c.to) || 0) + 1);
        adj.get(c.from)?.push(c.to);
      }

      const plan  = [];
      let   queue = standardNds.filter(n => inDeg.get(n.id) === 0).map(n => n.id);
      while (queue.length > 0) {
        plan.push(new Set(queue));
        const next = [];
        for (const id of queue) {
          for (const tgt of (adj.get(id) ?? [])) {
            inDeg.set(tgt, inDeg.get(tgt) - 1);
            if (inDeg.get(tgt) === 0) next.push(tgt);
          }
        }
        queue = next;
      }
      // Fallback si graphe vide ou cyclique : activer tous les nœuds ensemble
      this.#simPlan = plan.length ? plan : [new Set(standardNds.map(n => n.id))];
    }

    #startSimLoop() {
      let lastTs = null;
      const tick = (now) => {
        if (!this.#sim) return;
        // Cap dt à 50 ms : évite l'emballement après un passage en arrière-plan
        // (l'onglet en background suspend RAF → now-lastTs peut être énorme au retour)
        const dt = lastTs !== null ? Math.min((now - lastTs) / 1000, 0.05) : 0;
        lastTs = now;
        this.#simT      += dt;
        this.#simPhaseT += dt;
        // while (pas if) : absorbe correctement si dt > SIM_STEP_DUR après le cap
        while (this.#simPlan.length > 0 && this.#simPhaseT >= SIM_STEP_DUR) {
          this.#simPhaseT -= SIM_STEP_DUR;
          this.#simStep    = (this.#simStep + 1) % this.#simPlan.length;
        }
        this.#render();
        this.#simRaf = requestAnimationFrame(tick);
      };
      this.#simRaf = requestAnimationFrame(tick);
    }

    #stopSimLoop() {
      if (this.#simRaf !== null) { cancelAnimationFrame(this.#simRaf); this.#simRaf = null; }
    }

    // ── Interaction ────────────────────────────────────────────────────────

    #setupInteraction() {
      const cv = this.#canvas;

      cv.addEventListener('wheel', e => {
        e.preventDefault();
        const rect = cv.getBoundingClientRect();
        const mx   = (e.clientX - rect.left) * (cv.width  / rect.width);
        const my   = (e.clientY - rect.top)  * (cv.height / rect.height);
        const fac  = e.deltaY < 0 ? 1.1 : 1 / 1.1;
        const vp   = this.#viewport;
        const nz   = Math.min(4, Math.max(0.05, vp.zoom * fac));
        const sc   = nz / vp.zoom;
        this.#viewport = { x: mx - sc * (mx - vp.x), y: my - sc * (my - vp.y), zoom: nz };
        this.#scheduleRender();
      }, { passive: false });

      cv.addEventListener('mousedown', e => {
        if (e.button !== 0) return;
        this.#isPanning = true;
        this.#panStart  = { x: e.clientX, y: e.clientY };
        this.#panVp     = { ...this.#viewport };
        cv.style.cursor = 'grabbing';
      });

      const scaleXY = () => {
        const r = cv.getBoundingClientRect();
        return { sx: cv.width / r.width, sy: cv.height / r.height };
      };

      window.addEventListener('mousemove', e => {
        if (!this.#isPanning) return;
        const { sx, sy } = scaleXY();
        this.#viewport = {
          x:    this.#panVp.x + (e.clientX - this.#panStart.x) * sx,
          y:    this.#panVp.y + (e.clientY - this.#panStart.y) * sy,
          zoom: this.#panVp.zoom,
        };
        this.#scheduleRender();
      });

      window.addEventListener('mouseup', () => {
        this.#isPanning = false;
        cv.style.cursor = 'grab';
      });

      // Touch
      let td = null, tm = null;
      cv.addEventListener('touchstart', e => {
        if (e.touches.length === 1) {
          this.#isPanning = true;
          this.#panStart  = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          this.#panVp     = { ...this.#viewport };
        } else if (e.touches.length === 2) {
          this.#isPanning = false;
          td = Math.hypot(e.touches[1].clientX - e.touches[0].clientX, e.touches[1].clientY - e.touches[0].clientY);
          tm = { x: (e.touches[0].clientX + e.touches[1].clientX) / 2, y: (e.touches[0].clientY + e.touches[1].clientY) / 2 };
        }
        e.preventDefault();
      }, { passive: false });

      cv.addEventListener('touchmove', e => {
        e.preventDefault();
        if (e.touches.length === 1 && this.#isPanning) {
          const { sx, sy } = scaleXY();
          this.#viewport = {
            x:    this.#panVp.x + (e.touches[0].clientX - this.#panStart.x) * sx,
            y:    this.#panVp.y + (e.touches[0].clientY - this.#panStart.y) * sy,
            zoom: this.#panVp.zoom,
          };
          this.#scheduleRender();
        } else if (e.touches.length === 2 && td !== null) {
          const nd  = Math.hypot(e.touches[1].clientX - e.touches[0].clientX, e.touches[1].clientY - e.touches[0].clientY);
          const rect = cv.getBoundingClientRect();
          const mx  = (tm.x - rect.left) * (cv.width / rect.width);
          const my  = (tm.y - rect.top)  * (cv.height / rect.height);
          const sc  = nd / td;
          const vp  = this.#viewport;
          const nz  = Math.min(4, Math.max(0.05, vp.zoom * sc));
          const r   = nz / vp.zoom;
          this.#viewport = { x: mx - r * (mx - vp.x), y: my - r * (my - vp.y), zoom: nz };
          td = nd; this.#scheduleRender();
        }
      }, { passive: false });

      cv.addEventListener('touchend', () => { this.#isPanning = false; td = null; });
      cv.style.cursor = 'grab';
    }

    #scheduleRender() {
      if (this.#rafPending) return;
      this.#rafPending = true;
      requestAnimationFrame(() => { this.#rafPending = false; this.#render(); });
    }

    // ── Rendu ──────────────────────────────────────────────────────────────

    #render() {
      const cv   = this.#canvas;
      const ctx  = this.#ctx;
      const { x: px, y: py, zoom } = this.#viewport;
      const T    = this.#T;

      ctx.resetTransform();
      ctx.fillStyle = T.canvas;
      ctx.fillRect(0, 0, cv.width, cv.height);

      this.#drawGrid(ctx, cv.width, cv.height, px, py, zoom);

      ctx.setTransform(zoom, 0, 0, zoom, px, py);

      // 1. Annotations (arrière-plan)
      const sortedA = [...this.#annotations].sort((a, b) => a.zIndex - b.zIndex);
      for (const a of sortedA) this.#drawAnnotation(ctx, a, zoom);

      // État de simulation (null si inactif)
      let simInfo = null;
      if (this.#sim && this.#simPlan.length > 0) {
        const pulse     = 0.5 + 0.5 * Math.sin(this.#simT * 2 * Math.PI * SIM_PULSE_HZ);
        const activeStd = this.#simPlan[this.#simStep] || new Set();
        const activeRes = new Set();
        for (const [stdId, resSet] of this.#simResMap) {
          if (activeStd.has(stdId)) for (const r of resSet) activeRes.add(r);
        }
        simInfo = { pulse, activeStd, activeRes };
      }

      // 2. Connexions
      for (const c of this.#conns) this.#drawConnection(ctx, c, zoom, simInfo);

      // 3. Nœuds
      const sortedN = [...this.#nodes].sort((a, b) => a.zIndex - b.zIndex);
      for (const n of sortedN) {
        if (n.isResource) this.#drawResourceNode(ctx, n, simInfo);
        else              this.#drawStandardNode(ctx, n, simInfo);
      }

      // 4. Logo watermark (espace écran)
      if (this.#showLogo) {
        const img = this.#isDark ? _LOGO_DARK : _LOGO_LIGHT;
        if (img.complete && img.naturalWidth > 0) {
          const logoW = 108;                            // px écran
          const logoH = logoW * (157.825 / 569.654);   // ≈ 30px
          const margin = 14;
          ctx.resetTransform();
          ctx.globalAlpha = 0.40;
          ctx.drawImage(img, margin, cv.height - logoH - margin, logoW, logoH);
          ctx.globalAlpha = 1;
        }
      }
    }

    // ── Grille ────────────────────────────────────────────────────────────

    #drawGrid(ctx, cw, ch, px, py, zoom) {
      const gsz = 24 * zoom;
      if (gsz < 5) return;
      const ox  = ((px % gsz) + gsz) % gsz;
      const oy  = ((py % gsz) + gsz) % gsz;
      const dr  = Math.min(1.1, zoom * 0.55);
      ctx.save(); ctx.resetTransform();
      ctx.fillStyle = this.#T.grid;
      for (let x = ox; x < cw; x += gsz) {
        for (let y = oy; y < ch; y += gsz) {
          ctx.beginPath(); ctx.arc(x, y, dr, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.restore();
    }

    // ── Annotation ────────────────────────────────────────────────────────

    #drawAnnotation(ctx, a, zoom) {
      const hex = a.color;
      const r   = parseInt(hex.slice(1, 3), 16);
      const g   = parseInt(hex.slice(3, 5), 16);
      const b   = parseInt(hex.slice(5, 7), 16);
      const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      ctx.save();

      // Fond principal
      ctx.fillStyle   = `rgba(${r},${g},${b},0.09)`;
      ctx.strokeStyle = `rgba(${r},${g},${b},0.55)`;
      ctx.lineWidth   = 1.5 / zoom;
      roundRectPath(ctx, a.x, a.y, a.w, a.h, 10 / zoom);
      ctx.fill(); ctx.stroke();

      // Bandeau titre — hauteur en unités graphe (scale avec le zoom comme les nœuds)
      const headerH = 28;
      ctx.fillStyle = `rgba(${r},${g},${b},0.22)`;
      ctx.save();
      ctx.beginPath();
      const rr = 10 / zoom;
      ctx.moveTo(a.x + rr, a.y);
      ctx.lineTo(a.x + a.w - rr, a.y);
      ctx.arcTo(a.x + a.w, a.y, a.x + a.w, a.y + rr, rr);
      ctx.lineTo(a.x + a.w, a.y + headerH);
      ctx.lineTo(a.x, a.y + headerH);
      ctx.lineTo(a.x, a.y + rr);
      ctx.arcTo(a.x, a.y, a.x + rr, a.y, rr);
      ctx.closePath(); ctx.fill(); ctx.restore();

      // Trait séparateur
      ctx.beginPath();
      ctx.moveTo(a.x, a.y + headerH);
      ctx.lineTo(a.x + a.w, a.y + headerH);
      ctx.strokeStyle = `rgba(${r},${g},${b},0.35)`;
      ctx.lineWidth   = 0.8 / zoom;
      ctx.stroke();

      // Extraire titre et contenu depuis le markdown
      const lines = a.content.replace(/\r\n/g, '\n').split('\n');
      let titleLine    = '';
      const bodyLines  = [];
      let leadingBlanks = 0;  // lignes vides avant le premier heading
      let foundTitle   = false;
      for (const l of lines) {
        const stripped = l.trim();
        const text     = stripped.replace(/^#+\s*/, '').trim();
        if (!foundTitle) {
          if (!text) { leadingBlanks++; continue; } // compter les blancs pré-titre
          titleLine  = text;
          foundTitle = true;
          // Injecter les blancs pré-titre dans le corps
          for (let i = 0; i < leadingBlanks; i++) bodyLines.push('');
        } else {
          if (!text) {
            bodyLines.push('');
          } else {
            bodyLines.push(stripped.replace(/^#+\s*/, '').replace(/^\*\*(.+)\*\*$/, '$1').replace(/^[-*•]\s*/, '• ').replace(/\*\*/g, ''));
          }
        }
      }

      // Couleur du texte — adapte au thème, pas seulement à la luminance de l'annotation.
      // Dark : les couleurs sombres (lum<0.35) sont éclaircies pour contraster sur fond sombre.
      // Light : on garde la couleur d'origine (déjà lisible sur fond clair), ou on la fonce si trop claire.
      let bright, brig2, brig3;
      if (this.#isDark) {
        bright = lum < 0.35 ? Math.min(255, r + 130) : r;
        brig2  = lum < 0.35 ? Math.min(255, g + 130) : g;
        brig3  = lum < 0.35 ? Math.min(255, b + 130) : b;
      } else {
        bright = lum > 0.65 ? Math.max(0, r - 80) : r;
        brig2  = lum > 0.65 ? Math.max(0, g - 80) : g;
        brig3  = lum > 0.65 ? Math.max(0, b - 80) : b;
      }
      const textCol = `rgba(${bright},${brig2},${brig3},0.95)`;

      // Titre dans le bandeau — font en unités graphe, scale avec le zoom
      if (titleLine) {
        const tfs = 13;
        ctx.font         = `700 ${tfs}px system-ui,-apple-system,sans-serif`;
        ctx.fillStyle    = textCol;
        ctx.textAlign    = 'left';
        ctx.textBaseline = 'middle';
        // measureText est en CSS px pour une font de tfs px — le zoom s'annule dans la comparaison
        const maxTW = a.w - 18;
        ctx.fillText(ellipsis(ctx, titleLine, maxTW), a.x + 10, a.y + headerH / 2);
      }

      // Corps : lignes de contenu — tout en unités graphe (scale avec le zoom)
      if (bodyLines.length > 0) {
        const bfs   = 11;
        const lineH = bfs * 1.30;   // proche des métriques Flutter bodySmall (~1.2-1.3×)
        const padX  = 10;
        const padY  = headerH + 6;
        // maxBW : le zoom s'annule (W_css×zoom / zone×zoom), unités graphe suffisent
        const maxBW = a.w - 2 * padX;

        ctx.font         = `${bfs}px system-ui,-apple-system,sans-serif`;
        ctx.fillStyle    = `rgba(${bright},${brig2},${brig3},0.75)`;
        ctx.textAlign    = 'left';
        ctx.textBaseline = 'top';

        // Clip à la zone de contenu — plus précis que le check ligne-par-ligne
        ctx.save();
        ctx.beginPath();
        ctx.rect(a.x, a.y + headerH, a.w, a.h - headerH);
        ctx.clip();

        let curY = a.y + padY;
        for (const bl of bodyLines) {
          if (!bl) { curY += lineH * 0.6; continue; }
          const wrapped = wrapText(ctx, bl, maxBW);
          for (const wl of wrapped) {
            ctx.fillText(wl, a.x + padX, curY);
            curY += lineH;
          }
        }

        ctx.restore();
      }

      ctx.restore();
    }

    // ── Connexion ─────────────────────────────────────────────────────────

    #drawConnection(ctx, c, zoom, simInfo = null) {
      if (!c.src || !c.dst) return;
      const T = this.#T;
      const { src, dst, isResource, fromId, toId } = c;
      ctx.save();

      // Connexion active si les deux nœuds sont actifs dans la même étape
      let connActive = false;
      if (simInfo) {
        connActive = isResource
          ? (simInfo.activeRes.has(fromId) && simInfo.activeStd.has(toId))
          : (simInfo.activeStd.has(fromId) && simInfo.activeStd.has(toId));
      }
      const connCol = catColor(this.#nodes.find(n => n.id === fromId)?.nodeType ?? '');

      if (isResource) {
        ctx.strokeStyle = connActive ? connCol : T.connRes;
        ctx.lineWidth   = connActive ? (RES_W * 2.0) / zoom : RES_W / zoom;
        ctx.setLineDash([5 / zoom, 3.5 / zoom]);

        const vy = Math.abs(dst.y - src.y) * 0.48;
        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.bezierCurveTo(src.x, src.y - vy, dst.x, dst.y + vy, dst.x, dst.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Diamants aux extrémités
        ctx.fillStyle = connActive ? connCol : T.connRes;
        const ds = (PORT_R * 0.55) / zoom;
        diamondPath(ctx, src.x, src.y, ds); ctx.fill();
        diamondPath(ctx, dst.x, dst.y, ds); ctx.fill();

      } else {
        ctx.strokeStyle = connActive ? connCol : T.connData;
        ctx.lineWidth   = connActive ? (CONN_W * 2.0) / zoom : CONN_W / zoom;

        const dx      = dst.x - src.x;
        const tension = Math.max(Math.abs(dx) * 0.5, 50);

        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.bezierCurveTo(src.x + tension, src.y, dst.x - tension, dst.y, dst.x, dst.y);
        ctx.stroke();

        drawArrow(ctx, dst.x, dst.y, 0, ARROW_SZ / zoom, connActive ? connCol : T.connData);
      }

      ctx.restore();
    }

    // ── Nœud standard ────────────────────────────────────────────────────

    #drawStandardNode(ctx, n, simInfo = null) {
      const T   = this.#T;
      const { x, y, nodeType, displayName, dataInputs, dataOutputs, resInputs } = n;
      const col = catColor(nodeType);

      const isActive = simInfo?.activeStd.has(n.id) ?? false;
      const pulse    = isActive ? simInfo.pulse : 0;
      const zoom     = this.#viewport.zoom;

      ctx.save();

      // Fond + bordure (avec glow si actif)
      roundRectPath(ctx, x, y, NODE_W, NODE_H, NODE_R);
      ctx.fillStyle   = T.nodeBg;
      ctx.fill();
      if (isActive) {
        ctx.shadowColor = col;
        ctx.shadowBlur  = zoom * (8 + 18 * pulse);
      }
      ctx.lineWidth   = isActive ? 1.5 + 3.5 * pulse : 1.2;
      ctx.strokeStyle = isActive ? col : T.border;
      ctx.stroke();
      ctx.shadowBlur  = 0;

      // Zone icône (fond teinté, top N_PAD_V + N_ICON_H)
      const iconZoneH = N_PAD_V + N_ICON_H + 4;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x + NODE_R, y);
      ctx.lineTo(x + NODE_W - NODE_R, y);
      ctx.arcTo(x + NODE_W, y, x + NODE_W, y + NODE_R, NODE_R);
      ctx.lineTo(x + NODE_W, y + iconZoneH);
      ctx.lineTo(x, y + iconZoneH);
      ctx.lineTo(x, y + NODE_R);
      ctx.arcTo(x, y, x + NODE_R, y, NODE_R);
      ctx.closePath();
      ctx.fillStyle = col + (this.#isDark ? '20' : '14'); // ~12% opacity
      ctx.fill();
      ctx.restore();

      // Séparateur icon / texte
      ctx.beginPath();
      ctx.moveTo(x + 10, y + iconZoneH);
      ctx.lineTo(x + NODE_W - 10, y + iconZoneH);
      ctx.strokeStyle = T.border;
      ctx.lineWidth   = 0.6;
      ctx.stroke();

      // Icône centrée dans la zone
      const icx = x + NODE_W / 2;
      const icy = y + N_PAD_V + N_ICON_H / 2;
      drawNodeIcon(ctx, nodeType, icx, icy, N_ICON_SZ, col);

      // Nom (bold)
      const nameFs = 11;
      ctx.font         = `600 ${nameFs}px system-ui,-apple-system,sans-serif`;
      ctx.fillStyle    = T.text;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'top';
      const maxW = NODE_W - 2 * N_PAD_H;
      ctx.fillText(ellipsis(ctx, displayName, maxW), x + NODE_W / 2, y + N_NAME_Y);

      // Type (sub)
      ctx.font      = `${9}px system-ui,-apple-system,sans-serif`;
      ctx.fillStyle = T.textSub;
      ctx.fillText(ellipsis(ctx, nodeType, maxW), x + NODE_W / 2, y + N_TYPE_Y);

      ctx.restore();

      // Ports
      for (let i = 0; i < dataInputs.length; i++) {
        this.#drawCirclePort(ctx, x, y + verticalPortOffset(i, dataInputs.length, NODE_H));
      }
      for (let i = 0; i < dataOutputs.length; i++) {
        this.#drawCirclePort(ctx, x + NODE_W, y + verticalPortOffset(i, dataOutputs.length, NODE_H));
      }
      for (let i = 0; i < resInputs.length; i++) {
        this.#drawDiamondPort(ctx, x + horizontalPortOffset(i, resInputs.length, NODE_W), y + NODE_H);
      }
    }

    // ── Nœud resource ────────────────────────────────────────────────────

    #drawResourceNode(ctx, n, simInfo = null) {
      const T   = this.#T;
      const { x, y, nodeType, displayName } = n;
      const col = catColor(nodeType);
      const cx  = x + NODE_W / 2;
      const cy  = y + RES_R;

      const isActive = simInfo?.activeRes.has(n.id) ?? false;
      const pulse    = isActive ? simInfo.pulse : 0;
      const zoom     = this.#viewport.zoom;

      ctx.save();

      // Cercle fond
      ctx.beginPath(); ctx.arc(cx, cy, RES_R, 0, Math.PI * 2);
      ctx.fillStyle = T.nodeBgRes; ctx.fill();

      // Teinte couleur catégorie
      ctx.beginPath(); ctx.arc(cx, cy, RES_R, 0, Math.PI * 2);
      ctx.fillStyle = col + (this.#isDark ? '25' : '18'); ctx.fill();

      // Bordure (avec glow si actif)
      ctx.beginPath(); ctx.arc(cx, cy, RES_R, 0, Math.PI * 2);
      if (isActive) {
        ctx.shadowColor = col;
        ctx.shadowBlur  = zoom * (6 + 14 * pulse);
      }
      ctx.strokeStyle = isActive ? col : col + (this.#isDark ? 'aa' : '88');
      ctx.lineWidth   = isActive ? 1.5 + 3.0 * pulse : 1.5;
      ctx.stroke();
      ctx.shadowBlur  = 0;

      // Icône (taille réduite pour le cercle)
      drawNodeIcon(ctx, nodeType, cx, cy, RES_R * 0.90, col);

      // Nom sous le cercle
      const nameFontSize = 10;
      ctx.font         = `600 ${nameFontSize}px system-ui,-apple-system,sans-serif`;
      ctx.fillStyle    = T.text;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'top';
      const nameY = cy + RES_R + 5;
      ctx.fillText(ellipsis(ctx, displayName, NODE_W - 6), cx, nameY);

      // Type sous le nom
      ctx.font      = `8px system-ui,-apple-system,sans-serif`;
      ctx.fillStyle = T.textSub;
      ctx.fillText(ellipsis(ctx, nodeType, NODE_W - 6), cx, nameY + nameFontSize + 2);

      ctx.restore();

      // Port resource output : sommet du cercle
      this.#drawDiamondPort(ctx, cx, y);
    }

    // ── Ports ────────────────────────────────────────────────────────────

    #drawCirclePort(ctx, cx, cy) {
      const T = this.#T;
      ctx.beginPath(); ctx.arc(cx, cy, PORT_R / 2, 0, Math.PI * 2);
      ctx.fillStyle = T.portFill; ctx.fill();
      ctx.lineWidth = 1; ctx.strokeStyle = T.portStroke; ctx.stroke();
    }

    #drawDiamondPort(ctx, cx, cy) {
      const T = this.#T;
      const s = PORT_R * 0.65;
      diamondPath(ctx, cx, cy, s);
      ctx.fillStyle = T.portFill; ctx.fill();
      ctx.lineWidth = 1; ctx.strokeStyle = T.portStroke; ctx.stroke();
    }

    // ── API publique ─────────────────────────────────────────────────────

    fitToScreen(padding = 40) {
      if (!this.#nodes.length && !this.#annotations.length) return;
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const n of this.#nodes) {
        minX = Math.min(minX, n.x); minY = Math.min(minY, n.y);
        maxX = Math.max(maxX, n.x + NODE_W);
        maxY = Math.max(maxY, n.y + (n.isResource ? RES_R * 2 + 24 : NODE_H));
      }
      for (const a of this.#annotations) {
        minX = Math.min(minX, a.x); minY = Math.min(minY, a.y);
        maxX = Math.max(maxX, a.x + a.w); maxY = Math.max(maxY, a.y + a.h);
      }
      const cw   = this.#canvas.width;
      const ch   = this.#canvas.height;
      const gw   = maxX - minX, gh = maxY - minY;
      if (gw <= 0 || gh <= 0) return;
      const zoom = Math.min((cw - 2 * padding) / gw, (ch - 2 * padding) / gh, 2);
      this.#viewport = {
        x:    (cw - gw * zoom) / 2 - minX * zoom,
        y:    (ch - gh * zoom) / 2 - minY * zoom,
        zoom,
      };
      this.#scheduleRender();
    }

    setViewport(x, y, zoom) {
      this.#viewport = { x, y, zoom };
      this.#scheduleRender();
    }

    getViewport() { return { ...this.#viewport }; }

    setDarkMode(isDark) {
      this.#isDark = isDark;
      this.#T      = isDark ? DARK : LIGHT;
      this.#scheduleRender();
    }

    resize(width, height) {
      this.#canvas.width  = width;
      this.#canvas.height = height;
      this.#scheduleRender();
    }

    render() { this.#scheduleRender(); }

    /** Active / désactive le mode simulation.
     *  canvas.simulate = true  → lance l'animation
     *  canvas.simulate = false → arrête et revient au rendu statique */
    get simulate() { return this.#sim; }
    set simulate(v) {
      const on = !!v;
      if (on === this.#sim) return;
      this.#sim = on;
      if (on) {
        this.#simT = 0; this.#simStep = 0; this.#simPhaseT = 0;
        this.#buildSimPlan();
        this.#startSimLoop();
      } else {
        this.#stopSimLoop();
        this.#scheduleRender();
      }
    }
  }

  global.AgentivityWorkflowCanvas = AgentivityWorkflowCanvas;

})(typeof window !== 'undefined' ? window : globalThis);
