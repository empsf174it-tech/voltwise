document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('matchmaker');
  if (!root) return;

  const img = (id, w = 400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

  // Demo data — scores out of 10 for [primary metric, battery, design, value]
  const CATEGORIES = {
    phones: {
      labels: ['Performance', 'Battery', 'Design', 'Value'],
      min: 300, max: 1500, step: 50,
      devices: [
        { name: 'Titanium Pro Max', brand: 'Brand A', price: 1099, s: [9.5, 9.8, 8.0, 7.2], img: '1592750475338-74b7b21085ab', blurb: 'Two-day battery and flagship-class speed.' },
        { name: 'Galaxy Z Ultra', brand: 'Brand C', price: 1299, s: [9.4, 9.0, 9.0, 6.8], img: '1610945265064-0e34e5519bbf', blurb: 'The brightest, fastest screen we have tested.' },
        { name: 'Quantum Pixel 7', brand: 'Brand B', price: 599, s: [8.2, 7.6, 8.4, 9.3], img: '1511707171634-5f897ff02aa9', blurb: 'Flagship camera smarts at half the price.' },
        { name: 'Nova Lite 5', brand: 'Brand B', price: 349, s: [7.0, 8.6, 7.4, 9.5], img: '1695048133142-1a20484d2569', blurb: 'A budget hero with surprising stamina.' }
      ]
    },
    laptops: {
      labels: ['Performance', 'Battery', 'Design', 'Value'],
      min: 600, max: 2500, step: 50,
      devices: [
        { name: 'AuraBook Pro 14', brand: 'Brand B', price: 1499, s: [9.3, 9.0, 9.2, 7.8], img: '1525547719571-a2d4ac8945e2', blurb: 'The creator laptop that does it all quietly.' },
        { name: 'Vector Blade 16', brand: 'Brand C', price: 2199, s: [9.8, 6.5, 8.0, 7.0], img: '1496181133206-80ce9b88a853', blurb: 'Desktop-class power in a 16-inch chassis.' },
        { name: 'Slate Air 13', brand: 'Brand A', price: 899, s: [7.8, 9.4, 8.8, 9.0], img: '1517336714731-489689fd1ca8', blurb: 'Fanless, featherweight, all-day battery.' }
      ]
    },
    wearables: {
      labels: ['Tracking', 'Battery', 'Design', 'Value'],
      min: 100, max: 800, step: 25,
      devices: [
        { name: 'Active Watch 4', brand: 'Brand A', price: 399, s: [8.0, 7.2, 8.5, 8.1], img: '1546868871-7041f2a55e12', blurb: 'The best all-round smartwatch for most wrists.' },
        { name: 'Pulse Band 2', brand: 'Brand B', price: 149, s: [6.8, 9.6, 7.2, 9.4], img: '1523275335684-37898b6baf30', blurb: 'Two weeks of battery for the price of dinner.' },
        { name: 'Summit GPS Pro', brand: 'Brand C', price: 699, s: [9.4, 9.3, 8.0, 7.4], img: '1508685096489-7aacd43bd3b1', blurb: 'Dual-band GPS built for ultramarathons.' }
      ]
    },
    audio: {
      labels: ['Sound', 'Battery', 'Comfort', 'Value'],
      min: 50, max: 500, step: 10,
      devices: [
        { name: 'Sonic Wave ANC', brand: 'Brand C', price: 299, s: [9.0, 9.6, 8.2, 8.6], img: '1618366712010-f4ae9c647dcb', blurb: 'Class-leading noise cancelling and 60h battery.' },
        { name: 'Echo Buds Pro', brand: 'Brand A', price: 179, s: [8.4, 7.8, 8.6, 9.0], img: '1590658268037-6bf12165a8df', blurb: 'Pocketable earbuds with a rich, warm tuning.' },
        { name: 'Studio Ref X', brand: 'Brand B', price: 449, s: [9.6, 8.0, 9.0, 7.6], img: '1505740420928-5e560c06d30e', blurb: 'Reference-grade detail for critical listening.' }
      ]
    }
  };

  const state = { cat: 'phones', budget: 1500, priorities: new Set([0]) };
  let lastKey = '';

  const catBtns = root.querySelectorAll('[data-cat]');
  const range = root.querySelector('#mm-budget');
  const budgetOut = root.querySelector('#mm-budget-out');
  const scaleMin = root.querySelector('#mm-min');
  const scaleMax = root.querySelector('#mm-max');
  const chipsWrap = root.querySelector('#mm-chips');
  const result = root.querySelector('#mm-result');
  const notice = root.querySelector('#mm-notice');
  const fmt = n => '$' + n.toLocaleString('en-US');
  const slug = name => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const merchant = brand => 'merchant-' + brand.split(' ').pop().toLowerCase();

  function weightedScore(d) {
    let total = 0, weights = 0;
    d.s.forEach((v, i) => {
      const w = state.priorities.has(i) ? 2.5 : 1;
      total += v * w;
      weights += w;
    });
    return total / weights;
  }

  function renderChips() {
    const labels = CATEGORIES[state.cat].labels;
    chipsWrap.innerHTML = labels.map((l, i) =>
      `<button type="button" class="chip" data-p="${i}" aria-pressed="${state.priorities.has(i)}">${l}</button>`
    ).join('');
  }

  function syncRange() {
    const c = CATEGORIES[state.cat];
    range.min = c.min;
    range.max = c.max;
    range.step = c.step;
    range.value = state.budget;
    scaleMin.textContent = fmt(c.min);
    scaleMax.textContent = fmt(c.max) + '+';
    budgetOut.textContent = fmt(state.budget);
    const pct = ((state.budget - c.min) / (c.max - c.min)) * 100;
    range.style.setProperty('--fill', pct + '%');
  }

  function render() {
    const c = CATEGORIES[state.cat];
    const ranked = c.devices
      .map(d => ({ ...d, score: weightedScore(d), fits: d.price <= state.budget }))
      .sort((a, b) => (b.fits - a.fits) || (b.score - a.score));

    const anyFit = ranked.some(d => d.fits);
    let top = ranked[0];
    if (!anyFit) top = [...ranked].sort((a, b) => a.price - b.price)[0];
    notice.classList.toggle('show', !anyFit);
    if (!anyFit) notice.querySelector('span').textContent = `Nothing fits under ${fmt(state.budget)} — here's the closest option.`;

    const match = Math.round(top.score * 10);
    const runners = ranked.filter(d => d !== top);
    // Only replay the entrance animation when the recommendation actually changes
    const key = top.name + [...state.priorities].join();
    const changed = key !== lastKey;
    lastKey = key;

    result.innerHTML = `
      <div class="${changed ? 'mm-swap' : ''}">
        <div class="mm-top">
          <img src="${img(top.img)}" alt="${top.name}">
          <div>
            <div class="badge">Your top match</div>
            <h3>${top.name}</h3>
            <div class="mm-meta">${top.brand} · <span class="price">${fmt(top.price)}</span></div>
            <p style="margin:0;font-size:.925rem">${top.blurb}</p>
          </div>
          <div>
            <div class="score-ring" style="--val:${changed ? 0 : match}" data-target="${match}">${(top.score).toFixed(1)}</div>
            <span class="mm-match">${match}% match</span>
          </div>
        </div>
        <div class="mm-bars">
          ${c.labels.map((l, i) => `
            <div class="score-bar-wrapper ${state.priorities.has(i) ? 'priority' : ''}">
              <div class="score-label"><span>${l}</span><span>${top.s[i].toFixed(1)}</span></div>
              <div class="score-track"><div class="score-fill" style="width:${changed ? 0 : top.s[i] * 10}%" data-w="${top.s[i] * 10}"></div></div>
            </div>`).join('')}
        </div>
        <div class="card-actions">
          <a href="review-detail.html" class="btn btn-outline">Read review <i class="ph ph-arrow-right" aria-hidden="true"></i></a>
          <!-- AFFILIATE_LINK -->
          <a href="https://merchant.example/product?utm_source=voltwise&amp;utm_medium=affiliate&amp;utm_campaign=home&amp;utm_content=${slug(top.name)}"
             class="btn btn-primary" rel="sponsored noopener" target="_blank"
             data-affiliate="true" data-product-id="${slug(top.name)}" data-merchant="${merchant(top.brand)}" data-placement="card">
            Check price <i class="ph ph-arrow-up-right" aria-hidden="true"></i><span class="sr-only"> for ${top.name} (opens in a new tab)</span>
          </a>
        </div>
        <p class="affiliate-note"><i class="ph ph-info" aria-hidden="true"></i> Affiliate link. We may earn a commission at no cost to you.</p>
      </div>
      <div class="mm-runners">
        <div class="mm-runners-title">Also worth a look</div>
        ${runners.map(d => `
          <div class="mm-runner">
            <img src="${img(d.img, 120)}" alt="">
            <span class="name">${d.name}</span>
            ${d.fits ? '' : '<span class="over">over budget</span>'}
            <span class="pts">${fmt(d.price)}</span>
            <span class="pts">${d.score.toFixed(1)}</span>
          </div>`).join('')}
      </div>`;

    // Animate ring + bars after paint
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const ring = result.querySelector('.score-ring');
      ring.style.setProperty('--val', ring.dataset.target);
      result.querySelectorAll('.score-fill').forEach(f => { f.style.width = f.dataset.w + '%'; });
    }));
  }

  catBtns.forEach(btn => btn.addEventListener('click', () => {
    state.cat = btn.dataset.cat;
    state.budget = CATEGORIES[state.cat].max;
    catBtns.forEach(b => b.setAttribute('aria-pressed', b === btn));
    syncRange();
    renderChips();
    render();
  }));

  range.addEventListener('input', () => {
    state.budget = parseInt(range.value, 10);
    syncRange();
    render();
  });

  chipsWrap.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    const p = parseInt(chip.dataset.p, 10);
    if (state.priorities.has(p)) {
      if (state.priorities.size > 1) state.priorities.delete(p);
    } else {
      state.priorities.add(p);
    }
    renderChips();
    render();
  });

  syncRange();
  renderChips();
  render();
});
