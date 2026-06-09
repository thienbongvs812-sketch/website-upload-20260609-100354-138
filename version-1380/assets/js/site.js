(function () {
  var mobileButton = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (mobileButton && mobileNav) {
    mobileButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var currentSlide = 0;
  var heroTimer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, itemIndex) {
      slide.classList.toggle('active', itemIndex === currentSlide);
    });

    dots.forEach(function (dot, itemIndex) {
      dot.classList.toggle('active', itemIndex === currentSlide);
    });
  }

  function startHero() {
    if (heroTimer) {
      window.clearInterval(heroTimer);
    }

    if (slides.length > 1) {
      heroTimer = window.setInterval(function () {
        showSlide(currentSlide + 1);
      }, 5200);
    }
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
      startHero();
    });
  });

  var prev = document.querySelector('.hero-prev');
  var next = document.querySelector('.hero-next');

  if (prev) {
    prev.addEventListener('click', function () {
      showSlide(currentSlide - 1);
      startHero();
    });
  }

  if (next) {
    next.addEventListener('click', function () {
      showSlide(currentSlide + 1);
      startHero();
    });
  }

  showSlide(0);
  startHero();

  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function getCards(root) {
    return Array.prototype.slice.call(root.querySelectorAll('.movie-card, .ranking-item, .compact-card'));
  }

  function applySearch(root) {
    var search = root.querySelector('.movie-search');
    var sort = root.querySelector('.sort-select');
    var cards = getCards(root);
    var query = normalize(search ? search.value : '');

    cards.forEach(function (card) {
      var corpus = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-tags'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-region'),
        card.getAttribute('data-year')
      ].join(' '));
      card.classList.toggle('hidden-by-filter', query && corpus.indexOf(query) === -1);
    });

    if (sort && sort.value !== 'default' && cards.length) {
      var container = cards[0].parentElement;
      var visibleCards = cards.slice().sort(function (a, b) {
        if (sort.value === 'rating') {
          return Number(b.getAttribute('data-rating')) - Number(a.getAttribute('data-rating'));
        }

        if (sort.value === 'views') {
          return Number(b.getAttribute('data-views')) - Number(a.getAttribute('data-views'));
        }

        if (sort.value === 'year') {
          return Number(b.getAttribute('data-year')) - Number(a.getAttribute('data-year'));
        }

        if (sort.value === 'title') {
          return (a.getAttribute('data-title') || '').localeCompare(b.getAttribute('data-title') || '', 'zh-Hans-CN');
        }

        return 0;
      });

      visibleCards.forEach(function (card) {
        container.appendChild(card);
      });
    }
  }

  Array.prototype.slice.call(document.querySelectorAll('.search-panel')).forEach(function (panel) {
    var root = panel.closest('.section') || document;
    var search = panel.querySelector('.movie-search');
    var sort = panel.querySelector('.sort-select');

    if (search) {
      search.addEventListener('input', function () {
        applySearch(root);
      });
    }

    if (sort) {
      sort.addEventListener('change', function () {
        applySearch(root);
      });
    }
  });

  function prepareVideo(video) {
    if (!video || video.getAttribute('data-ready') === '1') {
      return;
    }

    var url = video.getAttribute('data-video');

    if (!url) {
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({ enableWorker: true });
      hls.loadSource(url);
      hls.attachMedia(video);
      video.hlsPlayer = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
    }

    video.setAttribute('data-ready', '1');
  }

  Array.prototype.slice.call(document.querySelectorAll('.player-box')).forEach(function (box) {
    var video = box.querySelector('video');
    var button = box.querySelector('.play-toggle');

    function playVideo() {
      prepareVideo(video);
      if (video) {
        var request = video.play();
        if (request && request.catch) {
          request.catch(function () {});
        }
        box.classList.add('is-playing');
      }
    }

    if (button) {
      button.addEventListener('click', playVideo);
    }

    if (video) {
      video.addEventListener('play', function () {
        box.classList.add('is-playing');
      });
      video.addEventListener('pause', function () {
        box.classList.remove('is-playing');
      });
      video.addEventListener('click', function () {
        if (video.paused) {
          playVideo();
        }
      });
    }
  });
})();
