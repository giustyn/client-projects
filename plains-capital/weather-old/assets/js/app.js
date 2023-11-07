$(document).ready(function () {
  // Config variables
  var url = new ExtendedURL(window.location.href);
  var feed = url.getSearchParam("feed") || "weather", // news, sports, celeb, fin, weather, markets
    style = url.getSearchParam("style") || "default", // classic, block, minimal
    zipcode = url.getSearchParam("zipcode") || getPlayerZipCode(),
    showIntro = parseInt(url.getSearchParam("intro") || 1),
    feedHeader = parseInt(url.getSearchParam("header") || 0),
    showRevealer = parseInt(url.getSearchParam("revealer") || 0),
    showLogo = parseInt(url.getSearchParam("logo") || 0),
    weatherImg = parseInt(url.getSearchParam("weather-img") || 0),
    $clrPrimary =
      url.getSearchParam("primary") || $(":root").css("--clr-primary"),
    $clrSecondary =
      url.getSearchParam("secondary") || $(":root").css("--clr-secondary"),
    $aosDuration = parseInt($(":root").css("--aos-duration")),
    $aosDelay = parseInt($(":root").css("--aos-delay")),
    $articleDuration = parseInt($(":root").css("--article-duration")),
    $articleLimit = parseInt($(":root").css("--article-limit")),
    $bumper = $("#bumper"),
    $revealer = $(".revealer");

  // Local variables
  var localBasePath = "c:/data";
  var videoSource = "/video/bumper.webm";

  // Server variables
  var serverBasePath = "https://retail.adrenalineamp.com";
  var serverFeeds = {
    news: "/rss/Xnews/news/1920/",
    celeb: "/rss/Xnews/celeb/1920/",
    sports: "/rss/Xnews/sports/1920/",
    fin: "/rss/Hnews/fin/1920/",
    markets: "/rss/markets/markets.xml",
    weather: serverBasePath + "/navori/weather-json/",
    // weather: "https://kitchen.screenfeed.com/weather/v2/data/40778ps5v9ke2m2nf22wpqk0sj.json?current=true&interval=Daily&forecasts=5&location="
  };

  const urlParams = new URLSearchParams(window.location.search);
  let devCode = urlParams.get("zipcode");
  //   let zipCode = null,
  dataURI =
    "https://kitchen.screenfeed.com/weather/v2/data/40778ps5v9ke2m2nf22wpqk0sj.json?current=true&interval=Daily&forecasts=5&location=";

  function getQueryParams() {
    if (showIntro === 0) {
      $bumper.parent().remove();
    }
    if (showRevealer === 0) {
      $revealer.remove();
      console.log("revealer: 0");
    }
    if (feedHeader === 0) {
      $("#header").remove();
      console.log("header: " + feedHeader);
    }
    if (showLogo === 0) {
      $("#logo").remove();
      console.log("logo: " + showLogo);
    }
    if (style !== null) {
      $("#story-container").addClass(style);
      console.log("style: " + style);
    }
    if ($clrPrimary !== null) {
      $(".overlay-primary").css("background", $clrPrimary);
      console.log("primary:" + $clrPrimary);
    }
    if ($clrSecondary !== null) {
      $("#story-container.classic").css("border-color", $clrSecondary);
      $(".overlay-secondary").css("background", $clrSecondary);
      console.log("secondary:" + $clrSecondary);
    }
    if (weatherImg === 1) {
      $("#bg-video").remove();
      $("#wrapper").remove();
      console.log("weather: basic");
    } else {
      $("#static").remove();
      console.log("weather: advanced");
    }
  }

  function dayPartGreeting() {
    var hours = new Date().getHours();
    var greeting;
    if (hours >= 0 && hours < 12) {
      greeting = "Good morning,";
    } else if (hours >= 12 && hours < 17) {
      greeting = "Good afternoon,";
    } else if (hours >= 17 && hours < 24) {
      greeting = "Good evening,";
    }
    return greeting;
  }

  function getDate() {
    var todaysDate = moment().format("dddd MMMM D, YYYY");
    $("#date").html(todaysDate);
  }

  function getTime() {
    var currentTime = moment().format("h:mm A");
    var timeRefresh = 1000;
    $("#time").html(currentTime);
    setInterval(function () {
      getTime();
    }, timeRefresh);
  }

  function getMarketData(basePath) {
    // var dfd = $.Deferred();
    return $.when(
      xmlRequest(basePath).done(function (response) {
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
            clone
              .find("#stockName")
              .text(
                $quote
                  .find("company_name")
                  .text()
                  .replace("Composite", "")
                  .trim()
              );
            clone.find("#lastPrice").text($quote.find("last").text());
            clone.find("#changeValueNum").text($quote.find("change").text());
            clone
              .find("#percentchangeValue")
              .text($quote.find("change_percent").text());
            container.append(clone);
          }, ($aosDuration / 2) * (index + 1));
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
      if (total - current < $aosDuration) {
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
    getMarketData(localBasePath + "/fin/markets.xml")
      .done(function () {
        console.log("local market data found");
        // $bumper.attr("src", localBasePath + "../assets" + videoSource);
      })
      .catch(function () {
        console.log("server market data found");
        // $bumper.attr("src", serverBasePath + serverAssetPath + feed + videoSource);
        getMarketData(serverBasePath + serverFeeds["markets"]);
      });
  }

  function setWeather(weather) {
    // var forecast = mapWeatherData(weather);
    // var url = new URL(weather.data.iconLink[0]);
    // var videoName = getVideo(url.searchParams.get('i') || url.pathname.split("/").pop());
    var location = weather.Locations[0] || {};
    var curweather = location.WeatherItems[0] || {};
    var forecast = location.WeatherItems.slice(2, 6) || {};
    var iconPath = serverBasePath + "/navori/assets/weather/icons/flat/";
    // console.log(iconPath);
    // var bgVideo = $("#bg-video video");
    // bgVideo.attr({
    //     src: serverBasePath + "/navori/assets/weather/video/" + videoName,
    //     type: "video/mp4"
    // });
    // $("#weather-bg").append(bgVideo);
    // console.log(videoName);
    // console.log(forecast);
    $("#forecast .day").each(function (i, el) {
      // var iconURL = "/icons/" + forecast[i].Icon.split('.').slice(0, -1).join('.') + ".svg"; // local
      var iconURL =
        iconPath + forecast[i].Icon.split(".").slice(0, -1).join(".") + ".svg";
      var $el = $(el);
      $el.find(".icon").attr("src", iconURL);
      $el
        .find(".forecast-day")
        .text(moment(forecast[i].DateTime).format("dddd"));
      $el.find(".forecast-temp").text(forecast[i].HighTempF + "°");
    });
    $("#current-location").html(location.City);
    $("#current-condition").html(curweather.Description);
    $("#current-temp").html(curweather.CurrentTempF + "°");
    // $("#current-icon").attr("src", "/icons/" + curweather.Icon.split('.').slice(0, -1).join('.') + ".svg");
    $("#current-icon").attr(
      "src",
      iconPath + curweather.Icon.split(".").slice(0, -1).join(".") + ".svg"
    );
    $("#current-high").html("HIGH " + curweather.HighTempF + "°");
    $("#current-low").html("LOW " + curweather.LowTempF + "°");
    $("#current-pop").html("RAIN " + curweather.ChanceOfPrecip + "%");
    $("#current-wind").html("WIND " + curweather.WindSpeedMph + " mph");
    $("#current-humidity").html("HUMIDITY " + curweather.Humidity + "%");
    $("#salutation").text(dayPartGreeting());
  }

  function weatherVideoUpdate(response) {
    function handler(event) {
      const eventItem = event.target;
      const current = Math.round(eventItem.currentTime * 1000);
      const total = Math.round(eventItem.duration * 1000);
      // console.log(current, total)
      if (total - current < $aosDuration) {
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
    var local = localBasePath + "/weather/";
    var server = serverFeeds["weather"];
    // var server = serverBasePath + "/navori/weather-json/"; // Retail server
    var imageURL = serverBasePath + "/rss/weather/1920/" + zipcode + ".jpg";
    getWeather(local, "weather.json").done(function (response) {
      if (response.status !== 400) {
        console.log("Fetching local data..");
        console.log(response);
        $(".photo").css(
          "background-image",
          "url(" + localBasePath + "/weather/weather.jpg"
        );
        $bumper.attr("src", "./assets" + videoSource);
        $aosInit.removeClass("aos-animate");
        weatherVideoEventListeners(response, local);
      } else {
        return getWeather(server, zipcode + ".json").done(function (response) {
          console.log("Local data not found. Fetching server data..");
          console.log("source: " + server + zipcode + ".json");
          $(".photo").css("background-image", "url('" + imageURL + "')");
          // $bumper.attr("src", serverBasePath + "/navori/assets/" + feed + videoSource);
          $bumper.attr("src", "./assets" + videoSource);
          $aosInit.removeClass("aos-animate");
          weatherVideoEventListeners(response, server);
        });
      }
    });
  }

  function animateArticles(response) {
    var $photo = $(".photo");
    var $story = $("#story");
    var $article = $("#article");
    $article.empty();
    $.each(response, function (i, article) {
      var storyClone = $story.clone();
      storyClone
        .show()
        .attr("id", "story" + i)
        .removeClass("aos-animate");
      var $storyText = storyClone.find(".story");
      $storyText.html(article.story);
      storyClone
        .find(".photo")
        .css("background-image", "url(" + article.image.src + ")");
      storyClone
        .find(".bg-blur")
        .css("background-image", "url(" + article.image.src + ")");
      setTimeout(function () {
        $revealer
          .addClass("revealer--animate")
          .delay($aosDuration * 2)
          .queue(function (next) {
            $(this).removeClass("revealer--animate");
            next();
          });
        $article.append(storyClone);
        storyClone.addClass("aos-animate");
        // console.log("Story #" + (i + 1) + ", Elapsed time: " + ($articleDuration * i) / 1000 + " seconds");
        // setTimeout(function () {
        //     $('#story-container').removeClass("aos-animate");
        // }, $articleDuration);
      }, $articleDuration * i);
      setTimeout(function () {
        storyClone.remove().removeClass("aos-animate");
      }, $articleDuration * (i + 1) + ($aosDuration + $aosDelay));
    });
  }

  function articlesVideoUpdate(response) {
    function handler(event) {
      const eventItem = event.target;
      const current = Math.round(eventItem.currentTime * 1000);
      const total = Math.round(eventItem.duration * 1000);
      // console.log(current, total)
      if (total - current < $aosDuration) {
        eventItem.removeEventListener("timeupdate", handler);
        // Show articles
        animateArticles(response.articles);
        // Remove intro video
        $bumper.parent().fadeOut($aosDuration, function () {
          $bumper.parent().remove();
          // $bumper.parent().removeClass("aos-animate");
        });
      }
    }
    return handler;
  }

  function articleVideoEventListeners(response, path) {
    $("#feed").find("*").removeClass("aos-animate");
    $("#slider").find("*").addClass("aos-animate");
    if (showIntro === 0) {
      animateArticles(response.articles, path);
      return;
    }
    var handler = articlesVideoUpdate(response, path);
    $bumper[0].addEventListener("timeupdate", handler);
  }

  function loadFeeds() {
    var local = localBasePath + "/" + feed + "/";
    var server = serverBasePath + serverFeeds[feed];
    getArticles(local, getIndexes($articleLimit)).done(function (response) {
      if (response.articles) {
        // console.log("Loading local data..");
        console.log("source: " + local, "\n", response.articles);
        // console.log(response.articles)
        getWeather(localBasePath + "/weather/", "weather.json").done(function (
          response
        ) {
          setWeather(response);
        });
        $bumper.attr("src", "./assets/" + videoSource);
        articleVideoEventListeners(response, local);
      } else {
        return getArticles(server, getIndexes($articleLimit)).done(function (
          response
        ) {
          // console.log("Local data not found. Fetching server data..");
          console.log("source: " + server, "\n", response.articles);
          // console.log(response.articles);
          getWeather(serverFeeds["weather"], zipcode + ".json").done(function (
            response
          ) {
            setWeather(response);
          });
          $bumper.attr(
            "src",
            serverBasePath + "/navori/assets/" + feed + videoSource
          );
          articleVideoEventListeners(response, server);
        });
      }
    });
  }

  function getPlayerZipCode() {
    // window.parent.PlayerSDK = {
    //   getTagsPlayer: function () {
    //     return [
    //       { Id: 0, Name: "ZIP-98225" },
    //       //   { Id: 1, Name: "ZIP-10001" },
    //       // { Id: 2, Name: "ZIP-84106" },
    //     ];
    //   },
    // };
    var intervalId = setInterval(function () {
      if (window.parent.PlayerSDK) {
        clearInterval(intervalId);

        var tags = window.parent.PlayerSDK.getTagsPlayer();
        var tag = tags.find(
          (tag) => tag.Name && tag.Name.toLowerCase().startsWith("zip-")
        );
        var code = tag && tag.Name && tag.Name.match(/\d{5}/);
        zipcode = devCode || code;
        // console.log(zipcode);
        return zipcode;
      } else {
        clearInterval(intervalId);
      }
    }, 100);
  }

  function init() {
    AOS.init({
      // Global settings:
      disableMutationObserver: false, // disables automatic mutations' detections (advanced)
      // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
      offset: 0, // offset (in px) from the original trigger point
      delay: $aosDelay, // values from 0 to 3000, with step 50ms
      duration: $aosDuration, // values from 0 to 3000, with step 50ms
      easing: "ease-in-out", // default easing for AOS animations
      once: false, // whether animation should happen only once - while scrolling down
      mirror: false, // whether elements should animate out while scrolling past them
      anchorPlacement: "top-bottom", // defines which position of the element regarding to window should trigger the animation
    });
    $aosInit = $(".aos-init");
    console.log("aos-duration: " + $aosDuration);
    console.log("aos-delay: " + $aosDelay);
    getQueryParams();
    if (feed === "weather") {
      $("#feed").remove();
      $("#markets").remove();
      loadWeather();
    }
    if (feed === "markets") {
      $("#feed").remove();
      $("#weather").remove();
      loadMarkets();
    }
    if (feed === "fin") {
      $("#story-container").remove();
      $("#feedHeader").remove();
      $(".photo").removeClass("ken-burns");
    }
    if (feed !== "markets" && feed !== "weather") {
      $("#markets").remove();
      $("#weather").remove();
      loadFeeds();
    }
    getDate();
    getTime();
  }

  // function preload() {
  //     // $("#preloader").show();
  //     $(window).on('load', function () {
  //         $("#preloader").remove();
  //         console.log("content loaded!")
  //         if (window.localStorage) {
  //             window.localStorage.clear();
  //         }
  //     });
  // }

  // preload();
  init();
});
