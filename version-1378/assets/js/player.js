function initMoviePlayer(source) {
    var video = document.querySelector('.movie-video');
    var playLayer = document.querySelector('.play-layer');
    var hls = null;
    var attached = false;
    var requested = false;

    if (!video || !source) {
        return;
    }

    function tryPlay() {
        var result = video.play();
        if (result && typeof result.catch === 'function') {
            result.catch(function () {
                video.addEventListener('canplay', function () {
                    video.play();
                }, { once: true });
            });
        }
    }

    function attachSource() {
        if (attached) {
            return;
        }
        attached = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hls = new Hls({ enableWorker: true });
            hls.loadSource(source);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                if (requested) {
                    tryPlay();
                }
            });
            return;
        }

        video.src = source;
    }

    function startPlayback() {
        requested = true;
        attachSource();
        if (playLayer) {
            playLayer.classList.add('is-hidden');
        }
        tryPlay();
    }

    if (playLayer) {
        playLayer.addEventListener('click', startPlayback);
    }

    video.addEventListener('click', function () {
        if (video.paused) {
            startPlayback();
        }
    });

    video.addEventListener('play', function () {
        if (playLayer) {
            playLayer.classList.add('is-hidden');
        }
    });

    attachSource();
}
