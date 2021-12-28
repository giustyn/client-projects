$(document).ready(function () {

    // Config variables
    var url = new ExtendedURL(window.location.href);
    var feed = url.getSearchParam("feed") || $(':root').css('--feed-type').trim(), // news, sports, celeb, fin, weather, markets
        style = url.getSearchParam("style") || $(':root').css('--feed-style').trim(), // default, classic, modern
        zipcode = url.getSearchParam("zipcode") || "63017",
        showIntro = parseInt(url.getSearchParam("intro") || $(':root').css('--intro-video')),
        feedHeader = parseInt(url.getSearchParam("header") || 0),
        showRevealer = parseInt(url.getSearchParam("revealer") || $(':root').css('--revealer-enabled')),
        showLogo = parseInt(url.getSearchParam("logo") || 1),
        $clrPrimary = url.getSearchParam("primary") || $(':root').css('--clr-primary'),
        $clrSecondary = url.getSearchParam("secondary") || $(':root').css('--clr-secondary'),
        $aosDuration = parseInt($(':root').css('--aos-duration')),
        $aosDelay = parseInt($(':root').css('--aos-delay')),
        $bumper = $('#bumper'),
        $revealer = $('#transition');

    // Local variables
    var introVideo = "/video/bumper.webm";
    var localBasePath = "c:/data";
    var localFeeds = {
        news: localBasePath + "/news/",
        celeb: localBasePath + "/celeb/",
        sports: localBasePath + "/sports/",
        fin: localBasePath + "/fin/",
        markets: localBasePath + "/fin/",
        weather: localBasePath + "/weather/"
    }

    // Server variables
    var serverBasePath = "https://retail.adrenalineamp.com";
    var serverFeeds = {
        assets: serverBasePath + "/navori/assets/",
        news: serverBasePath + "/rss/Xnews/news/1920/",
        celeb: serverBasePath + "/rss/Xnews/celeb/1920/",
        sports: serverBasePath + "/rss/Xnews/sports/1920/",
        fin: serverBasePath + "/rss/Hnews/fin/1920/",
        markets: serverBasePath + "/rss/markets/",
        weatherimg: serverBasePath + "/rss/weather/1920/",
        // weather: serverBasePath + "/navori/weather-json/"
        weather: "https://kitchen.screenfeed.com/weather/v2/data/40778ps5v9ke2m2nf22wpqk0sj.json?current=true&interval=Daily&forecasts=5&location="
    };

    function getQueryParams() {
        function setWeatherLayout(type) {
            if (type === "modern") {
                $("#weather #static").remove();
            } else {
                $('#weather #bg-video').remove();
                $('#weather #wrapper').remove();
            }                    
        }
        if (showIntro === 0) {
            console.log("intro: " + showIntro);
            $bumper.parent().remove();
        }
        if (showRevealer === 0) {
            console.log("revealer: " + showRevealer);
            $('#story-template').attr("data-aos", "fade");
            $revealer.remove();
        } else if (showRevealer === 1 && showIntro === 0) {
            $revealer.addClass("revealer--animate");
        }   
        if (feedHeader === 0) {
            console.log("header: " + feedHeader);
            $("#header").remove();
        }
        if (showLogo === 0) {
            console.log("logo: " + showLogo);
            $("#logo").remove();
        }
        if (style !== null) {
            console.log("style: " + style);
            $("#photo-container .photo").addClass(style);
            $("#story-container").addClass(style);
            setWeatherLayout(style);
            if (style === "default") {
                $('#story-container').attr("data-aos", "fade-up");
            } else if (style === "classic") {
                $('article').attr("data-aos", "fade");
                $(".photo").attr("data-aos", "fade").attr("data-aos-delay", $aosDelay);
            } else if (style === "modern") {                
                $('#story-container').attr("data-aos", "fade-left");
                $(".photo").attr("data-aos", "fade").attr("data-aos-delay", $aosDelay);
            }
        }
        if ($clrPrimary !== null) {
            console.log("primary:" + $clrPrimary);
            $(':root').css('--clr-primary', $clrPrimary);
        }
        if ($clrSecondary !== null) {
            console.log("secondary:" + $clrSecondary);
            $(':root').css('--clr-secondary', $clrSecondary);
        }
    }

    function dayPartGreeting() {
        var hours = new Date().getHours();
        var greeting;
        if (hours >= 0 && hours < 12) {
            greeting = ('Good morning,');
        } else if (hours >= 12 && hours < 17) {
            greeting = ('Good afternoon,');
        } else if (hours >= 17 && hours < 24) {
            greeting = ('Good evening,');
        }
        return greeting;
    }

    function getDate() {
        var todaysDate = moment().format('dddd MMMM D, YYYY');
        $("#date").html(todaysDate);
    }

    function getTime() {
        var currentTime = moment().format('h:mm A');
        var timeRefresh = 60000;
        $("#time").html(currentTime);
        setInterval(function () {
            getTime();
        }, timeRefresh);
    }

    function setWeather(weather) {
        var location = weather.Locations[0] || {};
        var current = location.WeatherItems[0] || {};
        var forecast = location.WeatherItems.slice(1,6) || {};
        var iconPath = "assets/img/icons-line-animated/";
        // var iconPath = serverFeeds['assets'] + "/weather/icons/flat/";

        // $("#current-bg-video").attr({
        //     src: serverFeeds['assets'] + "/weather/video/" + getVideo(current.ConditionCode),
        //     type: "video/mp4"
        // });

        var imageURL = "https://source.unsplash.com/1920x1080/?weather";
        $(".weather-img").css("background-image", "url(" + imageURL + ")");

        $("#forecast .day").each(function (i, el) {
            var $el = $(el);
            $el.find(".icon").attr("src", iconPath + getIcon(forecast[i].ConditionCode));
            $el.find(".forecast-day").text(moment(forecast[i].DateTime).format('dddd'));
            $el.find(".description").text(forecast[i].ShortDescription);
            $el.find(".high-temp").text(forecast[i].HighTempF + "°");
            $el.find(".low-temp").text(forecast[i].LowTempF + "°");
        });

        $("#today.day").each(function (i, el) {
            var $el = $(el);
            $el.find(".forecast-day").text("Today");
            $el.find(".description").text(current.ShortDescription);
            $el.find(".high-temp").text(current.HighTempF + "°");
            $el.find(".low-temp").text(current.LowTempF + "°");
            $el.find(".icon").attr("src", iconPath + getIcon(current.ConditionCode));
        });
        $(".location").text(location.City);
    }

    function weatherVideoUpdate(response) {
        function handler(event) {
            const eventItem = event.target;
            const current = Math.round(eventItem.currentTime * 1000);
            const total = Math.round(eventItem.duration * 1000);
            // console.log(current, total)
            if ((total - current) < $aosDuration) {
                eventItem.removeEventListener("timeupdate", handler);
                // Start animations
                setWeather(response);
                // document.querySelectorAll('#weather > *') = anime.play;
                // $aosInit.addClass("aos-animate");
                $revealer.addClass("revealer--animate");
                // Remove intro video
                $bumper.fadeOut($aosDuration, function () {
                    $bumper.parent().remove();
                });
            }
        }
        return handler;
    }

    function weatherVideoEventListeners(response) {
        if (showIntro === 0) {
            $aosInit.addClass("aos-animate");
            setWeather(response);
            return;
        }
        var handler = weatherVideoUpdate(response);
        $bumper[0].addEventListener("timeupdate", handler);
    }

    function loadWeather() {
        var location = zipcode;// + ".json";
        var local = localFeeds['weather'];
        var server = serverFeeds['weather'];
        // var imageURL = serverFeeds['weatherimg'] + zipcode + ".jpg";
        getWeather(local, "weather.json")
            .done(function (response) {
                if (response.status !== 400) {
                    console.log("Fetching local data..");
                    console.log(response.Locations[0]);
                    // $(".photo").css("background-image", "url(" + local + "weather.jpg")
                    $bumper.attr("src", "./assets" + introVideo);
                    $aosInit.removeClass("aos-animate");
                    weatherVideoEventListeners(response, local);
                } else {
                    return getWeather(server, location)
                        .done(function (response) {
                            console.log("Local data not found. Fetching server data..");
                            console.log("source: " + server + location);
                            // $(".photo").css("background-image", "url('" + imageURL + "')");
                            $bumper.attr("src", serverFeeds['assets'] + feed + introVideo);
                            $aosInit.removeClass("aos-animate");
                            weatherVideoEventListeners(response, server);
                        });
                }
            });
    }

    function init() {
        // AOS.init({
        //     // Global settings:
        //     disableMutationObserver: false, // disables automatic mutations' detections (advanced)
        //     // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
        //     offset: 0, // offset (in px) from the original trigger point
        //     delay: $aosDelay, // values from 0 to 3000, with step 50ms
        //     duration: $aosDuration, // values from 0 to 3000, with step 50ms
        //     easing: 'ease-out', // default easing for AOS animations
        //     once: false, // whether animation should happen only once - while scrolling down
        //     mirror: false, // whether elements should animate out while scrolling past them
        //     anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
        // });
        $aosInit = $(".aos-init");
        console.log("aos-duration: " + $aosDuration);
        console.log("aos-delay: " + $aosDelay);
        getQueryParams();
        getDate();
        getTime();
        loadWeather();
    }

    init();
});