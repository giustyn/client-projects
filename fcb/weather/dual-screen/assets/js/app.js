$(document).ready(function () {

    // Config variables
    var url = new ExtendedURL(window.location.href);
    var feed = url.getSearchParam("feed") || $(':root').css('--feed-type').trim(), // news, sports, celeb, fin, weather, markets
        style = url.getSearchParam("style") || $(':root').css('--feed-style').trim(), // default, classic, modern
        zipcode = url.getSearchParam("zipcode") || "63017",
        showIntro = parseInt(url.getSearchParam("intro") || $(':root').css('--intro-video')),
        feedHeader = parseInt(url.getSearchParam("header") || 0),
        showRevealer = parseInt(url.getSearchParam("revealer") || 1),
        showLogo = parseInt(url.getSearchParam("logo") || 1),
        $clrPrimary = url.getSearchParam("primary") || $(':root').css('--clr-primary'),
        $clrSecondary = url.getSearchParam("secondary") || $(':root').css('--clr-secondary'),
        $aosDuration = parseInt($(':root').css('--aos-duration')),
        $aosDelay = parseInt($(':root').css('--aos-delay')),
        $articleDuration = parseInt($(':root').css('--article-duration')),
        $articleLimit = parseInt($(':root').css('--article-limit')),
        $bumper = $('#bumper'),
        $revealer = $('#transition');

    // Local variables
    var introVideo = "/video/bumper.webm";
    
    var localBasePath = "c:/data";
    // var localBasePath = "./data";
    
    var localFeeds = {
        news: localBasePath + "/news/",
        celeb: localBasePath + "/celeb/",
        sports: localBasePath + "/sports/",
        fin: localBasePath + "/fin/",
        markets: localBasePath + "/fin/",
        weather: localBasePath + "/weather/"
    }

    // Server variables
    var serverBasePath = null; //"https://retail.adrenalineamp.com";
    var serverFeeds = {
        assets: serverBasePath + "/navori/assets/",
        news: serverBasePath + "/rss/Xnews/news/1920/",
        celeb: serverBasePath + "/rss/Xnews/celeb/1920/",
        sports: serverBasePath + "/rss/Xnews/sports/1920/",
        fin: serverBasePath + "/rss/Hnews/fin/1920/",
        markets: serverBasePath + "/rss/markets/",
        weatherimg: serverBasePath + "/rss/weather/1920/",
        weather: serverBasePath + "/navori/weather-json/"
        // weather: "https://kitchen.screenfeed.com/weather/v2/data/40778ps5v9ke2m2nf22wpqk0sj.json?current=true&interval=Daily&forecasts=5&location="
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
        // setInterval(function () {
        //     getTime();
        // }, timeRefresh);
    }

    function getMarketData(basePath) {
        // var dfd = $.Deferred();        
        var bgvideo = serverFeeds['assets'] + "/markets/video/markets.webm";
        return $.when(xmlRequest(basePath)
            .done(function (response) {
                var xml = $(response);
                var row = $("#individualStock");
                var container = $("#marketData");
                row.remove().removeClass("aos-animate");
                xml.find("Quote").each(function (index, quote) {
                    var clone = row.clone();
                    var $quote = $(quote);
                    var change = $quote.find("change").text();
                    var ispos = change.includes("+");
                    var isneg = change.includes("-");
                    var $changeImg = clone.find("#changeValue");
                    if (ispos) {
                        $changeImg.removeClass("changeZero").addClass("changeUp");
                    } else if (isneg) {
                        $changeImg.removeClass("changeZero").addClass("changeDown");
                    }
                    setTimeout(function () {
                        row.addClass("aos-animate");
                        clone.find("#stockName").text($quote.find("company_name").text().replace("Composite", "").trim());
                        clone.find("#lastPrice").text($quote.find("last").text());
                        clone.find("#changeValueNum").text($quote.find("change").text());
                        clone.find("#percentchangeValue").text($quote.find("change_percent").text());
                        container.append(clone);
                    }, ($aosDuration / 1.5) * index);
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
            // console.log(current, total)
            if ((total - current) < $aosDuration) {
                eventItem.removeEventListener("timeupdate", handler);
                // Show market data
                // 
                // Remove intro video
                $bumper.parent().fadeOut($aosDuration, function () {
                    $bumper.parent().remove();
                });
            }
        }
        return handler;
    }

    function marketVideoEventListeners(response, path) {
        if (showIntro === 0) {
            // 
            return;
        }
        var handler = marketVideoUpdate(response, path);
        $bumper[0].addEventListener("timeupdate", handler);
    }

    function loadMarkets() {
        var local = localFeeds['markets'] + "markets.xml";
        var server = serverFeeds['markets'] + "markets.xml";
        var assets = "./assets/";
        getMarketData(local)
            .done(function () {
                console.log("local market data found");
                $bumper.attr("src", assets + introVideo);
                $('#bg-video').attr("src", assets + "markets.webm");
            })
            .catch(function () {
                console.log("server market data found");
                $bumper.attr("src", serverFeeds['assets'] + feed + introVideo);
                $('#bg-video').attr("src", serverFeeds['assets'] + "/markets/video/markets.webm");
                getMarketData(server);
            })
    }

    function setWeather(weather) {
        var location = weather.Locations[0] || {};
        var current = location.WeatherItems[0] || {};
        var forecast = location.WeatherItems.slice(2, 6) || {};
        var iconPath = serverFeeds['assets'] + "/weather/icons/flat/";
        var iconPath = "assets/img/icons-line-animated/";

        $("#current-bg-video").attr({
            src: serverFeeds['assets'] + "/weather/video/" + getVideo(current.ConditionCode),
            type: "video/mp4"
        });

        // var forecast = mapWeatherData(weather);
        // var url = new URL(weather.data.iconLink[0]);
        // var videoName = getVideo(url.searchParams.get('i') || url.pathname.split("/").pop());
        // console.log(iconPath);
        // var bgVideo = $("#bg-video video");
        // bgVideo.attr({
        //     src: serverFeeds['assets'] + "/weather/video/" + videoName,
        //     type: "video/mp4"
        // });
        // $("#weather-bg").append(bgVideo);
        // console.log(videoName);

        $("#salutation").text(dayPartGreeting());
        $("#current-location").html(location.City);
        $("#current-condition").html(current.Description);
        $("#current-temp").html(current.CurrentTempF + "°");
        // $("#current-icon").attr("src", "/icons/" + current.Icon.split('.').slice(0, -1).join('.') + ".svg"); // local
        $("#current-icon").attr("src", iconPath + getIcon(current.ConditionCode));
        $("#current-high").html("HIGH " + current.HighTempF + "°");
        $("#current-low").html("LOW " + current.LowTempF + "°");
        $("#current-pop").html("RAIN " + current.ChanceOfPrecip + "%");
        $("#current-wind").html("WIND " + current.WindSpeedMph + " mph");
        $("#current-humidity").html("HUMIDITY " + current.Humidity + "%");
        $("#forecast .day").each(function (i, el) {
            // var iconURL = "/icons/" + forecast[i].Icon.split('.').slice(0, -1).join('.') + ".svg"; // local
            var $el = $(el);
            $el.find(".icon").attr("src", iconPath + getIcon(forecast[i].ConditionCode));
            $el.find(".forecast-day").text(moment(forecast[i].DateTime).format('dddd'));
            $el.find(".forecast-temp").text(forecast[i].HighTempF + "°");
        });
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
                $aosInit.addClass("aos-animate");
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
        var location = zipcode + ".json";
        var local = localFeeds['weather'];
        var server = serverFeeds['weather'];
        var imageURL = serverFeeds['weatherimg'] + zipcode + ".jpg";
        getWeather(local, "weather.json")
            .done(function (response) {
                if (response.status !== 400) {
                    console.log("Fetching local data..");
                    console.log(response.Locations[0]);
                    $(".weather-photo").css("background-image", "url(" + local + "weather.jpg")
                    $bumper.attr("src", "./assets" + introVideo);
                    $aosInit.removeClass("aos-animate");
                    weatherVideoEventListeners(response, local);
                } else {
                    return getWeather(server, location)
                        .done(function (response) {
                            console.log("Local data not found.");
                            $(".weather-photo").addClass('weather-default');
                            // console.log("source: " + server + location);
                            // $(".weather-photo").css("background-image", "url('" + imageURL + "')");
                            // $bumper.attr("src", serverFeeds['assets'] + feed + introVideo);
                            // $aosInit.removeClass("aos-animate");
                            // weatherVideoEventListeners(response, server);
                        });
                }
            });
    }

    // function animateArticles(response) {
    //     var $photo = $(".photo");
    //     var $story = $("#story");
    //     var $article = $("#article");
    //     $article.empty();
    //     $.each(response, function (i, article) {
    //         var storyClone = $story.clone();
    //         storyClone.show().attr("id", "story" + i).removeClass("aos-animate");
    //         var $storyText = storyClone.find(".story-headline");
    //         $storyText.html(article.story);
    //         storyClone.find(".photo").css("background-image", "url(" + article.image.src + ")");
    //         storyClone.find(".bg-blur").css("background-image", "url(" + article.image.src + ")");
    //         setTimeout(function () {
    //             $revealer.addClass('revealer--animate').delay(($aosDuration * 2)).queue(function (next) {
    //                 $(this).removeClass('revealer--animate');
    //                 next();
    //             });
    //             $article.append(storyClone);
    //             storyClone.addClass("aos-animate");
    //         }, $articleDuration * i);
    //         setTimeout(function () {                
    //             storyClone.remove().removeClass("aos-animate");
    //         }, ($articleDuration * (i + 1) + ($aosDuration + $aosDelay)));
    //     });
    // }

    function appendArticleComponents(articles) {
        var $template = $("#story-template");
        var $frag = $(document.createDocumentFragment());
        $template.parent().remove();
        articles.forEach(function (article, index) {
            var storyClone = $template.clone();
            storyClone.attr("id", "story" + index).removeClass("aos-animate").hide();
            var $storyText = storyClone.find(".story-headline");
            $storyText.html(article.story);
            storyClone.find(".photo").css("background-image", "url(" + article.image.src + ")");
            storyClone.find(".photo-bg").css("background-image", "url(" + article.image.src + ")");
            $frag.append(storyClone);
        });

        $frag.appendTo($("#article"));
    }

    function iterateArticleCarousel() {
        var $articleContainer = $("#article");
        var index = 0;

        function showArticle() {
            var $article = $articleContainer.children().eq(index);

            $article.removeClass('aos-animate').show();
            $revealer.addClass('revealer--animate').delay(($aosDuration * 2)).queue(function (next) {
                $(this).removeClass('revealer--animate');
                next();
            });
            $article.addClass("aos-animate");

            setTimeout(function () {
                $article.fadeOut($aosDuration);
            }, ($articleDuration + ($aosDuration + $aosDelay)));

            index++;
            if (index >= $articleLimit) {
                index = 0;
            }
        }

        showArticle();

        setInterval(showArticle, $articleDuration + ($aosDuration + $aosDelay));
    }

    function handleArticleCarousel(articles) {
        appendArticleComponents(articles);
        iterateArticleCarousel();
    }

    function articlesVideoUpdate(response) {
        function handler(event) {
            const eventItem = event.target;
            const current = Math.round(eventItem.currentTime * 1000);
            const total = Math.round(eventItem.duration * 1000);
            // console.log(current, total)
            if ((total - current) < $aosDuration) {
                eventItem.removeEventListener("timeupdate", handler);
                // Show articles
                handleArticleCarousel(response.articles);
                // animateArticles(response.articles);
                // Remove intro video
                $bumper.parent().fadeOut($aosDuration - 500, function () {
                    $bumper.parent().remove();
                });
            }
        }
        return handler;
    }

    function articleVideoEventListeners(response, path) {
        $('#feed').find('*').removeClass("aos-animate");
        $('#slider').find('*').addClass("aos-animate");
        if (showIntro === 0) {
            handleArticleCarousel(response.articles);
            // animateArticles(response.articles);
            return;
        }
        var handler = articlesVideoUpdate(response, path);
        $bumper[0].addEventListener("timeupdate", handler);
    }

    function loadFeeds() {
        var location = zipcode + ".json";
        var local = localFeeds[feed];
        var server = serverFeeds[feed];
        var indexes = getRandomIndexes($articleLimit);
        getArticles(local, indexes)
            .done(function (response) {
                if (response.articles) {
                    console.log("Loading local data..");
                    console.log("source: " + local, '\n', response.articles);
                    getWeather(localFeeds['weather'], "weather.json")
                        .done(function (response) {
                            setWeather(response);
                        });
                    $bumper.attr("src", "./assets/" + introVideo);
                    articleVideoEventListeners(response, local);
                } else {
                    return getArticles(server, indexes)
                        .done(function (response) {
                            console.log("Local data not found. Fetching server data..");
                            console.log("source: " + server, '\n', response.articles);
                            getWeather(serverFeeds['weather'], location)
                                .done(function (response) {
                                    setWeather(response);
                                });
                            $bumper.attr("src", serverFeeds['assets'] + feed + introVideo);
                            articleVideoEventListeners(response, server);
                        });
                }
            });
    }

    function init() {
        AOS.init({
            // Global settings:
            disableMutationObserver: false, // disables automatic mutations' detections (advanced)
            // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
            offset: 0, // offset (in px) from the original trigger point
            delay: $aosDelay, // values from 0 to 3000, with step 50ms
            duration: $aosDuration, // values from 0 to 3000, with step 50ms
            easing: 'ease-in-out', // default easing for AOS animations
            once: false, // whether animation should happen only once - while scrolling down
            mirror: false, // whether elements should animate out while scrolling past them
            anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
        });
        $aosInit = $(".aos-init");
        console.log("aos-duration: " + $aosDuration);
        console.log("aos-delay: " + $aosDelay);
        getQueryParams();
        if (feed === 'weather') {
            $("#feed").remove();
            $("#markets").remove();
            loadWeather();
        }
        if (feed === 'markets') {
            $("#feed").remove();
            $("#weather").remove();
            loadMarkets();
        }
        if (feed === 'fin') {
            $("#story-container").remove();
            $("#feedHeader").remove();
            $(".photo").removeClass("ken-burns");
        }
        if (feed !== 'markets' && feed !== 'weather') {
            $("#markets").remove();
            $("#weather").remove();
            loadFeeds();
        }
        getDate();
        getTime();
    }

    init();

});