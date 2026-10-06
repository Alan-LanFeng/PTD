// PTD site v2 — behaviour. Data comes from <script id="ptd-data">. No external requests.
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const DATA = JSON.parse($("#ptd-data").textContent);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SVGNS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs = {}, parent = null) => { const e = document.createElementNS(SVGNS, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); if (parent) parent.appendChild(e); return e; };
  const RAMP = ["#4C6FFF", "#8E5CFF", "#E2559A", "#FF9A4D", "#FFE6B8"], RAMP_INK = ["#2F4FE0", "#6B3FD8", "#C23A7A", "#D9772F", "#B8862F"];
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const ramp = (u, stops = RAMP_INK) => { u = Math.min(1, Math.max(0, u)) * (stops.length - 1); const i = Math.min(stops.length - 2, Math.floor(u)), f = u - i;
    const a = hex(stops[i]), b = hex(stops[i + 1]); return `rgb(${a.map((x, k) => Math.round(x + (b[k] - x) * f)).join(",")})`; };
  const lazySrc = (v) => { if (v && !v.getAttribute("src") && v.dataset.src) { v.src = v.dataset.src; } };

  // ------------------------------------------------------------------ one audible video at a time
  document.addEventListener("play", (e) => {
    const v = e.target; if (!(v instanceof HTMLVideoElement) || v.muted) return;
    $$("video").forEach((o) => { if (o !== v && !o.muted && !o.paused) o.pause(); });
  }, true);

  // ------------------------------------------------------------------ film
  const film = $("#film"), fig = $("#film-fig");
  const startFilm = (t) => { lazySrc(film); film.controls = true; fig.classList.add("playing"); if (t != null) film.currentTime = t; film.muted = false; film.play().catch(() => {}); };
  $(".play", fig).addEventListener("click", () => startFilm(null));
  $$(".chapters button").forEach((b) => b.addEventListener("click", () => startFilm(+b.dataset.t)));
  film.addEventListener("play", () => fig.classList.add("playing"));

  // ------------------------------------------------------------------ evidence loops (wall, comparisons): play in view, pause out of view
  const loops = $$("video.loop");
  if (reduce || !("IntersectionObserver" in window)) loops.forEach((v) => { lazySrc(v); v.controls = true; });
  else {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      const v = e.target;
      if (e.isIntersecting && e.intersectionRatio > 0.35) { lazySrc(v); v.play().catch(() => {}); } else v.pause();
    }), { threshold: [0, 0.35, 0.6] });
    loops.forEach((v) => io.observe(v));
  }
  // task and other on-demand videos get their source when they come near the viewport
  const near = "IntersectionObserver" in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { lazySrc(e.target); near.unobserve(e.target); } }), { rootMargin: "600px 0px" }) : null;
  $$(".t-media video").forEach((v) => (near ? near.observe(v) : lazySrc(v)));

  // ------------------------------------------------------------------ tiles: hover preview, click to open the viewer
  const lists = { results: DATA.results, study: DATA.study };
  $$(".tile").forEach((tile) => {
    const it = lists[tile.dataset.kind][+tile.dataset.i];
    let v = null;
    if (!reduce) {
      tile.addEventListener("pointerenter", (e) => {
        if (e.pointerType === "touch") return;
        if (!v) { v = document.createElement("video"); v.muted = true; v.loop = true; v.playsInline = true; v.preload = "auto"; v.src = it.video; $(".thumb", tile).appendChild(v); }
        v.play().catch(() => {});
      });
      tile.addEventListener("pointerleave", () => { if (v) v.pause(); });
    }
    tile.addEventListener("click", () => openViewer(tile.dataset.kind, +tile.dataset.i));
  });

  // ------------------------------------------------------------------ viewer
  const dlg = $("#viewer"), vv = $("#v-video"), vt = $("#v-title"), vp = $("#v-prompt"), vn = $(".v-note"), vm = $(".v-modes");
  let cur = { kind: "results", i: 0, mode: "ptd" };
  function show() {
    const it = lists[cur.kind][cur.i], study = cur.kind === "study";
    vm.hidden = !study;
    const raters = study && cur.mode === "raters" && it.compare;
    $$("button", vm).forEach((b) => b.setAttribute("aria-checked", String(b.dataset.m === (raters ? "raters" : "ptd"))));
    vt.textContent = it.title;
    vn.textContent = study ? (raters ? "What raters saw: PTD and the LightX2V four-step DMD LoRA as two rows of three seeds, in random order. Rows are not labelled here either." : "Four-step version, with its own sound.")
                           : "Six-step version, with its own sound.";
    vp.textContent = it.prompt || "";
    vv.poster = raters ? (it.comparePoster || "") : (it.poster || "");
    vv.src = raters ? it.compare : it.video;
    vv.muted = false; vv.play().catch(() => {});
  }
  function openViewer(kind, i) { cur = { kind, i, mode: "ptd" }; if (!dlg.open) dlg.showModal(); show(); }
  $$("button", vm).forEach((b) => b.addEventListener("click", () => { cur.mode = b.dataset.m; show(); }));
  const step = (d) => { const n = lists[cur.kind].length; cur.i = (cur.i + d + n) % n; cur.mode = "ptd"; show(); };
  $("#v-prev").addEventListener("click", () => step(-1));
  $("#v-next").addEventListener("click", () => step(1));
  $("#v-close").addEventListener("click", () => dlg.close());
  dlg.addEventListener("close", () => { vv.pause(); vv.removeAttribute("src"); vv.load(); });
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") step(-1); else if (e.key === "ArrowRight") step(1); });

  // ------------------------------------------------------------------ the idea: an interactive path
  const M = DATA.method, svg = $("#path-svg"), cap = $("#path-cap"), strip = $("#path-fig .strip");
  const PTS = [[70, 380], [190, 300], [310, 362], [440, 272], [570, 334], [700, 240], [830, 284], [955, 214], [1030, 232]];
  function spline(pts) {   // Catmull-Rom samples with cumulative arc length
    const s = []; let L = 0, prev = null;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      for (let k = 0; k < 40; k++) {
        const u = k / 40, u2 = u * u, u3 = u2 * u;
        const c = (j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * u + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * u2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * u3);
        const q = [c(0), c(1)]; if (prev) L += Math.hypot(q[0] - prev[0], q[1] - prev[1]); s.push([q[0], q[1], L]); prev = q;
      }
    }
    const e = pts[pts.length - 1]; L += Math.hypot(e[0] - prev[0], e[1] - prev[1]); s.push([e[0], e[1], L]);
    const at = (u) => { const t = Math.min(1, Math.max(0, u)) * L; let lo = 0, hi = s.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (s[m][2] < t) lo = m; else hi = m; }
      const a = s[lo], b = s[hi], f = b[2] > a[2] ? (t - a[2]) / (b[2] - a[2]) : 0; return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]; };
    const d = (u0, u1, n = 60) => { let out = ""; for (let k = 0; k <= n; k++) { const p = at(u0 + (u1 - u0) * k / n); out += (k ? " L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); } return out; };
    return { at, d, L };
  }
  const P = spline(PTS);
  const SPEED = { four: "11×", six: "7.5×" }, WORD = { four: "Four", six: "Six" };
  function drawPath(ver, animate) {
    const V = M.versions[ver]; if (!V) return;
    svg.textContent = "";
    const defs = el("defs", {}, svg);
    el("path", { class: "teacher", d: P.d(0, 1, 240) }, svg);
    const g0 = el("g", {}, svg), N = V.hops;
    for (let h = 0; h < N; h++) {   // strokes
      const u0 = h / N, u1 = (h + 1) / N, s = el("path", { class: "stroke", d: P.d(u0, u1), stroke: ramp((u0 + u1) / 2), pathLength: 1 }, g0);
      s.style.strokeDasharray = "1"; s.style.strokeDashoffset = animate && !reduce ? "1" : "0";
      if (animate && !reduce) setTimeout(() => (s.style.strokeDashoffset = "0"), 80 + h * 140);
    }
    // the teacher's fifty steps, as beads on top of the strokes
    for (let i = 0; i < 50; i++) { const p = P.at(i / 49); el("circle", { class: "dot", cx: p[0], cy: p[1], r: 1.9 }, svg); }
    // noise at the start
    const p0 = P.at(0);
    if (M.noise) { const cp = el("clipPath", { id: "cp-noise" }, defs); el("rect", { x: p0[0] - 26, y: p0[1] - 26, width: 52, height: 52, rx: 6 }, cp);
      el("image", { href: M.noise, x: p0[0] - 60, y: p0[1] - 40, width: 140, height: 80, "clip-path": "url(#cp-noise)", preserveAspectRatio: "xMidYMid slice" }, svg); }
    const sl = el("text", { class: "start-label", x: p0[0] - 26, y: p0[1] + 48 }, svg); sl.textContent = "Noise";
    // knots with their noise level, previews at the middle of each stroke
    const pw = 150, ph = 86;
    for (let h = 0; h <= N; h++) {
      const p = P.at(h / N), g = el("g", { class: "hop" }, svg);
      el("circle", { class: "knot", cx: p[0], cy: p[1], r: 7, stroke: ramp(h / N) }, g);
      const lab = el("text", { class: "knot-label", x: p[0] + 10, y: p[1] + (h % 2 ? -14 : 24) }, g); lab.textContent = "t = " + (+V.grid[h]).toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
      if (h < N - 1 && V.previews[h]) {   // the last stroke lands on the finished frame shown at the end
        const m = P.at((h + 0.5) / N), above = h % 2 === 0, x = m[0] - pw / 2, y = above ? m[1] - ph - 22 : m[1] + 22;
        const pg = el("g", { class: "pv", tabindex: "0", role: "img", "aria-label": `Prediction after step ${h + 1} of ${N}` }, g);
        el("rect", { class: "pv-frame", x: x - 3, y: y - 3, width: pw + 6, height: ph + 6, rx: 6 }, pg);
        const cp = el("clipPath", { id: `cp-${ver}-${h}` }, defs); el("rect", { x, y, width: pw, height: ph, rx: 4 }, cp);
        el("image", { href: V.previews[h], x, y, width: pw, height: ph, "clip-path": `url(#cp-${ver}-${h})`, preserveAspectRatio: "xMidYMid slice" }, pg);
        if (animate && !reduce) { pg.style.opacity = "0"; pg.style.transition = "opacity .5s"; setTimeout(() => (pg.style.opacity = "1"), 220 + h * 140); }
      }
    }
    // the finished frame at the end of the path
    const pe = P.at(1), fw = 236, fh = 135, fx = Math.min(1120 - fw - 4, pe[0] - fw / 2), fy = pe[1] - fh - 30;
    const fg = el("g", { class: "pv", tabindex: "0", role: "img", "aria-label": `${WORD[ver]}-step result` }, svg);
    el("rect", { class: "pv-frame", x: fx - 3, y: fy - 3, width: fw + 6, height: fh + 6, rx: 7 }, fg);
    const cpf = el("clipPath", { id: `cp-${ver}-final` }, defs); el("rect", { x: fx, y: fy, width: fw, height: fh, rx: 5 }, cpf);
    el("image", { href: V.final, x: fx, y: fy, width: fw, height: fh, "clip-path": `url(#cp-${ver}-final)`, preserveAspectRatio: "xMidYMid slice" }, fg);
    const fl = el("text", { class: "final-label", x: fx, y: fy - 12 }, svg); fl.textContent = `${WORD[ver]} steps`;
    cap.innerHTML = `<b>${WORD[ver]} steps.</b> Each coloured stroke is one network evaluation; the fifty dots are the teacher's steps. ` +
      `The pictures are the student's own predictions after each step, for the same prompt and starting noise. ${SPEED[ver]} faster than the fifty-step teacher.`;
    strip.textContent = ""; V.previews.slice(0, N - 1).concat([V.final]).forEach((src) => { const im = document.createElement("img"); im.src = src; im.alt = ""; im.loading = "lazy"; strip.appendChild(im); });
  }
  const segBtns = $$("#path-fig .seg button");
  const avail = segBtns.filter((b) => M.versions[b.dataset.v]);
  segBtns.forEach((b) => { if (!M.versions[b.dataset.v]) b.hidden = true; });
  const setVer = (ver, animate) => { segBtns.forEach((b) => b.setAttribute("aria-checked", String(b.dataset.v === ver))); drawPath(ver, animate); };
  segBtns.forEach((b) => {
    b.addEventListener("click", () => setVer(b.dataset.v, true));
    b.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft" || e.key === "ArrowRight") { const i = avail.indexOf(b), n = avail[(i + (e.key === "ArrowRight" ? 1 : avail.length - 1)) % avail.length]; n.focus(); setVer(n.dataset.v, true); } });
  });
  const firstVer = M.versions.six ? "six" : Object.keys(M.versions)[0];
  if (firstVer) {
    setVer(firstVer, false);
    // draw the strokes the first time the figure scrolls into view
    if (!reduce && "IntersectionObserver" in window) {
      const once = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { drawPath(firstVer, true); once.disconnect(); } }, { threshold: 0.45 });
      once.observe(svg);
    }
  }

  // ------------------------------------------------------------------ reference: three worlds
  const refV = $("#ref-video");
  $$(".t-ref .tabs button").forEach((b) => b.addEventListener("click", () => {
    $$(".t-ref .tabs button").forEach((o) => o.setAttribute("aria-selected", String(o === b)));
    const w = DATA.ref.worlds[+b.dataset.k]; refV.poster = w.poster; refV.dataset.src = w.video; refV.src = w.video; refV.play().catch(() => {});
  }));

  // ------------------------------------------------------------------ speed chart (one axis, direct labels)
  const sp = $("#speed-svg");
  if (sp) {
    const rows = [["Teacher, 50 steps", 343, "#b4b0a7", "343 s"], ["PTD, six steps", 45.9, "#8E5CFF", "46 s, 7.5× faster"], ["PTD, four steps", 31.6, "#4C6FFF", "31 s, 11× faster"]];
    const x0 = 210, x1 = 960, sx = (v) => x0 + (x1 - x0) * v / 360;
    [0, 100, 200, 300].forEach((v) => { el("line", { x1: sx(v), x2: sx(v), y1: 14, y2: 212, stroke: "#cfccc5", "stroke-width": 1 }, sp);
      const t = el("text", { x: sx(v), y: 236, "text-anchor": "middle", "font-size": 14, fill: "#6E6C68" }, sp); t.textContent = v + " s"; });
    rows.forEach(([name, v, c, lab], i) => {
      const y = 26 + i * 64;
      const n = el("text", { x: 0, y: y + 25, "font-size": 17, fill: "#1C1C1E" }, sp); n.textContent = name;
      el("rect", { x: x0, y, width: Math.max(4, sx(v) - x0), height: 38, rx: 3, fill: c }, sp);
      const l = el("text", { x: sx(v) + 12, y: y + 25, "font-size": 17, "font-weight": 600, fill: "#1C1C1E" }, sp); l.textContent = lab;
    });
  }

  // ------------------------------------------------------------------ tooltips (vote bar) and copy
  const tip = $(".tip");
  $$("[data-tip]").forEach((m) => {
    const show = (x, y) => { tip.textContent = m.dataset.tip; tip.style.left = x + "px"; tip.style.top = y + "px"; tip.classList.add("on"); };
    m.addEventListener("pointermove", (e) => show(e.clientX, e.clientY));
    m.addEventListener("pointerleave", () => tip.classList.remove("on"));
    m.addEventListener("focus", () => { const r = m.getBoundingClientRect(); show(r.left + r.width / 2, r.top); });
    m.addEventListener("blur", () => tip.classList.remove("on"));
  });
  $$("[data-copy]").forEach((b) => b.addEventListener("click", () => {
    const t = $(b.dataset.copy).textContent;
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => { b.textContent = "Copied"; setTimeout(() => (b.textContent = "Copy"), 1600); }).catch(() => {});
  }));
})();
