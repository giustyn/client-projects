$(document).ready(function () {

    function ExtendedURL(href) {
        this.url = new URL(href);
        this.getSearchParam = function (param) {
            return this.url.searchParams.get(param)
        };
        return this;
    }

    function dayPartGreeting(target) {
        let hours = new Date().getHours();
        let message;
        if (hours >= 0 && hours < 12) {
            message = ('Good morning');
        } else if (hours >= 12 && hours < 17) {
            message = ('Good afternoon');
        } else if (hours >= 17 && hours < 24) {
            message = ('Good evening');
        }
        $(target).text(message);
    }

    function revealer(direction) {
        let $revealer = $('.revealer');
        let speed = parseInt($(':root').css('--revealer-speed'));
        let enabled = parseInt($(':root').css('--revealer-enabled'));
        if (enabled != 0) {
            $revealer.addClass(direction).show();
            $revealer.addClass('revealer--animate').delay(speed * 2).queue(function (next) {
                $(this).removeClass(direction);
                $(this).removeClass('revealer--animate');
                $(this).hide();
                next();
            });
        } else {
            $revealer.remove();
        }
    }

    function setBackgroundVideo(target, source) {
        $(target).attr({
            src: source,
            type: "video/mp4"
        });
        $(target)[0].load();
    };

    function setBackgroundImage(target, source) {
        $(target).css(
            "background-image", source
        );
    };

    function handleWeather(data, weather_img) {
        var url = new ExtendedURL(window.location.href);
        let location = data.Locations[0] || {};
        let zipcode = location.LocationCode || url.getSearchParam("zipcode") || $(':root').css('--zipcode').trim() || {};
        let current = location.WeatherItems[0] || {};
        let forecast = location.WeatherItems.slice(1, 6) || {};
        let iconPath = "./img/icons/";
        let videoSrc = "./video/" + getVideo(current.ConditionCode) || {};
        let imgSrc = "url(" + weather_img + ')' || {};
        // let placeholder = $(':root').css('--placeholder');
        // let defaultPhoto = $(':root').css('--default-photo');

        console.log("Zipcode:", zipcode);
        console.log(location);

        function cloneDayElement(el, num) {
            var elem = document.querySelector(el);
            for (var i = 1; i <= num; i++) {
                var clone = elem.cloneNode(true);
                clone.id = 'day' + (num - i + 1);
                elem.after(clone);
            }
            elem.remove();
        }
        cloneDayElement('#template', 5);

        $(".forecast .day").each(function (i, el) {
            var $el = $(el);
            $el.find(".icon").attr("src", iconPath + getIcon(forecast[i].ConditionCode));
            $el.find(".dayofweek").text(moment(forecast[i].DateTime).format('dddd'));
            $el.find(".description").text(forecast[i].ShortDescription);
            $el.find(".htemp").text(forecast[i].HighTempF + "°");
            $el.find(".ltemp").text(forecast[i].LowTempF + "°");
        });

        $('.intro .card .icon').attr("src", iconPath + getIcon(current.ConditionCode));
        $('.header .description').text(current.Description);
        $('.location').text(location.City);
        $('.temperature').text(current.CurrentTempF + "°");
        $('.day:first-child .dayofweek').replaceWith('<div class="dayofweek">TODAY</div>');
        $('.date').text(moment().format('dddd, MMMM Do'));
        $('.time').text(moment().format('h:mm a'));
        dayPartGreeting('.greeting');

        setBackgroundVideo('video', videoSrc);
        setBackgroundImage('.photo', imgSrc);
    }

    function animateWeather() {
        let duration = parseInt($(':root').css('--content-duration'));
        let timer = parseInt($(':root').css('--anime-speed'));
        let offset = (timer / 2);

        anime.timeline({
                autoplay: true,
                loop: false,
                duration: timer,
                easing: 'easeOutSine',
                // easing: 'easeInOutElastic(.8, .8)',
            })
            /* intro animation-in */
            .add({
                targets: '.intro',
                zIndex: 1,
                delay: 0,
                opacity: [0, 1]
            })
            .add({
                targets: '.intro .card, .intro .card *',
                delay: anime.stagger(250, {
                    direction: 'normal',
                    start: offset
                }),
                translateX: ['-50%', '0%'],
                opacity: [0, 1],
            }, '-=' + (0) + '')

            .add({
                duration: (duration / 4),
            })
            /* intro animation-out */
            .add({
                targets: '.intro .card, .intro .card *',
                delay: anime.stagger(150, {
                    direction: 'reverse'
                }),
                translateX: ['0%', '-50%'],
                opacity: [1, 0]
            })
            .add({
                targets: '.intro',
                opacity: [1, 0],
                zIndex: 0,
                changeBegin: function (anim) {
                    revealer('revealer--right');
                }
            }, '+=' + (offset) + '')
            /* main content animation-in */
            .add({
                targets: '.container',
                opacity: [0, 1]
            }, '-=' + (offset) + '')
            .add({
                targets: '.header *, .forecast *, .footer *',
                delay: anime.stagger(10, {
                    direction: 'normal',
                    start: offset
                }),
                translateX: ['50%', '0%'],
                opacity: [0, 1],
                endDelay: duration
            }, '-=' + (timer) + '')
            /* main content animation-out */
            .add({
                targets: '.header *, .forecast *, .footer *',
                delay: anime.stagger(10, {
                    direction: 'reverse'
                }),
                translateX: ['0%', '50%'],
                opacity: [1, 0]
            }, '-=' + (timer) + '')
            .add({
                targets: '.container',
                opacity: 0,
                changeBegin: function (anim) {
                    revealer('revealer--left');
                }
            }, '-=' + (offset) + '');
    }

    function failHandler() {
        $('#transition').remove();
        $('.greeting').remove();
        $('.forecast').remove();
        $('video.background').remove();
        setBackgroundImage('.photo', $(':root').css('--placeholder'));
        console.log("Failed to get data.");
    }

    function getWeather() {
        // let dev_img = "https://retail.adrenalineamp.com/rss/weather/1920/27601.jpg";
        let dev_json = "https://kitchen.screenfeed.com/weather/v2/data/40778ps5v9ke2m2nf22wpqk0sj.json?current=true&interval=Daily&forecasts=5&location=27601";

        let baseDir = "../_feeds/data"; /* Development */
        // let baseDir = "c:/data"; /* Production */

        let weather_img = baseDir + "/weather/weather.jpg";
        let weather_json = baseDir + "/weather/weather.json";

        $.ajax({
            cache: true,
            url: dev_json, // weather_json
            dataType: "json",
            success: function (data) {
                handleWeather(data, weather_img);
                animateWeather();
            },
            error: function (data) {
                failHandler();
            }
        })
    }

    function init() {
        getWeather();
    }

    init();
});