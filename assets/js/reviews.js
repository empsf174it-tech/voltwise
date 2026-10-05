document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('ur-list');
  if (!list) return;

  const sortSelect = document.getElementById('ur-sort');
  const verifiedToggle = document.getElementById('ur-verified');
  const showing = document.getElementById('ur-showing');
  const empty = document.getElementById('ur-empty');
  const reviews = [...list.querySelectorAll('.user-review')];
  const TOTAL = '1,284';

  // Rating distribution bars
  requestAnimationFrame(() => {
    document.querySelectorAll('.dist-fill[data-pct]').forEach(bar => {
      bar.style.width = bar.dataset.pct + '%';
    });
  });

  const comparators = {
    newest: (a, b) => b.dataset.date.localeCompare(a.dataset.date),
    highest: (a, b) => (b.dataset.rating - a.dataset.rating) || b.dataset.date.localeCompare(a.dataset.date),
    lowest: (a, b) => (a.dataset.rating - b.dataset.rating) || b.dataset.date.localeCompare(a.dataset.date)
  };

  function apply() {
    const verifiedOnly = verifiedToggle.checked;
    const sorted = [...reviews].sort(comparators[sortSelect.value] || comparators.newest);
    let visible = 0;

    sorted.forEach(review => {
      const show = !verifiedOnly || review.dataset.verified === 'true';
      review.hidden = !show;
      if (show) visible++;
      list.appendChild(review);
    });

    empty.classList.toggle('show', visible === 0);
    list.hidden = visible === 0;
    showing.textContent = `Showing ${visible} of ${TOTAL} reviews${verifiedOnly ? ' (verified only)' : ''}`;
  }

  sortSelect.addEventListener('change', apply);
  verifiedToggle.addEventListener('change', apply);

  document.querySelectorAll('[data-ur-reset]').forEach(btn => {
    btn.addEventListener('click', () => {
      sortSelect.value = 'newest';
      verifiedToggle.checked = false;
      apply();
    });
  });

  apply();
});
