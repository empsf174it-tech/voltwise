document.addEventListener('DOMContentLoaded', () => {
  const filtersBar = document.querySelector('.filters-bar');
  if (!filtersBar) return;

  const categoryFilter = document.getElementById('filter-category');
  const priceFilter = document.getElementById('filter-price');
  const brandFilter = document.getElementById('filter-brand');
  const resetBtn = document.getElementById('filter-reset');
  const reviewCards = document.querySelectorAll('.review-item');
  const noResults = document.querySelector('.no-results');

  function applyFilters() {
    let visibleCount = 0;
    const catVal = categoryFilter.value.toLowerCase();
    const priceVal = priceFilter.value;
    const brandVal = brandFilter.value.toLowerCase();

    reviewCards.forEach(card => {
      const cardCat = card.dataset.category ? card.dataset.category.toLowerCase() : '';
      const cardPrice = parseFloat(card.dataset.price) || 0;
      const cardBrand = card.dataset.brand ? card.dataset.brand.toLowerCase() : '';

      let matchCat = catVal === 'all' || cardCat === catVal;
      let matchBrand = brandVal === 'all' || cardBrand === brandVal;
      let matchPrice = true;

      if (priceVal !== 'all') {
        if (priceVal === 'low' && cardPrice > 500) matchPrice = false;
        if (priceVal === 'mid' && (cardPrice < 500 || cardPrice > 1000)) matchPrice = false;
        if (priceVal === 'high' && cardPrice < 1000) matchPrice = false;
      }

      if (matchCat && matchBrand && matchPrice) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (visibleCount === 0) {
      if (noResults) noResults.style.display = 'block';
    } else {
      if (noResults) noResults.style.display = 'none';
    }
  }

  [categoryFilter, priceFilter, brandFilter].forEach(select => {
    if(select) select.addEventListener('change', applyFilters);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if(categoryFilter) categoryFilter.value = 'all';
      if(priceFilter) priceFilter.value = 'all';
      if(brandFilter) brandFilter.value = 'all';
      applyFilters();
    });
  }
});
