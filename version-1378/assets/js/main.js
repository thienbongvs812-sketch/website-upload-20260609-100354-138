(function () {
    var toggle = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (toggle && mobileNav) {
        toggle.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    var slider = document.querySelector('.hero-slider');

    if (slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
        var activeIndex = 0;

        function setSlide(index) {
            activeIndex = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === activeIndex);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === activeIndex);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                setSlide(index);
            });
        });

        if (slides.length > 1) {
            setInterval(function () {
                setSlide(activeIndex + 1);
            }, 6200);
        }
    }

    function normalize(value) {
        return (value || '').toString().toLowerCase().trim();
    }

    function refreshCards(scope) {
        var root = scope || document;
        var cards = Array.prototype.slice.call(root.querySelectorAll('.movie-card'));
        var searchInput = root.querySelector('.movie-search');
        var categorySelect = root.querySelector('.category-select');
        var yearSelect = root.querySelector('.year-select');
        var empty = root.querySelector('.empty-result');
        var query = normalize(searchInput && searchInput.value);
        var selectedCategory = categorySelect ? categorySelect.value : 'all';
        var selectedYear = yearSelect ? yearSelect.value : 'all';
        var visible = 0;

        cards.forEach(function (card) {
            var haystack = normalize([
                card.dataset.title,
                card.dataset.category,
                card.dataset.region,
                card.dataset.year,
                card.dataset.tags,
                card.textContent
            ].join(' '));
            var categoryMatch = selectedCategory === 'all' || card.dataset.category === selectedCategory;
            var yearMatch = selectedYear === 'all' || card.dataset.year === selectedYear;
            var queryMatch = !query || haystack.indexOf(query) !== -1;
            var keep = categoryMatch && yearMatch && queryMatch;
            card.style.display = keep ? '' : 'none';
            if (keep) {
                visible += 1;
            }
        });

        if (empty) {
            empty.classList.toggle('is-visible', visible === 0);
        }
    }

    Array.prototype.slice.call(document.querySelectorAll('.search-scope')).forEach(function (scope) {
        Array.prototype.slice.call(scope.querySelectorAll('.movie-search, .category-select, .year-select')).forEach(function (control) {
            control.addEventListener('input', function () {
                refreshCards(scope);
            });
            control.addEventListener('change', function () {
                refreshCards(scope);
            });
        });
    });

    Array.prototype.slice.call(document.querySelectorAll('.filter-chip')).forEach(function (chip) {
        chip.addEventListener('click', function () {
            var scope = chip.closest('.search-scope') || document;
            var select = scope.querySelector('.category-select');
            if (select) {
                select.value = chip.dataset.category || 'all';
                Array.prototype.slice.call(scope.querySelectorAll('.filter-chip')).forEach(function (item) {
                    item.classList.remove('is-active');
                });
                chip.classList.add('is-active');
                refreshCards(scope);
            }
        });
    });

    Array.prototype.slice.call(document.querySelectorAll('.quick-search-form')).forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var input = form.querySelector('input');
            var query = encodeURIComponent(input && input.value ? input.value.trim() : '');
            window.location.href = query ? './library.html?q=' + query : './library.html';
        });
    });

    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q) {
        Array.prototype.slice.call(document.querySelectorAll('.movie-search')).forEach(function (input) {
            input.value = q;
            var scope = input.closest('.search-scope') || document;
            refreshCards(scope);
        });
    }
})();
