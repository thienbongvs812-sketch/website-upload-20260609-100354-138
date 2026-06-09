(function () {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const mobilePanel = document.querySelector('[data-mobile-panel]');
  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const prev = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    let index = 0;
    let timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }

    restart();
  }

  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function filterCards(scope) {
    const input = scope.querySelector('[data-card-filter]');
    const typeSelect = scope.querySelector('[data-type-filter]');
    const yearSelect = scope.querySelector('[data-year-filter]');
    const cards = Array.from(scope.querySelectorAll('.movie-card'));
    const keyword = normalize(input ? input.value : '');
    const typeValue = normalize(typeSelect ? typeSelect.value : '');
    const yearValue = normalize(yearSelect ? yearSelect.value : '');

    cards.forEach(function (card) {
      const text = normalize(card.getAttribute('data-text'));
      const type = normalize(card.getAttribute('data-type'));
      const year = normalize(card.getAttribute('data-year'));
      const keywordMatch = !keyword || text.indexOf(keyword) !== -1;
      const typeMatch = !typeValue || type === typeValue;
      const yearMatch = !yearValue || year === yearValue;
      card.hidden = !(keywordMatch && typeMatch && yearMatch);
    });
  }

  document.querySelectorAll('[data-filterable]').forEach(function (grid) {
    const scope = grid.closest('.content-section') || document;
    const fields = scope.querySelectorAll('[data-card-filter], [data-type-filter], [data-year-filter]');
    fields.forEach(function (field) {
      field.addEventListener('input', function () {
        filterCards(scope);
      });
      field.addEventListener('change', function () {
        filterCards(scope);
      });
    });
    filterCards(scope);
  });

  const params = new URLSearchParams(window.location.search);
  const query = params.get('q');
  if (query) {
    document.querySelectorAll('[data-card-filter]').forEach(function (input) {
      input.value = query;
      const scope = input.closest('.content-section') || document;
      filterCards(scope);
    });
  }
}());
