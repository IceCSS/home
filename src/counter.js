/**
 *  For the counter in header
 */
function animateCount() {
    $('.count').each(function () {
        $(this).prop('counter', 0).animate({
            Counter: $(this).text()
        }, {
            duration: 1000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });
}
