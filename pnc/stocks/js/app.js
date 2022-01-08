(function () {

    const $bumper = $('#bumper').attr("src", "./video/PNC_Syn_Stocks.mp4"),
        $speed = 1000,
        $timer = 7000,
        $delay = 200,
        $stagger = 30;
        /* ,
        dataURI = {
            local: "c:\\data\\fin\\pnc-markets.json",
            server: "https://retail.adrenalineamp.com/navori/markets/pnc-markets.json",
            server2: "https://kitchen.screenfeed.com/financial/qa47q5pxd4ymm2xzgz7ke1fs0.json"
        }; */

        let dataURI = [
            local = "c:\\data\\weather\\pnc-markets.json",
            server = "https://retail.adrenalineamp.com/navori/markets/pnc-markets.json"
        ];

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

    function getData(filePath) {
        var url = new URL(window.location.href);
        return $.when(
            request(filePath, "JSON")
        )
    }

    function revealer(direction) {
        let animation = $("#transition");
        let duration = parseInt($(':root').css('--revealer-speed'));
        let effect = "revealer--animate" + " " + direction;
        animation.addClass(effect).delay(duration).queue(function () {
            $(this).removeClass(effect).dequeue();
        });
    }

    function animateHeader() {
        let date = $('.date').text(moment().format('dddd, MMMM Do'));
        anime.timeline({
                targets: '.header',
                easing: 'easeInOutExpo',
                opacity: [0, 1],
                translateY: ['-50%', '0%'],
            })
            .add({
                targets: '.header *',
                opacity: [0, 1],
                translateY: ['-50%', '0%'],
                delay: anime.stagger($stagger)
            });
    }

    function animateIntro() {
        let $date = $('#intro .date').text(moment().format('dddd, MMMM Do'));
        let animation = anime.timeline({
                targets: '#intro .date',
                easing: 'easeInOutExpo',
            })
            .add({
                scale: [0, 1],
                opacity: [0, 1],
                translateX: ['-100%', '0%'],
                duration: ($speed * 4),
                endDelay: 1000
            })
            .add({
                opacity: [1, 0],
                scale: [1, 0],
                translateX: ['0%', '-100%'],
                update: function (anim) {
                    $date.css('filter', 'blur(' + 20 * anim.progress / 100 + 'px)');
                },
                changeComplete: function () {
                    animateHeader();
                }
            });
    }

    function animateSlideIn() {
        anime.timeline({
                loop: false,
                easing: 'easeInOutExpo',
                delay: $delay,
                duration: $speed,
            })
            .add({
                targets: '.content *',
                opacity: [0, 1],
                translateY: ['-20%', '0%'],
                delay: anime.stagger($stagger, {
                    direction: 'normal'
                })
            })

    }

    function animateSlideOut(clone) {
        anime.timeline({
                targets: '.content *',
                loop: false,
                easing: 'easeInOutExpo',
                duration: $speed,
                changeComplete: function () {
                    clone.remove();
                }
            })
            .add({
                opacity: [1, 0],
                translateY: ['0%', '-20%'],
                delay: anime.stagger($stagger, {
                    direction: 'reverse'
                })
            })
    }

    function buildAnimatedSlide(todo, index, template, container) {
        let clone = template.clone();
        // let node = clone.get();
        let num = numeral.defaultFormat('0.00');
        for (let i = 0; i < $('.card', clone).length; i++) {
            var card = $('.card:nth-child(' + (i + 1) + ')', clone);
            var stockIndex = (index + i) % todo.stocks.length;
            var stock = todo.stocks[stockIndex];
            console.log(stockIndex, stock);
            card.find(".company_name").text(stock.company_name);
            card.find(".stock_name").text(stock.ticker);
            card.find(".value").text(numeral(stock.change).format());
            card.find(".percent").text(numeral(stock.change_percent).format());
            if (isNaN(stock.change) || stock.change <= 0) {
                card.find(".icon").addClass("change-down");
            } else {
                card.find(".icon").addClass("change-up");
                card.find(".value").addClass("positive");
                card.find(".percent").addClass("positive");
            }
        }
        template.remove();
        container.append(clone);

        animateSlideIn();
        setTimeout(function () {
            animateSlideOut(clone);
        }, $timer - ($speed + $delay));
    }

    function iterateStocks(data) {
        let template = $("#template");
        let container = $("#main");
        let index = 0;

        buildAnimatedSlide(data, index, template, container);
        index += 2
        let intervalId = setInterval(function () {
            buildAnimatedSlide(data, index, template, container);
            index += 2
        }, $timer);
    }

    function videoEventHandler(data) {
        function handler(event) {
            let eventItem = event.target;
            let current = Math.round(eventItem.currentTime * 1000);
            let total = Math.round(eventItem.duration * 1000);
            // console.log(current, total)
            if ((total - current) < 500) {
                eventItem.removeEventListener("timeupdate", handler);
                iterateStocks(data);
                $bumper.fadeOut(500, function () {
                    $bumper.parent().remove();
                });
            }
        }
        return handler;
    }

    function videoEventListener(data) {
        let handler = videoEventHandler(data);
        animateIntro();
        $bumper[0].addEventListener("timeupdate", handler);
    }

    function getStocks(url) {
        $.ajax(url)
            .done((data) => {
                videoEventListener(data);
                console.log("source:", url);
                console.log("items:", data.stocks.length);
            })
            .fail(function (data) {
                console.error('Failed to load data.');
                $('#template').hide();
            });
    }

    function init2() {

        function tryLocal() {
            $.ajax(dataURI.local)
                .done((data) => {
                    getStocks(dataURI.local);
                    console.log('Found local data.')
                })
                .catch(function (data) {
                    getStocks(dataURI.server);
                    console.log('Local data not found, fetching server data..')
                });
        }
        tryLocal();
    }

    function init() {
        getData(dataURI[0])
            .done(function (response) {
                if (response.status !== 400) {
                    videoEventListener(response);
                    console.log("data source: " + dataURI[0]);
                    console.log(response);
                } else {
                    return getData(dataURI[1])
                    .done(function (response) {
                        videoEventListener(response);
                        console.log("data source: " + dataURI[1]);
                        console.log(response);
                        });
                }
            });
    }

    init();

})();