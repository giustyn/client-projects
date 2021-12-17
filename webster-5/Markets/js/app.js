(function () {

    let url = new ExtendedURL(window.location.href),
        dataURI = [
            // dev = "..\\..\\_data\\markets\\markets.xml", // dev.local
            local = "c:\\data\\markets\\markets.xml",
            server = "https://retail.adrenalineamp.com/rss/markets/markets.xml"
        ],
        $bumper = $("#bumper"),
        $bumper_enabled = 1;

    function getDate() {
        $(".date").text(moment().format('dddd MMMM D, YYYY'));
    }

    function getTime() {
        var i = setInterval(function () {
            updateTime();
        }, 1000);

        function updateTime() {
            $(".time").text(moment().format('h:mm:ss A'));
        }
    }

    function getMarkets(data) {
        var dfd = $.Deferred();
        return $.when(xmlRequest(data)
            .done(function (response) {
                var xml = $(response);
                var row = $(".flex-grid");
                var container = $("#marketData");
                row.remove();
                xml.find("Quote").each(function (index, quote) {
                    var clone = row.clone();
                    var $quote = $(quote);
                    var change = $quote.find("change").text();
                    var ispos = change.includes("+");
                    var isneg = change.includes("-");
                    var $changeImg = clone.find("#change_icon");
                    if (ispos) {
                        $changeImg.addClass("arrow-up");
                    } else if (isneg) {
                        $changeImg.addClass("arrow-down");
                    }
                    setTimeout(function () {
                        clone.find("#company_name").text($quote.find("company_name").text().replace("Composite", "").trim());
                        clone.find("#last").text($quote.find("last").text());
                        clone.find("#change").text($quote.find("change").text());
                        clone.find("#change_percent").text($quote.find("change_percent").text());
                        container.append(clone);
                    }, index);
                });
                console.log(response);
            })
        );
    }

    function marketVideoUpdate(response) {
        function handler(event) {
            const eventItem = event.target;
            const current = Math.round(eventItem.currentTime * 1000);
            const total = Math.round(eventItem.duration * 1000);
            if ((total - current) < 500) {
                eventItem.removeEventListener("timeupdate", handler);
                // Show market data
                $("#markets").addClass('visible');
                $(".flex-grid").each(function (index) {
                    console.log(this)
                    $(this).delay(300 * index).queue(function () {
                        $(this).removeClass('paused').dequeue();
                    });
                });
                // Remove intro video
                $bumper.fadeOut(500, function () {
                    $bumper.parent().remove();
                });
            }
        }
        return handler;
    }

    function videoEventListeners(response) {
        if ($bumper_enabled != 1) return
        var handler = marketVideoUpdate(response);
        $bumper[0].addEventListener("timeupdate", handler);
        $bumper.attr("src", "./video/Financial_Intro_Final.mp4");
    }

    function loadMarkets() {
        getMarkets(dataURI[0])
            .done(function (data) {
                videoEventListeners(data);
                console.log("market data found");
            })
            .catch(function () {
                getMarkets(dataURI[1])
                    .done(function (data) {
                        videoEventListeners(data);
                        console.log("server market data found");
                    })
            })
    }

    function init() {
        loadMarkets();
        getDate();
        getTime();
    }

    $(".flex-grid:nth-child(1n)").addClass("paused");
    init();

})();