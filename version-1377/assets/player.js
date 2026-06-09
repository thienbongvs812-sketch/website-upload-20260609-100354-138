(function () {
    function prepare(video, src) {
        if (!video || video.getAttribute("data-ready") === "1") {
            return;
        }
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
        } else if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls();
            hls.loadSource(src);
            hls.attachMedia(video);
            video._hls = hls;
        } else {
            video.src = src;
        }
        video.setAttribute("data-ready", "1");
    }

    window.MoviePlayer = function (video, button, src) {
        if (!video || !button || !src) {
            return;
        }
        function play() {
            button.classList.add("is-hidden");
            prepare(video, src);
            var action = video.play();
            if (action && typeof action.catch === "function") {
                action.catch(function () {});
            }
        }
        button.addEventListener("click", play);
        video.addEventListener("click", function () {
            if (video.paused) {
                play();
            }
        });
    };
})();
