$(function () {
    var url = new ExtendedURL(window.location.href),
        $animeDuration = 15000,
        $animeSpeed = 2000,
        $animeDelay = 100,
        $revealerSpeed = parseInt($(':root').css('--revealer-speed')),
        $revealerStyle = $('body').addClass('anim-effect-2'),
        videoEnabled = url.getSearchParam('bgvideo') || 1,
        screenConfig = url.getSearchParam('screens') || 1,
        zipcode = url.getSearchParam('zipcode') || '03801';

    let dataURI = {
        "local": "c:\\data\\weather\\weather.json",
        "server": "https://kitchen.screenfeed.com/weather/v2/data/40778ps5v9ke2m2nf22wpqk0sj.json?current=true&interval=Daily&forecasts=5&location=" + zipcode
    };

    function getOS() {
        var parser = new UAParser();
        var ua = navigator.userAgent;
        var result = parser.getResult();
        var os = result.os.name;
        if (os != "Windows" && os != "Mac OS") {
            videoEnabled = 0;
        }
        console.log(os);
    }

    function dayPartGreeting(target) {
        let hours = new Date().getHours();
        let phrase;
        if (hours >= 0 && hours < 12) {
            phrase = ('Good morning');
        } else if (hours >= 12 && hours < 17) {
            phrase = ('Good afternoon');
        } else if (hours >= 17 && hours < 24) {
            phrase = ('Good evening');
        }
        $(target).text(phrase);
    }

    function revealer() {
        const $transition = $('.revealer'),
            mode = [
                'revealer--left',
                'revealer--right',
                'revealer--top',
                'revealer--bottom'
            ],
            shuffle = mode[(Math.random() * mode.length) | 0];
        $transition.addClass('revealer--animate').addClass(mode[2]).delay($revealerSpeed * 1.5).queue(function () {
            $(this).removeClass('revealer--animate').removeClass(mode[2]).dequeue();
        });
    }

    function handleWeather(data) {
        let location = data.Locations[0] || {};
        let current = location.WeatherItems[0] || {};
        let forecast = location.WeatherItems.slice(1, 6) || {};

        function cloneDayOfWeek(el, num) {
            var elem = document.querySelector(el);
            for (var i = 1; i <= num; i++) {
                var clone = elem.cloneNode(true);
                clone.id = 'day' + (num - i + 1);
                elem.after(clone);
            }
            elem.remove();
        }

        function setForecast() {
            cloneDayOfWeek('#template', 5);
            $(".forecast .day").each(function (i, el) {
                var $el = $(el);
                $el.find(".icon").attr("src", "./img/icons/" + getIcon(forecast[i].ConditionCode));
                $el.find(".dayofweek").text(moment(forecast[i].DateTime).format('ddd'));
                $el.find(".description").text(forecast[i].ShortDescription);
                $el.find(".htemp").text(forecast[i].HighTempF);
                $el.find(".ltemp").text(forecast[i].LowTempF);
                $el.find(".ltemp").text(forecast[i].LowTempF);
                $el.find("video").attr("poster", "./img/" + loadMedia(forecast[i].ConditionCode) + ".jpg");
                if (videoEnabled !== 0) {
                    $el.find("video").attr("src", "./video/" + loadMedia(forecast[i].ConditionCode) + ".mp4");
                }
            });
        }

        function setCurrent() {
            $('.day:first-child .dayofweek').replaceWith('<div class="dayofweek">TODAY</div>');
            $('.location').text(location.City);
            $('.temperature').text(current.CurrentTempF);
            $('.description').text(current.Description);
            $('.wind').text("Wind: " + Number(current.WindSpeedMph) + "mph");
            $('.humidity').text("Humidity: " + Number(current.Humidity) + "%");
            $(".header .icon").attr("src", "./img/icons/" + getIcon(forecast[0].ConditionCode));
        }

        function mainBgVideo() {
            $('.background video').attr("poster", "./img/" + loadMedia(forecast[0].ConditionCode) + ".jpg");
            if (videoEnabled !== 0) {
                $('.background video').attr("src", "./video/" + loadMedia(forecast[0].ConditionCode) + ".mp4");
            }
        }

        mainBgVideo();
        setForecast();
        setCurrent();
    }

    function animateWeather() {
        // revealer();
        anime.timeline({
                autoplay: true,
                loop: false,
                easing: 'easeInOutQuint',
                duration: $animeSpeed,
            })
            /* main content animation-in */
            .add({
                targets: '.container',
                duration: 0,
                opacity: [0, 1],
            })
            .add({
                targets: '.header, .header *',
                delay: anime.stagger($animeDelay, {
                    direction: 'normal',
                    start: $animeDelay
                }),
                translateY: [-50,0],
                opacity: [0, 1],
            })
            .add({
                targets: '.day *',
                // duration: 0,
                delay: anime.stagger($animeDelay),
                translateY: [-20, 0],
                opacity: [0, 1]
            }, '-=1000')
    }

    function onTemplateError(result) {
        console.warn("could not get data")
    }

    function onTemplateSuccess(result) {
        handleWeather(result);
        animateWeather();
    }

    function getJsonData(onSuccess, onError, data) {
        return $.ajax({
            method: "GET",
            url: data,
            dataType: "json",
            success: function (result) {
                // console.log(result)
                onSuccess(result)
            },
            error: function (result) {
                // console.error(result);
                onError(result)
            }
        });
    }

    function init() {
        getOS(); // determine if 
        getJsonData(onTemplateSuccess, onTemplateError, dataURI.local); // get local data, located at c:\data
        getJsonData(onTemplateSuccess, onTemplateError, dataURI.server); // get server data, via screenfeed.com
    }

    init();
});