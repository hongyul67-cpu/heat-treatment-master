/* ══════════════════════════════════════════════════════════════
   열처리 마스터 — 그림 모음 (그림18 · 2026-09-30)
   공용 그리기 도우미 links/fig.js 를 쓴다. index.html(배우기)과 lesson.js(수업 슬라이드)가 함께 부른다.

   한 칸의 모양
     키: { cap:'캡션 한 줄', cards:['배우기 칩 이름'…], draw:function(){ … } }
       cards — index.html 의 LESSONS[].t 와 **똑같이**. 그 쪽 맨 위에 그림이 붙는다(누르면 크게).
     순서 = 화면에 나오는 순서.

   자료 — 공개문제(열처리기능사 SM45C · SCM440): 요구 경도 · 시험편 t4×30×120 · 불꽃시험편 ∅10×60
          교재 「열처리의 기초」: 담금질 유지시간 두께 25mm 당 20~30분
          NCS 학습모듈 「불꽃시험」: 뿌리 C·Ni / 중앙 Ni·Cr·Mn·Si / 끝 Mn·Mo·W
   자료에 없는 수치는 넣지 않았다. 선도의 830℃ 는 슬라이드·카드에 있는 SM45C 가열 온도다.
   금속재료시험 마스터의 figs.js 에 four · micro4 · sparkparts 를 복사해 같이 쓴다(고치면 둘 다).
   ══════════════════════════════════════════════════════════════ */
