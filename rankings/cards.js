/* NEMTrepreneur "Best NEMT Software" card v2 (Oct 6 2026).
   Turns the Transparency / Features / Track record chips on every vendor card into buttons that open an
   in-card panel. Data: rankings/v2.json in the same GitHub Pages repo. The server HTML stays as the
   no-JS fallback (old checklist + sources), so crawlers and script failures still see every source. */
(function () {
  var BASE = (document.currentScript && document.currentScript.src || 'https://nemtrepreneur.github.io/nemtrepreneur-feed/rankings/').replace(/[^\/]*$/, '');
  var DATA = BASE + 'v2.json?v=20261006b';
  var METH = '#methodology';
  var TABS = { transparency: 'Transparency', features: 'Features', track: 'Track record' };

  var TCRIT = [
    ['Can you calculate your bill from the site', ['Quote only', 'Starting price only, or tiers and add-ons unpriced', 'Full price published, including tiers, per-trip fees and paid add-ons']],
    ['Broker integrations named', ['No broker named', '1 to 3 brokers named', '4 or more brokers named']],
    ['Driver app you can check', ['No driver app stated', 'One app store, or stated on the site', 'Listed in both app stores']],
    ['Claims billing', ['Not stated', 'General claims or Medicaid billing stated', 'Names 837P or EDI']],
    ['Security stated', ['Not stated', 'HIPAA stated', 'HIPAA stated and a BAA offered']],
    ['Try before you commit', ['Neither', 'No long-term contract stated', 'Free trial or self-serve signup']],
    ['Public help center', ['None public', 'Public but under 50 articles, or behind a login', 'Public knowledge base, 50+ articles']]
  ];
  var GROUPS = [
    ['Intake and booking', [['broker_import', 'Broker trip import'], ['broker_api_live', 'Live broker API', 1], ['facility_portal', 'Facility portal'], ['online_booking', 'Online booking', 1], ['recurring_trips', 'Recurring trips']]],
    ['Scheduling and routing', [['auto_scheduling', 'Auto-scheduling'], ['multi_load', 'Multi-load rides', 1], ['capacity_match', 'Vehicle matching (wheelchair, stretcher)', 1], ['trip_recovery', 'Trip recovery', 1]]],
    ['Dispatch and riders', [['live_dispatch_gps', 'Live dispatch GPS'], ['rider_notify', 'Rider notifications'], ['rider_tracking_link', 'Rider tracking link', 1], ['no_show_dry_run', 'No-show and dry-run handling', 1], ['ai_phone', 'AI phone agent']]],
    ['Driver app and compliance', [['driver_app', 'Driver app'], ['proof_of_service', 'Proof of service'], ['dvir', 'Pre-trip inspection (DVIR)', 1], ['audit_trail', 'Audit trail', 1], ['otp_tracking', 'On-time performance tracking', 1]]],
    ['Workforce and fleet', [['credentialing', 'Credential expiry tracking'], ['driver_pay', 'Driver pay'], ['telematics', 'Telematics or dashcam']]],
    ['Billing and revenue', [['claims_billing', 'Claims billing'], ['claim_automation', 'Claim scrubbing and submission', 1], ['rate_tables', 'Rate tables', 1], ['private_pay', 'Private-pay payments'], ['accounting_export', 'Accounting export']]],
    ['Reporting and platform', [['reporting', 'Reporting'], ['open_api', 'Open API or webhooks', 1], ['ai_assistant', 'AI assistant', 1]]]
  ];
  var ALSO = [['eligibility', 'Eligibility verification'], ['prior_auth', 'Prior authorization'], ['will_call', 'Will-call returns'], ['offline', 'Offline driver app'], ['maintenance', 'Preventive maintenance'], ['incident', 'Incident reporting'], ['dashcam', 'Dashcam integration'], ['multilingual', 'Multilingual rider messages'], ['rider_feedback', 'Rider feedback']];
  var COM = [['pricing_model', 'Pricing model'], ['starting_price', 'Starting price'], ['contract_term', 'Contract'], ['setup_fee', 'Setup fee'], ['migration', 'Data migration'], ['support', 'Support']];
  var STL = { c: 'Confirmed', p: 'Partial', x: 'Not found publicly' };

  var CSS = '.rk-r .rk-b li.rk-ch{padding:0;background:none}' +
    '.rk-cb{display:inline-flex;align-items:center;gap:7px;background:#F3F5F7;border:1px solid #E3E9EF;border-radius:8px;padding:5px 10px;font:inherit;font-size:13px;color:#131313;cursor:pointer;line-height:1.3}' +
    '.rk-cb:hover{border-color:#B45309}.rk-cb:focus-visible{outline:2px solid #D97706;outline-offset:2px}' +
    '.rk-cb[aria-expanded=true]{background:#FFF4DC;border-color:#B45309}' +
    '.rk-cb:after{content:"";width:6px;height:6px;border-right:2px solid currentColor;border-bottom:2px solid currentColor;transform:rotate(45deg);margin:-3px 0 0 1px;transition:transform .15s}' +
    '.rk-cb[aria-expanded=true]:after{transform:rotate(-135deg);margin-top:3px}' +
    '.rk-pn{grid-column:1/-1;min-width:0;overflow-wrap:anywhere;border-top:1px solid #E3E9EF;margin-top:6px;padding-top:12px;font-size:14px;color:#2b2b2b}' +
    '.rk-pn[hidden]{display:none}.rk-pn .rk-ex{margin:0 0 10px;color:#5B6B7B;font-size:13.5px}.rk-pn .rk-ex a{color:#B45309}' +
    '.rk-pn h4{font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:#5B6B7B;margin:14px 0 6px}' +
    '.rk-tt{width:100%;border-collapse:collapse;font-size:13.5px;table-layout:auto}.rk-tt td{border-top:1px solid #EEF1F4;padding:7px 6px;vertical-align:top}' +
    '.rk-tt td:nth-child(2){white-space:nowrap;font-weight:700}.rk-tt a{color:#B45309}' +
    '.rk-pts{display:inline-block;min-width:34px;text-align:center;border-radius:6px;padding:1px 6px;font-size:12.5px}' +
    '.rk-p2{background:#E7F5EE;color:#0B6E4F}.rk-p1{background:#FFF4DC;color:#7A4E00}.rk-p0{background:#F3F5F7;color:#5B6B7B}' +
    '.rk-pn .rk-fl{margin-top:4px}.rk-pn .rk-fl li.n .rk-new{font-size:10.5px;font-weight:700;color:#B45309;margin-left:4px;text-transform:uppercase;letter-spacing:.03em}' +
    '.rk-cm{display:grid;grid-template-columns:150px 1fr;gap:4px 12px;margin:0;font-size:13.5px}.rk-cm dt{font-weight:700;color:#131313}.rk-cm dd{margin:0}.rk-cm a{color:#B45309}' +
    '.rk-pn .rk-fl li.u{background:#F3F5F7;color:#5B6B7B}.rk-pn .rk-fl li.u:before{content:"\\2026"}.rk-pn .rk-fl li.u:after{content:" (not checked yet)"}'+'@media (max-width:600px){.rk-pn .rk-tt,.rk-pn .rk-tt tbody,.rk-pn .rk-tt tr{display:block;width:auto}.rk-pn .rk-tt tr{border-top:1px solid #EEF1F4;padding:8px 0}.rk-pn .rk-tt td{display:inline-block;border:0!important;padding:0 8px 0 0!important;background:none!important}.rk-pn .rk-tt td:nth-child(3){display:block;margin-top:3px}.rk-cm{grid-template-columns:1fr}.rk-cm dd{margin-bottom:6px}}';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function rel(v) { return v.sp ? 'sponsored noopener' : 'nofollow noopener'; }
  function a(v, url, text) { return url ? '<a href="' + esc(url) + '" rel="' + rel(v) + '" target="_blank">' + esc(text) + '</a>' : esc(text); }
  function host(u) { var h = String(u).replace(/^https?:\/\/(www\.)?/, '').replace(/[?#].*$/, '').replace(/\/$/, ''); return h.length > 38 ? h.split('/')[0] + '/\u2026' : h; }

  function transparency(v) {
    var h = '<p class="rk-ex">Transparency measures what an operator can check before talking to sales. 7 criteria, 0 to 2 points each. <a href="' + METH + '">How we score</a></p><table class="rk-tt"><tbody>';
    for (var i = 0; i < 7; i++) {
      var p = v.t[i], s = v.ts[i];
      h += '<tr><td>' + esc(TCRIT[i][0]) + '</td><td><span class="rk-pts rk-p' + p + '">' + p + ' of 2</span></td><td>' + esc(TCRIT[i][1][p]) + (s ? '. Source: ' + a(v, s, host(s)) : '') + '</td></tr>';
    }
    h += '</tbody></table>';
    var c = v.com, any = false, cm = '<h4>What they publish</h4><dl class="rk-cm">';
    for (var j = 0; j < COM.length; j++) { var x = c[COM[j][0]]; if (!x) continue; any = true; cm += '<dt>' + COM[j][1] + '</dt><dd>' + (x[1] && !/^Not published/.test(x[0]) ? a(v, x[1], x[0]) : esc(x[0])) + '</dd>'; }
    if (any) h += cm + '</dl>';
    return h + '<p class="rk-ex" style="margin-top:10px">Pricing and terms as published on ' + fmt(D.checked_new) + '. Not scored here; the price criterion above scores whether the bill can be calculated.</p>';
  }

  function item(v, key, label, isNew, cell) {
    if (!cell) return '<li class="u' + (isNew ? ' n' : '') + '">' + esc(label) + (isNew ? '<span class="rk-new">New</span>' : '') + '</li>';
    var cls = cell[0], t = STL[cls] + (cell[2] ? ': ' + cell[2] : '');
    var inner = cell[1] && cls !== 'x' ? '<a href="' + esc(cell[1]) + '" rel="' + rel(v) + '" target="_blank" title="' + esc(t) + '">' + esc(label) + '</a>' : '<span title="' + esc(t) + '">' + esc(label) + '</span>';
    return '<li class="' + cls + (isNew ? ' n' : '') + '">' + inner + (isNew ? '<span class="rk-new">New</span>' : '') + '</li>';
  }

  function features(v) {
    var have = v.nf && Object.keys(v.nf).length;
    var h = '<p class="rk-ex">Features counts what the vendor shows publicly, with a link to each source. Confirmed = 1, Partial or paid add-on = 0.5, then halved, so 16 features are worth 8 points. Not found publicly means we could not find it, not that the product lacks it. Items marked New were added October 2026 and count toward the score from November 1. <a href="' + METH + '">How we score</a></p>';
    for (var g = 0; g < GROUPS.length; g++) {
      h += '<h4>' + GROUPS[g][0] + '</h4><ul class="rk-fl">';
      var L = GROUPS[g][1];
      for (var i = 0; i < L.length; i++) {
        var k = L[i][0], isNew = !!L[i][2];
        var cell = isNew ? (have ? v.nf[k] : null) : v.f[k];
        h += item(v, k, L[i][1], isNew, cell);
      }
      h += '</ul>';
    }
    if (!have) h += '<p class="rk-ex">New features for this vendor are being checked for the November 1 update.</p>';
    if (v.also && Object.keys(v.also).length) {
      h += '<h4>Also tracked, not scored</h4><ul class="rk-fl">';
      for (var j = 0; j < ALSO.length; j++) h += item(v, ALSO[j][0], ALSO[j][1], false, v.also[ALSO[j][0]]);
      h += '</ul>';
    }
    return h + '<p class="rk-ex" style="margin-top:10px">Original 16 checked ' + fmt(D.checked_v1) + '; new items checked ' + fmt(D.checked_new) + '. Vendors can send a correction any time.</p>';
  }

  function track(v) {
    var t = v.tk, yrs = 2026 - t.founded;
    var yp = yrs < 3 ? 0 : yrs < 8 ? 1 : 2, cp = t.nc === 0 ? 0 : t.nc < 5 ? 1 : 2;
    var h = '<p class="rk-ex">Track record measures years operating and customers the vendor names on its own site. Tier 1 also requires 3+ years, 3+ named customers and named leadership. <a href="' + METH + '">How we score</a></p><table class="rk-tt"><tbody>';
    h += '<tr><td>Years operating</td><td><span class="rk-pts rk-p' + yp + '">' + yp + ' of 2</span></td><td>Since ' + t.founded + ' (company or predecessor). 8+ years = 2, 3 to 7 = 1.</td></tr>';
    h += '<tr><td>Customers named</td><td><span class="rk-pts rk-p' + cp + '">' + cp + ' of 2</span></td><td>' + t.nc + ' named on the vendor\'s site' + (t.ex.length ? ', including ' + esc(t.ex.join(', ')) : '') + '. 5+ = 2, 1 to 4 = 1.</td></tr>';
    h += '</tbody></table><dl class="rk-cm" style="margin-top:10px">';
    h += '<dt>Leadership</dt><dd>' + (t.lead && !/^not /i.test(t.lead) ? esc(t.lead) : 'Not identified publicly') + '</dd>';
    if (t.own) h += '<dt>Owned by</dt><dd>' + esc(t.own) + '</dd>';
    if (t.dd) h += '<dt>Tier 1 check</dt><dd>' + esc(t.dd.replace(/\s+/g, ' ')) + '</dd>';
    h += '</dl>';
    if (v.src && v.src.length) { h += '<h4>Sources</h4><ul style="margin:0;padding-left:18px">'; for (var i = 0; i < v.src.length; i++) h += '<li>' + a(v, v.src[i], host(v.src[i])) + '</li>'; h += '</ul>'; }
    return h;
  }
  function fmt(d) { var m = /^(\d+)-(\d+)-(\d+)$/.exec(d); var M = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; return m ? M[+m[2] - 1] + ' ' + (+m[3]) + ', ' + m[1] : d; }


  /* Sticky left rail (Oct 6 2026, Nick): jump links, filters and vendor list. Shows once the reader scrolls past the
     "On this page" chips. Desktop: fixed in the left margin. Narrow screens: a floating "Jump to" button opens it. */
  var RCSS = '.rk-rail{position:fixed;top:88px;z-index:40;font-size:13px;line-height:1.35;color:#131313;max-height:calc(100vh - 104px);overflow:auto;opacity:0;visibility:hidden;transform:translateX(-6px);transition:opacity .2s,transform .2s,visibility .2s;scrollbar-width:thin}' +
    '.rk-rail.on{opacity:1;visibility:visible;transform:none}' +
    '.rk-rail h5{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#5B6B7B;margin:14px 0 6px;font-weight:700}.rk-rail h5:first-child{margin-top:0}' +
    '.rk-rail a{display:flex;justify-content:space-between;gap:8px;color:#131313;text-decoration:none;padding:4px 8px;border-radius:6px;border-left:2px solid transparent}' +
    '.rk-rail a:hover{background:#F3F5F7}.rk-rail a.cur{border-left-color:#D97706;background:#FFF4DC;font-weight:700}.rk-rail a small{color:#5B6B7B;font-weight:400}' +
    '.rk-rail a.dim{opacity:.35}.rk-rail select{width:100%;font:inherit;font-size:13px;padding:5px 6px;border:1px solid #E3E9EF;border-radius:6px;background:#fff;color:#131313}' +
    '.rk-rail label{display:flex;gap:6px;align-items:flex-start;padding:3px 2px;margin:0;cursor:pointer;text-transform:none;letter-spacing:normal;font-weight:400;font-size:13px;line-height:1.35;color:#131313}'+'.rk-rail label span{text-transform:none;letter-spacing:normal;font-weight:400}.rk-rail input{margin-top:2px;accent-color:#B45309}' +
    '.rk-rail .rk-cnt{margin:6px 2px 0;color:#5B6B7B}.rk-rail button.rk-rst{background:none;border:0;padding:0;font:inherit;color:#B45309;text-decoration:underline;cursor:pointer}' +
    '.rk-rail a:focus-visible,.rk-rail select:focus-visible,.rk-rail input:focus-visible,.rk-fab:focus-visible{outline:2px solid #D97706;outline-offset:2px}' +
    '.rk-fab{position:fixed;left:16px;bottom:16px;z-index:41;background:#131313;color:#fff;border:0;border-radius:999px;padding:10px 16px;font:inherit;font-size:14px;font-weight:700;box-shadow:0 4px 14px rgba(0,0,0,.18);cursor:pointer;display:none}' +
    '.rk-fab.on{display:block}.rk-rail.sheet{left:12px!important;right:12px;top:auto;bottom:64px;width:auto!important;max-height:70vh;background:#fff;border:1px solid #E3E9EF;border-radius:14px;padding:14px;box-shadow:0 10px 30px rgba(0,0,0,.18)}' +
    '.rk-hide{display:none!important}.rk-none{border:1px dashed #E3E9EF;border-radius:10px;padding:10px 14px;color:#5B6B7B;font-size:14px;margin:0 0 12px}' +
    '@media (prefers-reduced-motion:reduce){.rk-rail{transition:none}}';
  var FLT = [['price', 'Pricing published', function (v) { return v.t[0] >= 1; }], ['try', 'Free trial or self-serve signup', function (v) { return v.t[5] === 2; }], ['help', 'Public help center, 50+ articles', function (v) { return v.t[6] === 2; }], ['month', 'Month-to-month stated', function (v) { return /month-to-month|monthly|no long-term|no annual|cancel any/i.test((v.com.contract_term || [''])[0]); }]];

  function rail() {
    var jump = document.querySelector('.rk-jump'), arts = [].slice.call(document.querySelectorAll('article.rk-r[id]'));
    if (!jump || !arts.length) return;
    var secs = [['tier-1', 'Tier 1'], ['tier-2', 'Tier 2'], ['tier-3', 'Tier 3'], ['enterprise', 'Enterprise platforms'], ['methodology', 'Methodology']].filter(function (x) { return document.getElementById(x[0]); });
    var heads = [].slice.call(document.querySelectorAll('h2[id^="tier-"]'));
    function tierOf(a) { var t = ''; heads.forEach(function (hd) { if (hd.compareDocumentPosition(a) & 4) t = hd.id; }); return t; }
    var tiers = {}; arts.forEach(function (a) { var t = tierOf(a); a.setAttribute('data-tier', t); tiers[t] = (tiers[t] || 0) + 1; });
    var r = document.createElement('nav'); r.className = 'rk-rail'; r.setAttribute('aria-label', 'Jump and filter');
    var h = '<h5>On this page</h5><a href="#" data-go="top">Top <small>&uarr;</small></a>';
    secs.forEach(function (x) { h += '<a href="#' + x[0] + '" data-sec="' + x[0] + '">' + x[1] + (tiers[x[0]] ? ' <small data-n="' + x[0] + '">' + tiers[x[0]] + '</small>' : '') + '</a>'; });
    h += '<a href="#" data-go="bottom">Bottom <small>&darr;</small></a>';
    h += '<h5>Filter</h5><select aria-label="Must have this feature confirmed"><option value="">Any feature</option>';
    GROUPS.forEach(function (g) { h += '<optgroup label="' + g[0] + '">'; g[1].forEach(function (f) { h += '<option value="' + f[0] + '">' + esc(f[1]) + '</option>'; }); h += '</optgroup>'; });
    h += '</select>';
    FLT.forEach(function (f) { h += '<label><input type="checkbox" value="' + f[0] + '"> <span>' + f[1] + '</span></label>'; });
    h += '<p class="rk-cnt" aria-live="polite"></p><h5>Vendors</h5>';
    arts.forEach(function (a) { var v = D.vendors[a.id]; var sc = (a.querySelector('.rk-s b') || {}).textContent || ''; h += '<a href="#' + a.id + '" data-v="' + a.id + '">' + esc(v ? v.n.replace(/ \(.*\)$/, '').replace(/ by Momentm| Technologies/, '') : a.id) + ' <small>' + esc(sc) + '</small></a>'; });
    r.innerHTML = h; document.body.appendChild(r);
    var fab = document.createElement('button'); fab.type = 'button'; fab.className = 'rk-fab'; fab.textContent = 'Jump to'; fab.setAttribute('aria-expanded', 'false'); document.body.appendChild(fab);
    var sheet = false;
    fab.addEventListener('click', function () { var o = !r.classList.contains('on'); r.classList.toggle('on', o); fab.setAttribute('aria-expanded', o ? 'true' : 'false'); fab.textContent = o ? 'Close' : 'Jump to'; });
    r.addEventListener('click', function (e) {
      var a = e.target.closest('a'); if (!a) return;
      var go = a.getAttribute('data-go');
      if (go) { e.preventDefault(); window.scrollTo({ top: go === 'top' ? 0 : document.documentElement.scrollHeight, behavior: 'smooth' }); }
      if (sheet) { r.classList.remove('on'); fab.setAttribute('aria-expanded', 'false'); fab.textContent = 'Jump to'; }
    });
    var sel = r.querySelector('select'), boxes = [].slice.call(r.querySelectorAll('input[type=checkbox]')), cnt = r.querySelector('.rk-cnt');
    function apply() {
      var f = sel.value, on = boxes.filter(function (b) { return b.checked; }).map(function (b) { return b.value; }), shown = 0, per = {};
      arts.forEach(function (a) {
        var v = D.vendors[a.id], ok = true;
        if (v && f) { var c = v.f[f] || v.nf[f]; ok = !!c && c[0] === 'c'; }
        if (v) on.forEach(function (k) { FLT.forEach(function (x) { if (x[0] === k && !x[2](v)) ok = false; }); });
        a.classList.toggle('rk-hide', !ok); if (ok) { shown++; per[a.getAttribute('data-tier')] = (per[a.getAttribute('data-tier')] || 0) + 1; }
        var l = r.querySelector('a[data-v="' + a.id + '"]'); if (l) l.classList.toggle('dim', !ok);
      });
      secs.forEach(function (x) {
        var n = r.querySelector('small[data-n="' + x[0] + '"]'); if (n) n.textContent = per[x[0]] || 0;
        var hd = document.getElementById(x[0]), note = hd && hd.parentNode.querySelector('.rk-none[data-for="' + x[0] + '"]');
        if (!tiers[x[0]] || !hd) return;
        if (!per[x[0]] && (f || on.length)) { if (!note) { note = document.createElement('p'); note.className = 'rk-none'; note.setAttribute('data-for', x[0]); note.textContent = 'No vendor in this tier matches the filters.'; var after = hd.nextElementSibling && hd.nextElementSibling.classList.contains('lede') ? hd.nextElementSibling : hd; after.parentNode.insertBefore(note, after.nextSibling); } }
        else if (note) note.parentNode.removeChild(note);
      });
      cnt.innerHTML = (f || on.length) ? 'Showing ' + shown + ' of ' + arts.length + '. <button type="button" class="rk-rst">Reset</button>' : '';
      var rb = cnt.querySelector('.rk-rst'); if (rb) rb.addEventListener('click', function () { sel.value = ''; boxes.forEach(function (b) { b.checked = false; }); apply(); });
    }
    sel.addEventListener('change', apply); boxes.forEach(function (b) { b.addEventListener('change', apply); });
    function place() {
      var left = arts[0].getBoundingClientRect().left, w = Math.min(210, left - 40);
      sheet = w < 150;
      r.classList.toggle('sheet', sheet);
      if (!sheet) { r.style.width = w + 'px'; r.style.left = Math.max(16, left - w - 24) + 'px'; fab.classList.remove('on'); }
      else { r.style.width = ''; r.style.left = ''; }
      tick();
    }
    function tick() {
      var past = jump.getBoundingClientRect().bottom < 0, y = 140, cur = '';
      if (!sheet) r.classList.toggle('on', past); else { fab.classList.toggle('on', past); if (!past) { r.classList.remove('on'); fab.textContent = 'Jump to'; } }
      secs.forEach(function (x) { var e = document.getElementById(x[0]); if (e && e.getBoundingClientRect().top < y) cur = x[0]; });
      var curV = ''; arts.forEach(function (a) { if (!a.classList.contains('rk-hide') && a.getBoundingClientRect().top < y) curV = a.id; });
      [].forEach.call(r.querySelectorAll('a[data-sec]'), function (a) { a.classList.toggle('cur', a.getAttribute('data-sec') === cur); });
      [].forEach.call(r.querySelectorAll('a[data-v]'), function (a) { a.classList.toggle('cur', a.getAttribute('data-v') === curV && (cur === 'tier-1' || cur === 'tier-2' || cur === 'tier-3')); });
    }
    var raf = 0; window.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(function () { raf = 0; tick(); }); }, { passive: true });
    window.addEventListener('resize', place); place();
  }

  var D;
  function render(v, tab) { return tab === 'transparency' ? transparency(v) : tab === 'features' ? features(v) : track(v); }

  function enhance(art) {
    var id = art.id, v = D.vendors[id], ul = art.querySelector('ul.rk-b');
    if (!v || !ul || art.getAttribute('data-rk2')) return;
    art.setAttribute('data-rk2', '1');
    var pn = document.createElement('div');
    pn.className = 'rk-pn'; pn.id = id + '-panel'; pn.hidden = true; pn.setAttribute('role', 'region');
    var btns = [];
    var lis = ul.querySelectorAll('li');
    for (var i = 0; i < lis.length; i++) {
      var li = lis[i], txt = li.textContent, tab = /^Transparency/.test(txt) ? 'transparency' : /^Features/.test(txt) ? 'features' : /^Track/.test(txt) ? 'track' : null;
      if (!tab) continue;
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'rk-cb'; b.innerHTML = li.innerHTML; b.setAttribute('data-tab', tab);
      b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-controls', pn.id);
      b.title = 'Show how ' + v.n + ' scored on ' + TABS[tab];
      li.innerHTML = ''; li.className = 'rk-ch'; li.appendChild(b); btns.push(b);
    }
    function open(tab, push) {
      var cur = pn.getAttribute('data-tab');
      if (!pn.hidden && cur === tab) { close(); return; }
      pn.innerHTML = render(v, tab); pn.setAttribute('data-tab', tab); pn.setAttribute('aria-label', v.n + ': ' + TABS[tab]); pn.hidden = false;
      for (var j = 0; j < btns.length; j++) btns[j].setAttribute('aria-expanded', btns[j].getAttribute('data-tab') === tab ? 'true' : 'false');
      if (push && history.replaceState) history.replaceState(null, '', '#' + id + '-' + tab);
    }
    function close() {
      pn.hidden = true; pn.removeAttribute('data-tab');
      for (var j = 0; j < btns.length; j++) btns[j].setAttribute('aria-expanded', 'false');
      if (history.replaceState && /-(transparency|features|track)$/.test(location.hash)) history.replaceState(null, '', location.pathname + location.search);
    }
    for (var k = 0; k < btns.length; k++) btns[k].addEventListener('click', function () { open(this.getAttribute('data-tab'), true); });
    var old = art.querySelector('details.rk-fx'); if (old) old.style.display = 'none';
    var srcd = null, ds = art.querySelectorAll('details');
    for (var m = 0; m < ds.length; m++) if (/^Sources/.test((ds[m].querySelector('summary') || {}).textContent || '')) srcd = ds[m];
    if (srcd) srcd.style.display = 'none';
    art.appendChild(pn);
    art._rkOpen = open;
  }

  function fromHash() {
    var m = /^#([a-z0-9-]+)-(transparency|features|track)$/.exec(location.hash);
    if (!m) return;
    var art = document.getElementById(m[1]);
    if (art && art._rkOpen) { art._rkOpen(m[2], false); art.scrollIntoView({ block: 'start' }); }
  }

  function init(data) {
    D = data;
    var st = document.createElement('style'); st.textContent = CSS + RCSS; document.head.appendChild(st);
    var arts = document.querySelectorAll('article.rk-r[id]');
    for (var i = 0; i < arts.length; i++) enhance(arts[i]);
    try { rail(); } catch (e) {}
    fromHash();
    window.addEventListener('hashchange', fromHash);
  }

  function go() {
    if (!document.querySelector('article.rk-r[id]')) return;
    fetch(DATA).then(function (r) { if (!r.ok) throw r.status; return r.json(); }).then(init).catch(function () { /* keep the server HTML as is */ });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
