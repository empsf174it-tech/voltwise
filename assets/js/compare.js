document.addEventListener('DOMContentLoaded', () => {
  const table = document.getElementById('matrix');
  if (!table) return;

  const MIN = 2;
  const MAX = 4;
  const img = (id, w = 240) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
  const money = n => '$' + n.toLocaleString('en-US');

  // Demo data — all prices and specs are placeholders
  const DEVICES = [
    { id: 'titanium-pro-max', name: 'Titanium Pro Max', merchant: 'merchant-a', score: 9.2, img: '1592750475338-74b7b21085ab',
      v: { price: 1099, score: 9.2, size: 6.7, panel: 'OLED', refresh: 120, nits: 2500, chip: 'A17 Pro Bionic', ram: 8, storage: 256,
           mah: 4852, life: '14h 22m', wired: 27, wireless: true, mp: 48, zoom: '5x optical', uw: true, v8k: false,
           mmwave: true, wifi: 'Wi-Fi 6E', usb: 'USB-C 3.0', esim: true, weight: 221, frame: 'Titanium', ip: 'IP68' } },
    { id: 'quantum-pixel-7', name: 'Quantum Pixel 7', merchant: 'merchant-b', score: 8.5, img: '1511707171634-5f897ff02aa9',
      v: { price: 599, score: 8.5, size: 6.1, panel: 'AMOLED', refresh: 90, nits: 1400, chip: 'Tensor G3', ram: 8, storage: 128,
           mah: 4355, life: '10h 45m', wired: 27, wireless: true, mp: 50, zoom: '2x digital', uw: true, v8k: false,
           mmwave: false, wifi: 'Wi-Fi 6E', usb: 'USB-C 3.2', esim: true, weight: 187, frame: 'Aluminum', ip: 'IP68' } },
    { id: 'galaxy-z-ultra', name: 'Galaxy Z Ultra', merchant: 'merchant-c', score: 8.9, img: '1610945265064-0e34e5519bbf',
      v: { price: 1299, score: 8.9, size: 6.8, panel: 'AMOLED', refresh: 144, nits: 2600, chip: 'Snapdragon 8 Gen 3', ram: 12, storage: 256,
           mah: 5000, life: '13h 10m', wired: 45, wireless: true, mp: 200, zoom: '10x optical', uw: true, v8k: true,
           mmwave: true, wifi: 'Wi-Fi 7', usb: 'USB-C 3.2', esim: true, weight: 232, frame: 'Titanium', ip: 'IP68' } },
    { id: 'nova-lite-5', name: 'Nova Lite 5', merchant: 'merchant-b', score: 7.8, img: '1695048133142-1a20484d2569',
      v: { price: 349, score: 7.8, size: 6.5, panel: 'LCD', refresh: 90, nits: 800, chip: 'Dimensity 7200', ram: 6, storage: 128,
           mah: 5000, life: '15h 05m', wired: 33, wireless: false, mp: 50, zoom: 'None', uw: true, v8k: false,
           mmwave: false, wifi: 'Wi-Fi 6', usb: 'USB-C 2.0', esim: false, weight: 195, frame: 'Plastic', ip: 'IP54' } },
    { id: 'fold-edge-x', name: 'Fold Edge X', merchant: 'merchant-c', score: 8.6, img: '1580910051074-3eb694886505',
      v: { price: 1799, score: 8.6, size: 7.6, panel: 'Foldable OLED', refresh: 120, nits: 2200, chip: 'Snapdragon 8 Gen 3', ram: 12, storage: 512,
           mah: 4400, life: '11h 30m', wired: 25, wireless: true, mp: 50, zoom: '3x optical', uw: true, v8k: false,
           mmwave: true, wifi: 'Wi-Fi 7', usb: 'USB-C 3.2', esim: true, weight: 253, frame: 'Aluminum', ip: 'IPX8' } },
    { id: 'aero-mini', name: 'Aero Mini', merchant: 'merchant-a', score: 8.3, img: '1592899677977-9c10ca588bbd',
      v: { price: 699, score: 8.3, size: 5.9, panel: 'OLED', refresh: 120, nits: 1800, chip: 'A16 Bionic', ram: 6, storage: 128,
           mah: 3300, life: '9h 40m', wired: 20, wireless: true, mp: 48, zoom: '2x optical', uw: false, v8k: false,
           mmwave: true, wifi: 'Wi-Fi 6', usb: 'USB-C 2.0', esim: true, weight: 168, frame: 'Aluminum', ip: 'IP68' } }
  ];

  // Row types: text, num (tabular, optional unit/format) or bool (check / x icon)
  const GROUPS = [
    { id: 'price', label: 'Price & score', icon: 'ph-tag', rows: [
      { key: 'price', label: 'Launch price', type: 'num', fmt: money },
      { key: 'score', label: 'Voltwise score', type: 'num', fmt: n => n.toFixed(1) + ' / 10' } ] },
    { id: 'display', label: 'Display', icon: 'ph-monitor', rows: [
      { key: 'size', label: 'Screen size', type: 'num', fmt: n => n.toFixed(1) + '"' },
      { key: 'panel', label: 'Panel', type: 'text' },
      { key: 'refresh', label: 'Refresh rate', type: 'num', unit: 'Hz' },
      { key: 'nits', label: 'Peak brightness', type: 'num', fmt: n => n.toLocaleString('en-US') + ' nits' } ] },
    { id: 'performance', label: 'Performance', icon: 'ph-cpu', rows: [
      { key: 'chip', label: 'Chipset', type: 'text' },
      { key: 'ram', label: 'RAM', type: 'num', unit: 'GB' },
      { key: 'storage', label: 'Base storage', type: 'num', unit: 'GB' } ] },
    { id: 'battery', label: 'Battery', icon: 'ph-battery-full', rows: [
      { key: 'mah', label: 'Capacity', type: 'num', fmt: n => n.toLocaleString('en-US') + ' mAh' },
      { key: 'life', label: 'Lab battery life', type: 'num' },
      { key: 'wired', label: 'Wired charging', type: 'num', unit: 'W' },
      { key: 'wireless', label: 'Wireless charging', type: 'bool' } ] },
    { id: 'camera', label: 'Camera', icon: 'ph-camera', rows: [
      { key: 'mp', label: 'Main sensor', type: 'num', unit: 'MP' },
      { key: 'zoom', label: 'Telephoto', type: 'text' },
      { key: 'uw', label: 'Ultrawide lens', type: 'bool' },
      { key: 'v8k', label: '8K video', type: 'bool' } ] },
    { id: 'connectivity', label: 'Connectivity', icon: 'ph-wifi-high', rows: [
      { key: 'mmwave', label: '5G mmWave', type: 'bool' },
      { key: 'wifi', label: 'Wi-Fi', type: 'text' },
      { key: 'usb', label: 'Port', type: 'text' },
      { key: 'esim', label: 'eSIM', type: 'bool' } ] },
    { id: 'build', label: 'Build', icon: 'ph-cube', rows: [
      { key: 'weight', label: 'Weight', type: 'num', unit: 'g' },
      { key: 'frame', label: 'Frame', type: 'text' },
      { key: 'ip', label: 'Water resistance', type: 'text' } ] }
  ];

  const state = {
    selected: ['titanium-pro-max', 'quantum-pixel-7', 'galaxy-z-ultra'],
    diffOnly: false,
    collapsed: new Set()
  };

  const tray = document.getElementById('mx-tray');
  const addSelect = document.getElementById('mx-add');
  const addBtn = document.getElementById('mx-add-btn');
  const diffToggle = document.getElementById('mx-diff');
  const msg = document.getElementById('mx-msg');

  const byId = id => DEVICES.find(d => d.id === id);

  function affiliateLink(d) {
    const url = `https://merchant.example/product?utm_source=voltwise&amp;utm_medium=affiliate&amp;utm_campaign=compare&amp;utm_content=${d.id}`;
    return `<!-- AFFILIATE_LINK -->
      <a href="${url}" class="btn btn-primary btn-sm" rel="sponsored noopener" target="_blank"
         data-affiliate="true" data-product-id="${d.id}" data-merchant="${d.merchant}" data-placement="matrix">
        Check price <i class="ph ph-arrow-up-right" aria-hidden="true"></i><span class="sr-only"> for ${d.name} (opens in a new tab)</span>
      </a>`;
  }

  function cell(row, value) {
    if (row.type === 'bool') {
      return value
        ? '<i class="ph-fill ph-check-circle mx-yes" aria-hidden="true"></i><span class="sr-only">Yes</span>'
        : '<i class="ph ph-x-circle mx-no" aria-hidden="true"></i><span class="sr-only">No</span>';
    }
    if (row.fmt) return row.fmt(value);
    return row.unit ? `${value} ${row.unit}` : value;
  }

  function winners(devices) {
    const overall = devices.reduce((a, b) => (b.score > a.score ? b : a));
    const value = devices.reduce((a, b) => (b.score / b.v.price > a.score / a.v.price ? b : a));
    return { overall: overall.id, value: value.id };
  }

  function render() {
    const devices = state.selected.map(byId);
    const best = winners(devices);
    const colClass = d => [d.id === best.overall ? 'is-best-overall' : '', d.id === best.value ? 'is-best-value' : ''].join(' ').trim();

    table.style.setProperty('--cols', devices.length);

    const head = devices.map(d => {
      const badges = [
        d.id === best.overall ? '<span class="badge">Best overall</span>' : '',
        d.id === best.value ? '<span class="badge badge-accent">Best value</span>' : ''
      ].join('');
      return `<th scope="col" class="${colClass(d)}">
        <div class="mx-head">
          <div class="mx-badges">${badges}</div>
          <img src="${img(d.img)}" alt="${d.name}" width="88" height="88" loading="lazy">
          <span class="mx-name">${d.name}</span>
          <span class="mx-score">Voltwise score <span class="mono">${d.score.toFixed(1)}</span>/10</span>
          ${affiliateLink(d)}
          <a href="review-detail.html" class="mx-link">Read review</a>
        </div>
      </th>`;
    }).join('');

    let visibleRows = 0;
    const bodies = GROUPS.map(g => {
      const rows = g.rows.map(r => {
        const vals = devices.map(d => d.v[r.key]);
        const same = vals.every(v => String(v) === String(vals[0]));
        const hidden = state.diffOnly && same;
        if (!hidden) visibleRows++;
        const tds = devices.map((d, i) =>
          `<td class="${r.type === 'num' ? 'mx-num ' : ''}${colClass(d)}">${cell(r, vals[i])}</td>`).join('');
        return { hidden, html: `<th scope="row">${r.label}</th>${tds}` };
      });
      const groupHidden = rows.every(r => r.hidden);
      const open = !state.collapsed.has(g.id);
      const rowsHtml = rows.map(r =>
        `<tr class="${r.hidden || !open ? 'is-hidden' : ''}">${r.html}</tr>`).join('');
      return `<tbody class="${groupHidden ? 'is-hidden' : ''}" id="mx-group-${g.id}">
        <tr class="mx-group">
          <th scope="rowgroup" colspan="${devices.length + 1}">
            <button type="button" aria-expanded="${open}" data-group="${g.id}">
              <i class="ph ph-caret-down" aria-hidden="true"></i>
              <i class="ph ${g.icon} mx-group-icon" aria-hidden="true"></i>${g.label}
            </button>
          </th>
        </tr>${rowsHtml}
      </tbody>`;
    }).join('');

    const empty = visibleRows === 0
      ? `<tbody><tr class="mx-empty"><td colspan="${devices.length + 1}">These devices match on every listed spec.</td></tr></tbody>`
      : '';

    table.innerHTML = `
      <caption class="sr-only">Feature matrix comparing ${devices.map(d => d.name).join(', ')} (demo data)</caption>
      <colgroup><col class="mx-first">${devices.map(() => '<col>').join('')}</colgroup>
      <thead><tr><th scope="col" class="mx-corner">Features</th>${head}</tr></thead>
      ${bodies}${empty}`;

    renderControls();
  }

  function renderControls() {
    const atMin = state.selected.length <= MIN;
    const atMax = state.selected.length >= MAX;

    tray.innerHTML = state.selected.map(id => {
      const d = byId(id);
      return `<span class="device-pill">${d.name}
        <button type="button" data-remove="${id}" aria-label="Remove ${d.name}" ${atMin ? 'disabled aria-describedby="mx-msg"' : ''}>
          <i class="ph ph-x" aria-hidden="true"></i>
        </button></span>`;
    }).join('');

    const available = DEVICES.filter(d => !state.selected.includes(d.id));
    addSelect.innerHTML = available.length
      ? available.map(d => `<option value="${d.id}">${d.name}</option>`).join('')
      : '<option value="">All devices added</option>';
    addSelect.disabled = atMax || !available.length;
    addBtn.disabled = atMax || !available.length;

    if (atMax) {
      msg.innerHTML = '<i class="ph ph-info" aria-hidden="true"></i> You can compare up to 4 devices. Remove one to add another.';
    } else if (atMin) {
      msg.innerHTML = '<i class="ph ph-info" aria-hidden="true"></i> At least 2 devices are needed for a comparison. Add one before removing another.';
    } else {
      msg.textContent = '';
    }
  }

  tray.addEventListener('click', e => {
    const btn = e.target.closest('[data-remove]');
    if (!btn || state.selected.length <= MIN) return;
    state.selected = state.selected.filter(id => id !== btn.dataset.remove);
    render();
    addSelect.focus();
  });

  addBtn.addEventListener('click', () => {
    const id = addSelect.value;
    if (!id || state.selected.length >= MAX) return;
    state.selected.push(id);
    render();
  });

  diffToggle.addEventListener('change', () => {
    state.diffOnly = diffToggle.checked;
    render();
  });

  table.addEventListener('click', e => {
    const btn = e.target.closest('[data-group]');
    if (!btn) return;
    const id = btn.dataset.group;
    if (state.collapsed.has(id)) state.collapsed.delete(id);
    else state.collapsed.add(id);
    render();
    const again = table.querySelector(`[data-group="${id}"]`);
    if (again) again.focus();
  });

  render();
});