var FIGS = (function () {
  var F = window.FIG;
  if (!F) return {};
  var C = F.C;
  var t = F.t, box = F.box, line = F.line, arrow = F.arrow, path = F.path, callout = F.callout;

  /* 작은 도우미 */
  function dot(x, y, r, c) { return '<circle cx="' + x + '" cy="' + y + '" r="' + (r || 3) + '" fill="' + (c || C.ink) + '"/>'; }
  function axes(x0, y0, x1, y1, xl, yl, ans) {   /* 원점 (x0,y0) · 가로 끝 x1 · 세로 끝 y1 · ans: 축 이름이 정답 */
    return arrow(x0, y0, x1, y0, { w: 1.6, head: 9 }) + arrow(x0, y0, x0, y1, { w: 1.6, head: 9 }) +
      (xl ? t(x1, y0 + 20, xl, { a: 'e', size: 14, c: C.sub, b: 1, ans: ans }) : '') +
      (yl ? t(x0 + 8, y1 + 2, yl, { size: 14, c: C.sub, b: 1, ans: ans }) : '');
  }
  function star(x, y, r, c, k) {             /* 불꽃 파열(별) — k 갈래 */
    var s = '', n = k || 6;
    for (var i = 0; i < n; i++) {
      var a = i * Math.PI * 2 / n + 0.3;
      s += line(x, y, x + r * Math.cos(a), y + r * Math.sin(a), { c: c || C.red, w: 1.4 });
    }
    return s;
  }
  function grinder(cx, cy, r) {
    return F.circle(cx, cy, r, { fill: C.grayM, w: 1.6 }) + F.circle(cx, cy, r * 0.25, { fill: C.sub, c: C.sub }) +
      t(cx, cy + r + 18, '그라인더', { a: 'm', size: 13, c: C.sub });
  }
  /* 원 안에 선분 자르기 (+ 반평면 nx·x+ny·y ≤ d 조건) — clipPath 없이 조직 무늬를 그린다 */
  function clip(x1, y1, x2, y2, cx, cy, r, hp) {
    var dx = x2 - x1, dy = y2 - y1, fx = x1 - cx, fy = y1 - cy;
    var a = dx * dx + dy * dy, b = 2 * (fx * dx + fy * dy), c = fx * fx + fy * fy - r * r, D = b * b - 4 * a * c;
    if (D <= 0) return null;
    var sq = Math.sqrt(D), t0 = Math.max(0, (-b - sq) / (2 * a)), t1 = Math.min(1, (-b + sq) / (2 * a));
    if (hp) {
      var p0 = hp[0] * x1 + hp[1] * y1 - hp[2], pd = hp[0] * dx + hp[1] * dy;
      if (Math.abs(pd) < 1e-9) { if (p0 > 0) return null; }
      else { var tc = -p0 / pd; if (pd > 0) t1 = Math.min(t1, tc); else t0 = Math.max(t0, tc); }
    }
    if (t1 <= t0) return null;
    return [x1 + dx * t0, y1 + dy * t0, x1 + dx * t1, y1 + dy * t1];
  }
  function cline(seg, o) { return seg ? line(seg[0], seg[1], seg[2], seg[3], o) : ''; }
  function rnd(seed) { return function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }; }

  return {

  /* ─────────── 열처리란? ─────────── */
  seondo: { cards: ['열처리란?', '열처리 선도'],
    cap: '열처리 선도 — 가열 → 유지 → 냉각. 가로는 시간, 세로는 온도 (SM45C 담금질 예)',
    draw: function () {
      var s = axes(60, 200, 460, 34, '시간', '온도', 1);
      s += line(60, 80, 330, 80, { c: C.sub, w: 1, dash: '5 4' }) + t(54, 80, '830℃', { a: 'e', size: 14, c: C.red, b: 1 });
      s += line(60, 200, 170, 80, { c: C.orange, w: 3.2 });
      s += line(170, 80, 310, 80, { c: C.red, w: 3.2 });
      s += line(310, 80, 336, 198, { c: C.blue, w: 3.2 });
      s += F.num(98, 132, '1', { c: C.orange }) + t(114, 132, '가열', { b: 1, c: C.orange });
      s += F.num(222, 60, '2', { c: C.red }) + t(238, 60, '유지', { b: 1, c: C.red });
      s += F.num(350, 132, '3', { c: C.blue }) + t(366, 132, '냉각 — 수냉', { b: 1, c: C.blue });
      s += F.dim(170, 80, 310, 80, '유지 시간', { off: 26, side: -1, c: C.red, size: 14, ans: 1 });
      s += box(30, 232, 420, 30, { fill: C.blueL, c: C.blue, w: 1.2 }) +
        t(240, 247, '온도 · 유지시간 · 냉각방법 — 세 가지를 다 적는다', { a: 'm', b: 1, size: 15, c: C.blue, halo: false, ans: 1 });
      return F.svg(480, 276, s);
    } },

  hold: { cards: ['열처리란?'],
    cap: '유지시간 — 겉만 데워진 상태에서 꺼내면 속은 굳지 않는다. 속까지 같은 온도가 될 때까지 둔다',
    draw: function () {
      var s = '';
      /* 가열 직후 */
      s += t(110, 30, '가열 직후', { a: 'm', b: 1, size: 17 });
      s += box(40, 52, 140, 96, { fill: C.redL, c: C.red, r: 6 });
      s += box(72, 76, 76, 48, { fill: C.blueL, c: C.blue, r: 4, w: 1.2 });
      s += t(110, 100, '속 — 아직 낮다', { a: 'm', size: 13, c: C.blue, b: 1, halo: false });
      s += t(110, 64, '겉 — 뜨겁다', { a: 'm', size: 13, c: C.red, b: 1, halo: false });
      s += arrow(110, 172, 110, 152, { c: C.orange, w: 2, head: 9 }) + arrow(20, 100, 38, 100, { c: C.orange, w: 2, head: 9 }) +
        arrow(200, 100, 182, 100, { c: C.orange, w: 2, head: 9 });
      s += t(110, 188, '열은 겉에서 속으로', { a: 'm', size: 13, c: C.orange });
      /* 유지 */
      s += arrow(214, 100, 262, 100, { w: 2.4 }) + t(238, 82, '유지', { a: 'm', b: 1 });
      /* 유지 후 */
      s += t(360, 30, '충분히 유지한 뒤', { a: 'm', b: 1, size: 17 });
      s += box(290, 52, 140, 96, { fill: C.redL, c: C.red, r: 6, label: '속까지 같은 온도', size: 15, lc: C.red });
      s += t(360, 172, '→ 담금질하면 속까지 굳는다', { a: 'm', size: 14, c: C.green, b: 1 });
      s += box(20, 204, 440, 38, { fill: C.yellowL, c: C.orange, w: 1.2 }) +
        t(240, 223, '두꺼울수록 오래 — 교재: 두께 25mm 당 20~30분', { a: 'm', b: 1, size: 15, c: C.orange, halo: false });
      return F.svg(480, 256, s);
    } },

  /* ─────────── 4대 열처리 ─────────── */
  four: { cards: ['4대 열처리', '열처리 선도'],
    cap: '같은 온도로 데워도 식히는 속도에 따라 네 갈래 — 담금질한 것은 A1 아래로 다시 데워 뜨임한다',
    draw: function () {
      var s = axes(40, 236, 312, 36, '시간', '온도');
      s += line(40, 122, 305, 122, { c: C.sub, w: 1, dash: '5 4' }) + t(300, 110, 'A1', { a: 'e', size: 14, c: C.sub, b: 1 });
      s += line(40, 236, 100, 70, { c: C.ink, w: 3 }) + line(100, 70, 150, 70, { c: C.ink, w: 3 });
      s += t(98, 52, '가열 · 유지', { a: 'm', b: 1, size: 15 });
      s += path('M150,70 Q158,190 172,234', { c: C.red, w: 3 });
      s += path('M150,70 Q176,180 208,234', { c: C.orange, w: 3 });
      s += path('M150,70 Q206,160 256,234', { c: C.blue, w: 3 });
      s += path('M150,70 Q250,100 302,230', { c: C.green, w: 3 });
      /* 범례 — 냉각 → 이름 */
      var lg = [['수냉', '담금질', C.red], ['유냉', '담금질', C.orange], ['공냉', '불림', C.blue], ['노냉', '풀림', C.green]];
      for (var i = 0; i < 4; i++) {
        var y = 52 + i * 27;
        s += line(330, y, 352, y, { c: lg[i][2], w: 3.4 }) + t(360, y, lg[i][0], { b: 1, c: lg[i][2], size: 15 }) +
          t(396, y, '→ ' + lg[i][1], { size: 15, b: 1, ans: 1 });
      }
      s += t(330, 162, '빠를수록 단단하다', { size: 13, c: C.sub });
      /* 뜨임 — 작은 선도 */
      s += box(322, 176, 150, 90, { fill: C.purpleL, c: C.purple, w: 1.2, r: 8 });
      s += t(397, 192, '뜨임 (담금질 뒤)', { a: 'm', b: 1, size: 14, c: C.purple, halo: false });
      s += line(330, 222, 464, 222, { c: C.sub, w: 1, dash: '4 3' }) + t(462, 212, 'A1', { a: 'e', size: 13, c: C.sub });
      s += line(334, 204, 350, 256, { c: C.red, w: 2.6 }) +
        line(350, 256, 378, 234, { c: C.purple, w: 2.6 }) + line(378, 234, 424, 234, { c: C.purple, w: 2.6 }) +
        line(424, 234, 446, 256, { c: C.purple, w: 2.6 });
      s += line(330, 258, 464, 258, { c: C.sub, w: 1 });
      return F.svg(480, 282, s);
    } },

  hentai: { cards: ['4대 열처리'],
    cap: '변태점 — 담금질은 A3(과공석강은 A1)보다 30~50℃ 높게 데워 전부 오스테나이트로 만든다',
    draw: function () {
      var X = function (c) { return 70 + c * 300; }, Y = function (T) { return 250 - (T - 650) * 0.66; };
      var s = axes(70, 250, 450, 40, '탄소량(%)', '온도');
      /* 담금질 온도 띠 (A3/A1 + 30~50℃) */
      var a3 = [[0, 910], [0.1, 870], [0.2, 845], [0.3, 815], [0.4, 790], [0.5, 770], [0.6, 752], [0.7, 732], [0.77, 723]];
      var up = [], dn = [];
      a3.forEach(function (p) { up.push([X(p[0]), Y(p[1] + 50)]); dn.push([X(p[0]), Y(p[1] + 30)]); });
      up.push([X(1.2), Y(773)]); dn.push([X(1.2), Y(753)]);
      s += F.poly(up.concat(dn.reverse()), { close: 1, fill: C.orangeL, c: C.orange, w: 1, dash: '4 3' });
      /* A3 · A1 · Acm */
      s += F.poly(a3.map(function (p) { return [X(p[0]), Y(p[1])]; }), { c: C.red, w: 2.6 });
      s += line(X(0.02), Y(723), X(1.2), Y(723), { c: C.blue, w: 2.6 });
      s += F.poly([[X(0.77), Y(723)], [X(0.9), Y(775)], [X(1.05), Y(830)], [X(1.2), Y(880)]], { c: C.purple, w: 2.2 });
      s += dot(X(0.77), Y(723), 5, C.purple);
      s += t(X(0.07), Y(838), 'A3', { b: 1, c: C.red });
      s += t(X(1.2) - 2, Y(890) - 12, 'Acm', { a: 'e', b: 1, c: C.purple, size: 15 });
      s += t(X(0.9), Y(723) + 15, 'A1  723℃', { b: 1, c: C.blue, size: 15 });
      s += t(X(0.62), Y(872), '오스테나이트 (γ)', { a: 'm', b: 1, size: 17, c: C.orange });
      s += callout(X(0.2), Y(870), X(0.3), Y(935), '담금질 가열 온도', { c: C.orange, tc: C.orange, b: 1, size: 14 });
      /* SM45C */
      s += line(X(0.45), 250, X(0.45), Y(820), { c: C.ink, w: 1.4, dash: '5 4' }) + dot(X(0.45), Y(820), 5, C.red);
      s += t(X(0.45), 266, 'SM45C (0.45)', { a: 'm', size: 13, b: 1 });
      s += t(X(0.77), 266, '0.77', { a: 'm', size: 13, c: C.purple, b: 1 });
      s += t(X(0.24), Y(685), '페라이트 + 펄라이트', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 280, s);
    } },

  /* ─────────── 냉각속도 ─────────── */
  mass: { cards: ['냉각속도'],
    cap: '질량효과 — 굵은 탄소강은 속이 천천히 식어 겉만 굳는다. 합금강(Cr·Mo)은 기름으로도 속까지 굳는다',
    draw: function () {
      var s = '';
      s += F.circle(96, 104, 62, { fill: C.redL, c: C.red, w: 2 }) + F.circle(96, 104, 32, { fill: C.blueL, c: C.blue, w: 1.6 });
      s += t(96, 104, '무름', { a: 'm', b: 1, size: 15, c: C.blue, halo: false });
      s += t(96, 184, '굵은 탄소강', { a: 'm', b: 1 }) + t(96, 204, '겉만 굳는다', { a: 'm', size: 14, c: C.red, b: 1 });
      s += F.circle(240, 104, 30, { fill: C.redL, c: C.red, w: 2 });
      s += t(240, 184, '가는 탄소강', { a: 'm', b: 1 }) + t(240, 204, '속까지 굳는다', { a: 'm', size: 14, c: C.sub });
      s += F.circle(384, 104, 62, { fill: C.redL, c: C.red, w: 2 });
      s += t(384, 104, 'Cr · Mo', { a: 'm', b: 1, size: 15, c: C.red, halo: false });
      s += t(384, 184, '굵은 합금강', { a: 'm', b: 1 }) + t(384, 204, '기름으로도 속까지', { a: 'm', size: 14, c: C.green, b: 1 });
      s += box(24, 222, 16, 14, { fill: C.redL, c: C.red, r: 2, w: 1.2 }) + t(46, 229, '굳은 부분(마르텐사이트)', { size: 13 });
      s += box(250, 222, 16, 14, { fill: C.blueL, c: C.blue, r: 2, w: 1.2 }) + t(272, 229, '덜 굳은 부분', { size: 13 });
      return F.svg(480, 248, s);
    } },

  /* ─────────── 금속조직 ─────────── */
  micro4: { cards: ['금속조직'],
    cap: '빨리 식힐수록 단단한 조직 — 마르텐사이트 > 트루스타이트 > 소르바이트 > 펄라이트 (마-트-소-펄)',
    draw: function () {
      var s = '', nm = ['마르텐사이트', '트루스타이트', '소르바이트', '펄라이트'], cl = ['수냉', '유냉', '공냉', '노냉'],
        h = [150, 112, 76, 44], fc = [C.redL, C.orangeL, C.blueL, C.greenL], sc = [C.red, C.orange, C.blue, C.green];
      s += arrow(24, 196, 24, 30, { w: 1.6, head: 9, c: C.sub }) + t(34, 34, '경도', { size: 14, b: 1, c: C.sub });
      for (var i = 0; i < 4; i++) {
        var x = 44 + i * 108;
        s += box(x, 196 - h[i], 100, h[i], { fill: fc[i], c: sc[i], r: 4 });
        s += t(x + 50, 196 - h[i] + 18, nm[i], { a: 'm', b: 1, size: 14, c: sc[i], halo: false, ans: 1 });
        s += t(x + 50, 214, cl[i], { a: 'm', b: 1, size: 15 });
      }
      s += line(30, 196, 470, 196, { w: 1.6 });
      s += arrow(60, 240, 440, 240, { c: C.sub, w: 1.6, head: 9 });
      s += t(60, 256, '빨리 식힘', { size: 13, c: C.sub }) + t(440, 256, '천천히 식힘', { a: 'e', size: 13, c: C.sub });
      return F.svg(480, 270, s);
    } },

  shapes: { cards: ['금속조직'],
    cap: '현미경으로 본 조직 모양 — 오스테나이트는 다각형 결정, 마르텐사이트는 바늘, 펄라이트는 층층이 줄무늬 (모양만 나타낸 그림)',
    draw: function () {
      var s = '', R = 62, cy = 98, cx = [84, 240, 396], i, k;
      /* 오스테나이트 — 다각형 결정립 + 쌍정(평행선) */
      var gx = cx[0], pts = [[-40, -52], [-8, -30], [30, -44], [44, -6], [20, 22], [-20, 10], [-46, 26], [-10, 50], [40, 46]];
      var ed = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 1], [5, 6], [6, 7], [7, 4], [4, 8], [1, -1], [3, -2], [6, -3], [7, -4], [8, -5], [0, -6]];
      var far = { '-1': [-70, -20], '-2': [80, -10], '-3': [-80, 20], '-4': [-20, 90], '-5': [90, 60], '-6': [-40, -90] };
      s += F.circle(gx, cy, R, { fill: C.paper, c: C.ink, w: 2 });
      for (i = 0; i < ed.length; i++) {
        var a = pts[ed[i][0]], b = ed[i][1] >= 0 ? pts[ed[i][1]] : far[ed[i][1]];
        s += cline(clip(gx + a[0], cy + a[1], gx + b[0], cy + b[1], gx, cy, R - 1), { c: C.ink, w: 1.4 });
      }
      s += line(gx + 4, cy - 26, gx + 26, cy + 6, { c: C.sub, w: 1 }) + line(gx - 4, cy - 20, gx + 16, cy + 12, { c: C.sub, w: 1 });
      /* 마르텐사이트 — 바늘 */
      var r1 = rnd(7);
      s += F.circle(cx[1], cy, R, { fill: C.paper, c: C.ink, w: 2 });
      for (i = 0; i < 46; i++) {
        var px = cx[1] + (r1() - 0.5) * 2 * R, py = cy + (r1() - 0.5) * 2 * R, an = [0.5, 1.2, 2.1, 2.7][i % 4] + (r1() - 0.5) * 0.3,
          L = 10 + r1() * 22;
        s += cline(clip(px - L / 2 * Math.cos(an), py - L / 2 * Math.sin(an), px + L / 2 * Math.cos(an), py + L / 2 * Math.sin(an),
          cx[1], cy, R - 2), { c: C.ink, w: 1.8 });
      }
      /* 펄라이트 — 두 덩어리의 층상 줄무늬 */
      s += F.circle(cx[2], cy, R, { fill: C.paper, c: C.ink, w: 2 });
      var gcx = cx[2], hp1 = [1, 0.6, gcx + 0.6 * cy + 6], hp2 = [-1, -0.6, -(gcx + 0.6 * cy + 6)];
      for (k = -80; k <= 80; k += 7) {
        s += cline(clip(gcx - 90, cy + k - 40, gcx + 90, cy + k + 40, gcx, cy, R - 1, hp1), { c: C.ink, w: 1.6 });
        s += cline(clip(gcx + k - 30, cy - 90, gcx + k + 30, cy + 90, gcx, cy, R - 1, hp2), { c: C.ink, w: 1.6 });
      }
      s += cline(clip(gcx + 6 - 48, cy + 80, gcx + 6 + 48, cy - 80, gcx, cy, R - 1), { c: C.sub, w: 1.2 });
      var name = ['오스테나이트', '마르텐사이트', '펄라이트'], sub = ['다각형 결정 · 고온에서만', '바늘 모양(침상)', '층층이 줄무늬(층상)'];
      for (i = 0; i < 3; i++) {
        s += t(cx[i], 182, name[i], { a: 'm', b: 1, ans: 1 }) + t(cx[i], 204, sub[i], { a: 'm', size: 13, c: C.sub });
      }
      return F.svg(480, 222, s);
    } },

  /* ─────────── 불꽃시험 ─────────── */
  spark3: { cards: ['불꽃시험'],
    cap: '탄소가 많을수록 파열(별)이 많고, Cr·W 같은 합금 원소가 들면 불꽃이 짧고 어두워진다',
    draw: function () {
      var s = grinder(48, 128, 32), o = [82, 128], i, rows = [60, 128, 196];
      /* 저탄소 — 길고 곧은 선, 파열 거의 없음 */
      for (i = -1; i <= 1; i++) s += line(o[0], o[1], 280, rows[0] + i * 9, { c: C.orange, w: 1.8 });
      s += star(262, rows[0] - 9, 6, C.red, 3);
      /* 고탄소 — 파열 많음 */
      for (i = -1; i <= 1; i++) s += line(o[0], o[1], 250, rows[1] + i * 10, { c: C.orange, w: 1.8 });
      [[168, 118], [196, 136], [214, 114], [232, 132], [250, 120], [226, 146], [184, 124]].forEach(function (p) { s += star(p[0], p[1], 9, C.red, 8); });
      /* 합금강 — 짧고 어둡다 */
      for (i = -1; i <= 1; i++) s += line(o[0], o[1], 190, rows[2] + i * 8, { c: '#9a3412', w: 1.8 });
      s += dot(194, rows[2] + 8, 3, C.red);
      s += t(296, rows[0] - 10, '저탄소강', { b: 1, c: C.orange }) + t(296, rows[0] + 12, '곧은 선 · 파열 적음', { size: 13, c: C.sub });
      s += t(296, rows[1] - 10, '고탄소강', { b: 1, c: C.red }) + t(296, rows[1] + 12, '파열(별)이 많다', { size: 13, c: C.sub });
      s += t(296, rows[2] - 10, '합금강 (Cr · W)', { b: 1, c: '#9a3412' }) + t(296, rows[2] + 12, '짧고 어둡다 · 억제', { size: 13, c: C.sub });
      s += box(20, 230, 440, 34, { fill: C.blueL, c: C.blue, w: 1.2 }) +
        t(240, 247, '보는 것 — 유선 · 파열 · 색', { a: 'm', b: 1, size: 15, c: C.blue, halo: false, ans: 1 });
      return F.svg(480, 276, s);
    } },

  sparkparts: { cards: ['불꽃시험'],
    cap: '불꽃은 유선 하나하나를 뿌리 · 중앙 · 끝으로 나눠 본다 (NCS 학습모듈 「불꽃시험」)',
    draw: function () {
      var s = grinder(46, 118, 30), o = [78, 118], ends = [[430, 96], [440, 118], [430, 140]], i;
      for (i = 0; i < 3; i++) s += line(o[0], o[1], ends[i][0], ends[i][1], { c: C.orange, w: 2 });
      s += line(190, 44, 190, 176, { c: C.sub, w: 1.2, dash: '6 5' }) + line(320, 44, 320, 176, { c: C.sub, w: 1.2, dash: '6 5' });
      [[236, 104], [270, 128], [296, 110]].forEach(function (p) { s += star(p[0], p[1], 10, C.red, 8); });
      [[360, 100], [376, 126], [392, 106], [404, 134], [414, 112]].forEach(function (p) { s += star(p[0], p[1], 5, C.red, 6); s += dot(p[0] + 6, p[1] - 5, 2, C.orange); });
      s += t(134, 48, '뿌리', { a: 'm', b: 1, size: 17 }) + t(255, 48, '중앙', { a: 'm', b: 1, size: 17 }) + t(380, 48, '끝', { a: 'm', b: 1, size: 17 });
      s += callout(150, 116, 150, 158, '유선', { a: 'm', c: C.orange, tc: C.orange, b: 1 });
      s += callout(270, 138, 262, 162, '파열', { a: 'm', c: C.red, tc: C.red, b: 1 });
      s += t(134, 200, 'C · Ni 의 양', { a: 'm', b: 1, size: 15, c: C.blue , ans: 1 });
      s += t(255, 200, 'Ni · Cr · Mn · Si', { a: 'm', b: 1, size: 15, c: C.blue , ans: 1 });
      s += t(380, 200, 'Mn · Mo · W', { a: 'm', b: 1, size: 15, c: C.blue , ans: 1 });
      s += t(240, 226, '↑ 이 부분으로 무엇을 추정하나', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 244, s);
    } },

  /* ─────────── 강종 기호 ─────────── */
  codeparse: { cards: ['강종 기호'],
    cap: '강종 기호는 조각내서 읽는다 — SM45C 의 45 는 탄소 0.45%',
    draw: function () {
      var s = '';
      function row(y, parts, notes, colors) {
        var w = 80, gap = 8, x = (480 - (parts.length * (w + gap) - gap)) / 2, o = '';
        for (var i = 0; i < parts.length; i++) {
          o += box(x, y, w, 44, { fill: colors[i][0], c: colors[i][1], label: parts[i], size: 22, lc: colors[i][1] });
          o += t(x + w / 2, y + 62, notes[i], { a: 'm', size: 13, b: 1, c: C.ink });
          x += w + gap;
        }
        return o;
      }
      var cS = [C.grayL, C.ink], cB = [C.blueL, C.blue], cR = [C.redL, C.red], cG = [C.greenL, C.green], cP = [C.purpleL, C.purple];
      s += row(20, ['S', 'M', '45', 'C'], ['강(Steel)', '기계구조용', '탄소 0.45%', '탄소강'], [cS, cB, cR, cB]);
      s += row(118, ['S', 'C', 'M', '4', '40'], ['강', '크롬 Cr', '몰리브덴 Mo', '합금량 구분', '탄소 약 0.40%'], [cS, cG, cP, [C.grayL, C.sub], cR]);
      s += box(20, 212, 440, 56, { fill: C.yellowL, c: C.orange, w: 1.2 });
      s += t(240, 230, 'ST 로 시작하면 공구강 (T = Tool)', { a: 'm', b: 1, size: 15, c: C.orange, halo: false });
      s += t(240, 254, 'STC 탄소공구 · STS 합금공구 · STD 금형 · SKH 고속도', { a: 'm', size: 14, halo: false });
      return F.svg(480, 282, s);
    } },

  /* ─────────── 실기 조건 ─────────── */
  temper: { cards: ['실기 조건'],
    cap: '뜨임(템퍼링) 온도가 높을수록 경도는 내려가고 인성은 올라간다 — 요구 경도에 맞춰 온도를 고른다',
    draw: function () {
      var s = axes(60, 200, 452, 36, '', '');
      s += t(52, 44, 'HRC', { a: 'e', size: 14, b: 1, c: C.sub });
      s += path('M72,60 C160,66 230,110 300,146 S410,178 440,182', { c: C.red, w: 3.2 });
      s += path('M72,182 C160,176 230,130 300,98 S410,68 440,64', { c: C.green, w: 3, dash: '8 5' });
      s += t(84, 44, '경도 ↓', { b: 1, c: C.red, ans: 1 });
      s += t(444, 48, '인성 ↑', { a: 'e', b: 1, c: C.green, ans: 1 });
      s += t(90, 214, '낮게', { a: 'm', size: 14, c: C.sub }) + t(256, 214, '뜨임 온도 →', { a: 'm', size: 14, c: C.sub, b: 1 }) + t(420, 214, '높게', { a: 'm', size: 14, c: C.sub });
      s += box(20, 228, 440, 58, { fill: C.grayL, c: C.edge, w: 1 });
      s += t(240, 245, '공개문제 뜨임 요구 경도', { a: 'm', b: 1, size: 14, c: C.sub, halo: false });
      s += t(130, 268, 'SM45C  HRC 18~30', { a: 'm', b: 1, size: 15, c: C.blue, halo: false }) +
        t(350, 268, 'SCM440  HRC 28~39', { a: 'm', b: 1, size: 15, c: C.green, halo: false });
      return F.svg(480, 298, s);
    } },

  hrc: { cards: ['실기 조건'],
    cap: '경도(HRC) — 다이아몬드 원뿔로 누른다. 표면을 #320 샌드페이퍼로 다듬고, 자국을 떨어뜨려 3회 잰다',
    draw: function () {
      var s = '';
      s += box(96, 24, 28, 40, { fill: C.grayM, r: 3, w: 1.4 });
      s += F.poly([[100, 64], [120, 64], [110, 84]], { close: 1, fill: C.red, c: C.red, w: 1.2 });
      s += arrow(110, 8, 110, 22, { c: C.ink, w: 2, head: 9 });
      s += callout(122, 76, 160, 48, '다이아몬드 원뿔', { c: C.red, tc: C.red, b: 1, ans: 1 });
      s += box(40, 86, 400, 40, { fill: C.grayL, w: 1.6 });
      s += t(420, 106, '시험편 t4', { a: 'e', size: 14, c: C.sub, halo: false });
      [110, 200, 290].forEach(function (x, i) {
        s += F.poly([[x - 7, 86], [x + 7, 86], [x, 96]], { close: 1, fill: C.paper, c: C.red, w: 1.4 });
        s += F.num(x, 142, String(i + 1), { c: C.red, r: 11, size: 13 });
      });
      s += F.dim(110, 158, 200, 158, '', { off: 0, c: C.sub }) + t(210, 162, '← 충분히 떨어뜨림', { size: 13, c: C.sub });
      s += box(20, 180, 210, 70, { fill: C.blueL, c: C.blue, w: 1.2 });
      s += t(125, 200, '퀜칭 후 3회', { a: 'm', b: 1, c: C.blue, halo: false, ans: 1 }) + t(125, 228, '템퍼링 후 3회', { a: 'm', b: 1, c: C.blue, halo: false, ans: 1 });
      s += box(250, 180, 210, 70, { fill: C.yellowL, c: C.orange, w: 1.2 });
      s += t(355, 200, '측정 전', { a: 'm', b: 1, c: C.orange, halo: false }) + t(355, 228, '#320 으로 산화막 제거', { a: 'm', size: 14, halo: false, ans: 1 });
      return F.svg(480, 262, s);
    } }

  };
})();
