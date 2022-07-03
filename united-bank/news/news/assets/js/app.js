$(document).ready(function() {

    // Updated 02/11/2021

    // Set the feed type
    var feed = "sports"; // news, sports, celeb, fin, weather, markets

    // Local variables
    var localBasePath = "c:/data"; // weather.json  
    var videoSource = "/video/bumper.webm"

    // Hosted variables
    var serverBasePath = "https://retail.adrenalineamp.com"
    var serverWeatherPath = "/navori/weather-json/";
    var serverAssetPath = "/navori/assets/";
    var animationSeconds = 8;
    var totalStories = 5;

    var serverFeeds = {
        news : "/rss/Xnews/news/1920/",
        celeb : "/rss/Xnews/celeb/1920/",
        sports : "/rss/Xnews/sports/1920/",
        fin : "/rss/Hnews/fin/1920/",
        markets : "/rss/markets/markets.xml",
        weather : "/navori/weather-json/"
    }

    var $content = $('.content'),
        $bumper = $('#bumper'),
        $story = $(".story"),
        $photo = $('.feature-imgcontainer'),
        $image = $('.feature-img'),
        $backdrop = $('.feature-imgbg'),
        $revealer = $('.revealer'),
        $aosInit = $(".aos-init"),
        zipcode = "63017";

    AOS.init({
        // Global settings:
        disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
        startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
        initClassName: 'aos-init', // class applied after initialization
        animatedClassName: 'aos-animate', // class applied on animation
        useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
        disableMutationObserver: false, // disables automatic mutations' detections (advanced)
        debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
        throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)


        // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
        offset: 0, // offset (in px) from the original trigger point
        delay: 300, // values from 0 to 3000, with step 50ms
        duration: 1200, // values from 0 to 3000, with step 50ms
        easing: 'ease', // default easing for AOS animations
        once: false, // whether animation should happen only once - while scrolling down
        mirror: false, // whether elements should animate out while scrolling past them
        anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
    });

    function getQueryValue(parameter) {
        var url = new URL(window.location.href);
        return url.searchParams.get(parameter);
    }

    function dayPartGreeting() {
        var hours = new Date().getHours();
        var greeting;
        var morning = ('Good Morning,');
        var afternoon = ('Good Afternoon,');
        var evening = ('Good Evening,');

        if (hours >= 0 && hours < 12) {
            greeting = morning;
        } else if (hours >= 12 && hours < 17) {
            greeting = afternoon;
        } else if (hours >= 17 && hours < 24) {
            greeting = evening;
        }

        $('.salutation').text(greeting);
    }

    function getIndexes() {
        var index = Math.floor(Math.random() * 10);
        var indexes = [];

        for (var i = 0; i < totalStories; i++) {
            if (index + i >= 10) index = -1;
            indexes.push(index + i);
        }
        return indexes;
    }

    function Article(xml, index, basePath) {
        this.story = xml ? $(xml).find("story").text() : null;
        // this.image = basePath + index + ".jpg";
        this.image = new Image()
        this.image.src = basePath + index + ".jpg";
        return this;
    }

    function resizeFont(data) {
        var textLength = data.length;
        var maxChars = 120;
  
        console.log("Story: " + data + " - Length: " + textLength + ", Max: " + maxChars)

        if (textLength > maxChars) {
            return {
                'font-size': '6vh' // Reduce font size 
            };
        }
        return data
    }

    function xmlRequest(path) {
        var dfd = $.Deferred();
        var xhttp = new XMLHttpRequest();
        var regex = new RegExp(/(?=&)(?:(?!&amp;|&lt;|&gt;|&quot;|&apos;|[a-zA-Z\d\s]).){1}/, "g");
        xhttp.onload = function() {
            // console.log(xhttp.responseText)
            var parser = new DOMParser();
            return dfd.resolve(parser.parseFromString(xhttp.responseText.replace(regex, "&amp;"), "text/xml"));
        }

        xhttp.onerror = function(err) {
            // console.log(err)
            return dfd.reject(err);
        };

        xhttp.open("GET", path, true);
        xhttp.send();
        return dfd.promise()
    }

    function xmlFallbackRequest(basePath, articleNums) {
        var dfd = $.Deferred();
        $.when.apply($, $.map(articleNums, function(i) {
                return xmlRequest(basePath + i + ".xml");
            }))
            .done(function(...results) {
                return dfd.resolve(results)
            })   
            .fail(function() {
                return dfd.resolve()
            })
            return dfd.promise()
    }

    function getArticles(basePath, articleNums, fallback) {
        var articles = [];
        var dfd = $.Deferred();
        xmlFallbackRequest(basePath, articleNums)
            .done(function(results) {
                if (!results) {
                    return dfd.resolve({articleNums:articleNums})
                }
                // console.log(results);
                articles = $.map(results, function(result, i) {
                    // console.log(result)
                    return new Article(result, articleNums[i], basePath);
                });
                return dfd.resolve({articles:articles})
            })
            return dfd.promise()
    }

    function request(filePath, dataType) {
        var dfd = $.Deferred();
        $.ajax({
            url: filePath,
            type: "GET",
            dataType: dataType,
            error: function() {
                return dfd.resolve({
                    status: 400
                })
            },
            success: function(response) {
                return dfd.resolve(response)
            }
        })
        return dfd.promise()
    }

    function getData(filePath, dataType, fallback) {
        return $.when(
                request(filePath, dataType)
            )
            .done(function(response) {
                console.log(response)
            })
    }

    function getWeather(basePath) {
        return $.when(
                getData(basePath + (getQueryValue("zipcode") || zipcode) + ".json", "JSON")
            )
            .done(function(response) {                
                // setWeather(response);
                // console.log(response.location.city);
                // console.log(response.location.zipcode);
            })
    }

    function DailyForecast(day, temp, img, description) {
        this.day = day;
        this.temp = temp;
        this.icon = getIcon(img);
        this.description = description;
        return this;
    }

    function getDefaultIcon() {
        var hour = moment().format("H");
        if (hour < 4 && hour > 16) return 'nskc_fair-night.svg.default';
        else if (hour >= 4 && hour < 6) return 'skc_fair.svg.default';
        else return 'skc_fair.svg.default';
    }

    function getVideo(weatherImg) {
        var imgName = weatherImg
            .replace(".png", "")
            .replace("m_", "")
            .split("_")
            .map(function(elem) {
                return elem.replace(/\d+/g, "");
            })
            .join("_");
            console.log(imgName);
        switch (imgName) {
            case 'skc': // Fair
            case 'nskc':
                return 'clear.mp4';
            case 'few': // A Few Clouds
            case 'nfew':
            case 'sct': // Partly Cloudy
            case 'nsct':
                return 'partlycloudy.mp4';
            case 'bkn': // Mostly Cloudy
            case 'nbkn':
                return 'cloudy.mp4';
            case 'ovc': // Overcast
            case 'novc':
                return 'overcast.mp4';
            case 'sn': // Snow
            case 'nsn':
                return 'snow.mp4';
            case 'ra_sn': // Rain Snow
            case 'nra_sn':
            case 'raip': // Rain Ice Pellets
            case 'nraip':
            case 'fzra': // Freezing Rain
            case 'nfzra':
            case 'ra_fzra': // Freezing rain rain
            case 'nra_fzra':
            case 'fzra_sn': // Freezing Rain Snow
            case 'nfzra_sn':
                return 'rain.mp4';
            case 'ip': // Ice Pellets
            case 'nip':
            case 'snip': // Snow Ice Pellets
            case 'nsnip':
            case 'blizzard': // Blizard
            case 'nblizzard':
                return 'snow.mp4';
            case 'minus_ra': // Light Rain
            case 'hi_shwrs': // Showers in Vicinity
            case 'hi_nshwrs':
            case 'ra': // Rain
            case 'nra':
            case 'shra': // Rain Showers
            case 'nshra':
                return 'rain.mp4';
            case 'tsra': // Thunderstorm
            case 'ntsra':
            case 'scttsra': // Thunderstorm in Vicinity
            case 'nsttsra':
            case 'hi_tsra': // (Cloud cover < 60%) Thunderstorm in Vicinity
            case 'hi_ntsra':
            case 'fc': // Funnel Cloud
            case 'nfc':
            case 'tor': // Tornado
            case 'ntor':
            case 'hur_warn': // Hurricane Warning
            case 'hur_watch': // Hurricane Watch
            case 'ts_warn': // Tropical Storm Warning
            case 'ts_watch': // Tropical Storm Watch
            case 'ts_nowarn': // Tropical Storm Conditions
                return 'storm.mp4';
            case 'wind_skc': // Windy
            case 'nwind_skc':
                return 'clear.mp4';
            case 'wind_few': // A Few Clouds and Windy
            case 'nwind_few':
            case 'wind_sct': // Partly Cloudy and Windy
            case 'nwind_sct':
                return 'partlycloudy.mp4';
            case 'wind_bkn': // Mostly Cloudy and Windy
            case 'nwind_bkn':
                return 'cloudy.mp4';
            case 'wind_ovc': // Overcast and Windy
            case 'nwind_ovc':
                return 'clear.mp4';
            case 'du': // Dust
            case 'ndu':
            case 'fu': // Smoke
            case 'nfu':
            case 'hz': // Haze
            case 'hot': // Hot
            case 'cold': // Cold
            case 'ncold':
            case 'fg': // Fog/Mist
            case 'nfg':

          default:
            return 'clear.mp4';
        }        
    }

    function getIcon(weatherImg) {
        var imgName = weatherImg
            .replace(".png", "")
            .replace("m_", "")
            .split("_")
            .map(function(elem) {
                return elem.replace(/\d+/g, "");
                // if (elem.charAt(0) === "n") return elem.substring(1);
                //return elem;
            })
            .join("_");
            // console.log(imgName);
        switch (imgName) {
            case 'skc': // Fair
                return 'skc_fair.svg';
            case 'nskc':
                return 'nskc_fair-night.svg';

            case 'few': // A Few Clouds
                return 'few_cloudy.svg';
            case 'nfew':
                return 'nfew_cloudy-night.svg';

            case 'sct': // Partly Cloudy
                return 'sct_cloudy.svg';
            case 'nsct':
                return 'nsct_cloudy-night.svg';

            case 'bkn': // Mostly Cloudy
                return 'bkn_cloudy.svg';
            case 'nbkn':
                return 'nbkn_cloudy-night.svg';

            case 'ovc': // Overcast
                return 'ovc_overcast.svg';
            case 'novc':
                return 'novc_overcast-night.svg';

            case 'sn': // Snow
                return 'sn_snow.svg';
            case 'nsn':
                return 'nsn_snow-night.svg';

            case 'ra_sn': // Rain Snow
                return 'ra_sn_rainsnow.svg';
            case 'nra_sn':
                return 'nra_sn_rainsnow-night.svg';

            case 'raip': // Rain Ice Pellets
                return 'raip_rainicepellets.svg';
            case 'nraip':
                return 'nraip_rainicepellets-night.svg';

            case 'fzra': // Freezing Rain
                return 'fzra_freezingrain.svg';
            case 'nfzra':
                return 'nfzra_freezingrain-night.svg';

            case 'ra_fzra': // Freezing rain rain
                return 'ra_fzra_rainfreezingrain.svg';
             case 'nra_fzra':
                return 'nra_fzra_rainfreezingrain-night';

            case 'fzra_sn': // Freezing Rain Snow
                return 'fzra_sn_rainfreezingsnow.svg';
            case 'nfzra_sn':
                return 'nfzra_sn_rainfreezingsnow-night.svg';

            case 'ip': // Ice Pellets
                return 'ip_icepellets.svg';
            case 'nip':
                return 'nip_icepellets-night.svg';

            case 'snip': // Snow Ice Pellets
                return 'snip_snowicepellets.svg';
            case 'nsnip':
                return 'nsnip_snowicepellets-night.svg';

            case 'blizzard': // Blizard
                return 'blizzard_blizzard.svg';
            case 'nblizzard':
                return 'nblizzard_blizzard-night.svg';

            case 'minus_ra': // Light Rain
                return 'minus_ra_lightrain.svg';

            case 'hi_shwrs': // Showers in Vicinity
                return 'hi_shwrs_showersinvicinity.svg';
            case 'hi_nshwrs':
                return 'hi_nshwrs_showersinvicinity-night.svg';

            case 'ra': // Rain
                return 'ra_rain.svg';
            case 'nra':
                return 'nra_rain-night.svg';

            case 'shra': // Rain Showers
                return 'shra_rainshowers.svg';
            case 'nshra':
                return 'nshra_rainshowers-night';

            case 'tsra': // Thunderstorm
                return 'tsra_thunderstorm.svg';
            case 'ntsra':
                return 'ntsra_thunderstorm-night.svg';

            case 'scttsra': // Thunderstorm in Vicinity
                return 'scttsra_thunderstorminvicinity.svg';
            case 'nsttsra':
                return 'nsttsra_thunderstorminvicinity-night.svg';

            case 'hi_tsra': // (Cloud cover < 60%) Thunderstorm in Vicinity
                return 'hi_tsra_thunderstorminvicinity60.svg';
            case 'hi_ntsra':
                return 'hi_ntsra_thunderstorminvicinity60-night.svg';

            case 'fc': // Funnel Cloud
                return 'fc_funnelcloud.svg';
            case 'nfc':
                return 'nfc_funnelcloud-night.svg';

            case 'tor': // Tornado
                return 'tor_tornado.svg';
            case 'ntor':
                return 'ntor_tornado-night.svg';

            case 'hur_warn': // Hurricane Warning
                return 'hur_warn_hurricanewarning.svg';
            case 'hur_watch': // Hurricane Watch
                return 'hur_watch_hurricanewatch.svg';

            case 'ts_warn': // Tropical Storm Warning
                return 'ts_warn_tropicalstormwarning.svg';
            case 'ts_watch': // Tropical Storm Watch
                return 'ts_watch_tropicalstormwatch.svg';
            case 'ts_nowarn': // Tropical Storm Conditions
                return 'ts_nowarn_triopicalstormconditions.svg';

            case 'wind_skc': // Windy
                return 'wind_skc_windy.svg';
            case 'nwind_skc':
                return 'nwind_skc_windy-night.svg';

            case 'wind_few': // A Few Clouds and Windy
                return 'wind_few_fewclouds.svg';
            case 'nwind_few':
                return 'nwind_few_fewclouds-night.svg';

            case 'wind_sct': // Partly Cloudy and Windy
                return 'wind_sct_partlycloudy.svg';
            case 'nwind_sct':
                return 'nwind_sct_partlycloudy-night.svg';

            case 'wind_bkn': // Mostly Cloudy and Windy
                return 'wind_bkn_mostlycloudy.svg';
            case 'nwind_bkn':
                return 'nwind_bkn_mostlycloudy-night.svg';

            case 'wind_ovc': // Overcast and Windy
                return 'wind_ovc_overcast.svg';
            case 'nwind_ovc':
                return 'nwind_ovc_overcast-night.svg';

            case 'du': // Dust
                return 'du_dust.svg';
            case 'ndu':
                return 'ndu_dust-night.svg';

            case 'fu': // Smoke
                return 'fu_smoke.svg';
            case 'nfu':
                return 'nfu_smoke-night.svg';

            case 'hz': // Haze
                return 'hz_haze.svg';

            case 'hot': // Hot
                return 'hot_temp.svg';

            case 'cold': // Cold
                return 'cold_temp.svg';
            case 'ncold':
                return 'ncold_temp-night.svg';

            case 'fg': // Fog/Mist
                return 'fg_fog.svg';
            case 'nfg':
                return 'nfg_fog-night.svg';

            default:
                return getDefaultIcon();
        }
    }

    function mapWeatherData(weather) {
        // var daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

        return weather.time.startValidTime.reduce(function(acc, timestamp, i) {
            if (i % 2 === 0) {
                 var url = new URL(weather.data.iconLink[i]);

                acc.push(
                    new DailyForecast(
                        moment(timestamp).format('dddd'),
                        weather.data.temperature[(i % 2) + i],
                        url.searchParams.get('i') || url.pathname.split("/").pop(),
                        weather.data.weather[i].toLowerCase().split("then")[0].trim()
                    )
                );               
            }
            return acc;
        }, []);
    }

    function setContent(weather) {
        var currentDay = moment();
        var forecast = mapWeatherData(weather)
        var url = new URL(weather.data.iconLink[0]);
        var videoName = getVideo(url.searchParams.get('i') || url.pathname.split("/").pop());
        var iconLocation = serverBasePath + serverAssetPath + "/weather/icons/flat-01/";
        // var introVideo = document.getElementById("bumper");
        console.log(videoName);
        var source = $("<source>");
        source.attr({
            src: serverBasePath + serverAssetPath + "/weather/video/" + videoName,
            type: "video/mp4"
        })
        $("#weather-bg").append(source);
        $(".day").each(function(i, elem) {
            var $elem = $(elem);
            $elem.find(".forecast-day").text(forecast[i].day);
            $elem.find(".icon").attr("src", iconLocation + forecast[i].icon);
            $elem.find(".forecast-temp").text(forecast[i].temp);
        });

        document.getElementById("current-location").textContent = weather.location.city;
        document.getElementById("current-temp").textContent = weather.data.temperature[0];
        document.getElementById("current-condition").textContent = weather.data.weather[0];
        document.getElementById("current-icon").setAttribute("src", iconLocation + forecast[0].icon);
        document.getElementById("date").textContent = currentDay.format("dddd, D MMMM");
        document.getElementById("time").textContent = currentDay.format("h:mm a");
    }

    function getDateTime() {
        var todaysDate = moment().format('MMMM D, YYYY');
        var currentTime = moment().format('h:mm A');
        var meridium = moment().format('A');
        var timeRefresh = 1000;

        $("#date").html(todaysDate)
        $("#time").html(currentTime) 
        // $("#meridium").html(meridium)

        setInterval(function() {
            getDateTime();
        }, timeRefresh);
    }

    function getMarketData() {
        var dfd = $.Deferred();
        xmlRequest(serverBasePath + serverFeeds[getQueryValue("feed") || feed])
            .done(function(response) {
                var duration = $("body").attr("data-aos-duration");
                var xml = $(response)
                var row = $("#individualStock")
                var container = $("#marketData")
                console.log("AOS duration: " + duration)

                row.remove().removeClass("aos-animate")
                // row.addClass("d-none")

                xml.find("Quote").each(function(index, quote) {
                    // var clone = row.clone().removeClass("d-none")
                    var clone = row.clone()
                    var $quote = $(quote)
                    var change = $quote.find("change").text()
                    var ispos = change.includes("+")
                    var isneg = change.includes("-")
                    var $changeImg = clone.find("#changeValue")
                    // console.log(change)
                    if (ispos) {
                        $changeImg.removeClass("changeZero").addClass("changeUp")
                    } else if (isneg) {
                        $changeImg.removeClass("changeZero").addClass("changeDown")
                    }        

                    setTimeout(function() {
                        row.addClass("aos-animate")
                        clone.find("#stockName").text($quote.find("company_name").text().replace("Composite", "").trim())
                        clone.find("#lastPrice").text($quote.find("last").text())
                        clone.find("#changeValueNum").text($quote.find("change").text())
                        clone.find("#percentchangeValue").text($quote.find("change_percent").text())                    
                        container.append(clone)
                        // $revealer.addClass("revealer--animate");                    
                    }, duration * (index + 1))
                })

                console.log(response)
            })
    }

    function animateArticles(articles) {
        var interval = animationSeconds * 1000;
        var duration = $("body").attr("data-aos-duration");
        console.log("AOS duration: " + duration)
        var storyBlank = $("#storyBlank")
        $feed = $("#feed");
        $feed.empty();
        $.each(articles, function(i, article) {
            // if (!article.story) {
            //     storyBlank.hide();
            //     console.log("That's all folks")
            // }
            var storyClone = storyBlank.clone()
            storyClone.show().attr("id", "story" + i).removeClass("aos-animate")
            var $storyText = storyClone.find(".story")
            $storyText.html(article.story)
            var $imgcontainer = storyClone.find(".feature-imgcontainer")

            storyClone.find(".feature-img").css("background-image" ,"url(" + article.image.src + ")");
            storyClone.find(".feature-imgbg").css("background-image" ,"url(" + article.image.src + ")");

            setTimeout(function() {
                $revealer.addClass("revealer--animate");
                $feed.append(storyClone)
                // storyClone.addClass("aos-animate")
            }, interval * i - 500)
            setTimeout(function() {
                $revealer.removeClass("revealer--animate");
                // $feed.children("a:eq(0)").not(':last-child').remove()
                // $feed.find(".stage").hide()
                // storyClone.removeClass("aos-animate")
            }, (interval * (i + 1) - duration));
        });
    }

    function videoTimeUpdate(event) {
        const eventItem = event.target;
        const current = Math.round(eventItem.currentTime * 1000);
        const total = Math.round(eventItem.duration * 1000);
        // console.log(current, total)
        if ((total - current) < 500) {
            eventItem.removeEventListener("timeupdate", videoTimeUpdate);
            // console.log("video ending")
            // Start animations
            $aosInit.addClass('aos-animate');
            $revealer.show().addClass("revealer--animate");

            $($bumper).fadeOut(500, function() {
                $($bumper).remove();
            });
        }
    }

    function videoHandler(basePath) {

        //
        // this function needs major refinement!
        //

        var fallback = serverBasePath + serverAssetPath + (getQueryValue("feed") || feed) + videoSource

        $bumper
            .on( "error", function() {
                $(this).attr("src", fallback);
            })
            .attr("src", "assets" + videoSource);

        if ($bumper[0]) {
            $bumper[0].addEventListener('ended', function() {
                animateArticles(basePath);
            });
        } else {
            animateArticles(basePath);
        }
    }

    function init() {
        var dfd = $.Deferred();
        $aosInit.removeClass("aos-animate")
        $("#storyBlank").hide()

        if ((getQueryValue("feed") || feed) == 'weather') {
            $aosInit.addClass("aos-animate")
            $("#weather").show()
            $("#feed").remove()
            $("#markets").remove()

            // getArticles(localBasePath + "/" + feed + "/", getIndexes())
            getWeather(localBasePath + "/weather/")
                .done(function(response) {
                    if (response.articles) {
                        console.log("Loading local data..")
                        setContent(response)
                        // videoHandler(response)
                    } else {
                        return getWeather(serverBasePath + serverWeatherPath)
                            .done(function(response) {
                                console.log("Local data not found. Fetching server data..")
                                console.log(response)
                                setContent(response)
                                // videoHandler(response)
                            })
                    }
                })
        }

        if ((getQueryValue("feed") || feed) == 'fin') {
            $(".overlay").remove()
            $(".logo").remove()
        }
        
        if ((getQueryValue("feed") || feed) == 'markets') {
            console.log("Loading Markets...")
            $("#markets").show()
            $("#feed").remove()
            $("#weather").remove()
            getDateTime()
            getMarketData()
            // videoHandler(response.articles)
        }

        if ((getQueryValue("feed") || feed) != 'markets' && (getQueryValue("feed") || feed) != 'weather') {
            $("#feed").show()
            $("#markets").remove()
            $("#weather").remove()
            getArticles(localBasePath + "/" + feed + "/", getIndexes())
                .done(function(response) {
                    if (response.articles) {
                        console.log("Loading local data..")
			            getWeather(localBasePath + "/weather/");
                        videoHandler(response.articles)
                    } else {
                        return getArticles(serverBasePath + serverFeeds[(getQueryValue("feed") || feed)], getIndexes())
                            .done(function(response) {
                                console.log("Local data not found. Fetching server data..")
                                console.log(response)
				                getWeather(serverBasePath + serverWeatherPath)
                                videoHandler(response.articles)
                            })
                    }
                })
        }
    }

    if ($bumper.is(':empty')) {
        $bumper[0].addEventListener("playing", function() {
            // console.log("[Playing] loading of video");
            if ($bumper[0].readyState == 4) {
                $bumper[0].addEventListener("timeupdate", videoTimeUpdate);
                // console.log("[Finished] loading of video");
            }
        });

    }

    init();

    console.log("feed: " + (getQueryValue("feed") || feed));
    console.log("zipcode: " + (getQueryValue("zipcode") || zipcode));

});