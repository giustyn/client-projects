/**
 *  API Components
 */

const isOverflown = ({
    clientHeight,
    scrollHeight
}) => scrollHeight > clientHeight
const resizeText = ({
    element,
    elements,
    minSize = 1,
    maxSize = 2.25,
    step = .1,
    unit = 'em'
}) => {
    (elements || [element]).forEach(el => {
        let i = minSize
        let overflow = false

        const parent = el.parentNode

        while (!overflow && i < maxSize) {
            el.style.fontSize = `${i}${unit}`
            overflow = isOverflown(parent)

            if (!overflow) i += step
        }
        // revert to last state where no overflow happened
        el.style.fontSize = `${i - step}${unit}`
    })
}

function ExtendedURL(href) {
    this.url = new URL(href);
    this.getSearchParam = function (param) {
        return this.url.searchParams.get(param)
    };
    return this;
}

function get(filePath) {
    var url = new URL(window.location.href);
    return $.when(
        request(filePath, "JSON")
    )
}

function request(filePath, dataType) {
    var dfd = $.Deferred();
    $.ajax({
        url: filePath,
        type: "GET",
        dataType: dataType,
        error: function () {
            return dfd.resolve({
                status: 400
            });
        },
        success: function (response) {
            return dfd.resolve(response);
        }
    });
    return dfd.promise();
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/* function videoEventHandler(data) {
    function handler(event) {
        const eventItem = event.target;
        const current = Math.round(eventItem.currentTime * 1000);
        const total = Math.round(eventItem.duration * 1000);
        if ((total - current) < 500) {
            eventItem.removeEventListener("timeupdate", handler);
            // Do things
            $bumper.parent().fadeOut(500, function () {
                $bumper.remove();
            });
        }
    }
    return handler;
}

function videoEventListener(data) {
    var handler = videoEventHandler(data);
    $bumper[0].addEventListener("timeupdate", handler);
} */