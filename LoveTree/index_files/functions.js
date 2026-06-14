var $win = $(window);
var clientWidth = $win.width();
var clientHeight = $win.height();

$(window).resize(function () {
    var newWidth = $win.width();
    var newHeight = $win.height();

    if (newWidth !== clientWidth && newHeight !== clientHeight) {
        location.replace(location);
    }
});

(function ($) {
    $.fn.typewriter = function () {
        this.each(function () {
            var $element = $(this);
            var content = $element.html();
            var progress = 0;

            $element.html("");

            var timer = setInterval(function () {
                if (content.substr(progress, 1) === "<") {
                    progress = content.indexOf(">", progress) + 1;
                } else {
                    progress++;
                }

                $element.html(
                    content.substring(0, progress) + (progress & 1 ? "_" : "")
                );

                if (progress >= content.length) {
                    clearInterval(timer);
                }
            }, 75);
        });

        return this;
    };
})(jQuery);

function timeElapse(date) {
    var seconds = (Date.now() - date.getTime()) / 1000;
    var days = Math.floor(seconds / 86400);
    seconds %= 86400;

    var hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
    seconds %= 3600;

    var minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    seconds = String(Math.floor(seconds % 60)).padStart(2, "0");

    var result =
        '<span class="digit">' + days + "</span> days " +
        '<span class="digit">' + hours + "</span> hours " +
        '<span class="digit">' + minutes + "</span> minutes " +
        '<span class="digit">' + seconds + "</span> seconds";

    $("#clock").html(result);
}
