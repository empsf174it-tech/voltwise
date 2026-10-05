document.addEventListener('DOMContentLoaded', () => {
  // Header: stronger glass once the page scrolls
  const header = document.querySelector('header');
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile Navigation
  const hamburger = document.querySelector('.hamburger');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const overlay = document.querySelector('.mobile-nav-overlay');
  const closeBtn = document.querySelector('.close-drawer');

  function toggleNav() {
    drawer.classList.toggle('open');
    overlay.classList.toggle('open');
    document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
  }

  // Highlight the current page in the drawer (review detail belongs to Reviews)
  let page = location.pathname.split('/').pop() || 'index.html';
  if (page === 'review-detail.html') page = 'reviews.html';
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    if (link.getAttribute('href') === page) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  if (hamburger && drawer && overlay && closeBtn) {
    hamburger.addEventListener('click', toggleNav);
    closeBtn.addEventListener('click', toggleNav);
    overlay.addEventListener('click', toggleNav);
  }

  // Mobile Accordion (Dropdowns)
  document.querySelectorAll('.mobile-dropdown-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const menu = trigger.nextElementSibling;
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', !isExpanded);
      menu.classList.toggle('open');

      const icon = trigger.querySelector('i');
      if (icon) {
        icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
        icon.style.transition = 'transform 0.3s';
      }
    });
  });

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal, .animate-fade-up');
  const finish = el => setTimeout(() => {
    // Drop stagger delays so later hover transitions feel instant
    [...el.classList].filter(c => c.startsWith('delay-')).forEach(c => el.classList.remove(c));
  }, 1200);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          finish(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // Cursor spotlight on cards
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  // Count-up stats
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const countObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const decimals = (el.dataset.count.split('.')[1] || '').length;
        const suffix = el.dataset.suffix || '';
        const start = performance.now();
        const dur = 1600;
        const tick = now => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          el.textContent = (target * eased).toFixed(decimals) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => countObs.observe(el));
  }

  // Affiliate click tracking
  // GA_TAG: the analytics snippet in each page's <head> (<!-- GA_TAG -->) consumes window.dataLayer.
  // Delegated so dynamically rendered buttons (feature matrix, matchmaker) are tracked too.
  window.dataLayer = window.dataLayer || [];
  document.addEventListener('click', e => {
    const link = e.target.closest('a[data-affiliate="true"]');
    if (!link) return;
    let campaign = '';
    let content = '';
    try {
      const params = new URL(link.href).searchParams;
      campaign = params.get('utm_campaign') || '';
      content = params.get('utm_content') || '';
    } catch (err) {
      // Malformed placeholder URL: still record the click from data attributes
    }
    window.dataLayer.push({
      event: 'affiliate_click',
      product_id: link.dataset.productId || content,
      merchant: link.dataset.merchant || '',
      placement: link.dataset.placement || '',
      page: campaign || window.location.pathname,
      link_url: link.href
    });
  });

  // Form Validation
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

      inputs.forEach(input => {
        const errorMsg = input.nextElementSibling;
        const hasError = errorMsg && errorMsg.classList.contains('error-message');
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('error');
          input.classList.remove('success');
          if (hasError) {
            errorMsg.style.display = 'block';
            errorMsg.textContent = input.tagName === 'SELECT' ? 'Please select an option' : 'This field is required';
          }
        } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
          isValid = false;
          input.classList.add('error');
          input.classList.remove('success');
          if (hasError) {
            errorMsg.style.display = 'block';
            errorMsg.textContent = 'Please enter a valid email';
          }
        } else {
          input.classList.remove('error');
          input.classList.add('success');
          if (hasError) errorMsg.style.display = 'none';
        }
      });

      if (isValid) {
        // Mock successful submit
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="ph ph-check"></i> Sent Successfully';
        btn.style.background = 'var(--color-success)';
        form.reset();
        inputs.forEach(input => input.classList.remove('success'));

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
        }, 3000);
      }
    });
  });
});
