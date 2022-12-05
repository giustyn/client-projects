$(document).ready(function () {
  // Config variables
  var url = new ExtendedURL(window.location.href);
  var feed = url.getSearchParam("feed") || "weather", // news, sports, celeb, fin, weather, markets
    style = url.getSearchParam("style") || "classic", // classic, block, minimal
    zipcode = url.getSearchParam("zipcode") || "63017",
    showIntro = parseInt(url.getSearchParam("intro") || 1),
    feedHeader = parseInt(url.getSearchParam("header") || 1),
    showRevealer = parseInt(url.getSearchParam("revealer") || 1),
    showLogo = parseInt(url.getSearchParam("logo") || 1),
    weatherImg = parseInt(url.getSearchParam("weather-img") || 0),
    $clrPrimary =
      url.getSearchParam("primary") || $(":root").css("--clr-primary"),
    $clrSecondary =
      url.getSearchParam("secondary") || $(":root").css("--clr-secondary"),
    $aosDuration = parseInt($(":root").css("--aos-duration")),
    $aosDelay = parseInt($(":root").css("--aos-delay")),
    $bumper = $("#bumper"),
    $revealer = $(".revealer");

  // Local variables
  var introVideo = "/video/bumper.webm";
  var localBasePath = "c:/data";
  var localFeeds = {
    weather: localBasePath + "/weather/",
  };

  // Server variables
  var serverBasePath = "https://retail.adrenalineamp.com";
  var serverFeeds = {
    assets: serverBasePath + "/navori/assets/",
    weatherimg: serverBasePath + "/rss/weather/1920/",
    weather: serverBasePath + "/navori/weather-json/",
    // weather: "https://kitchen.screenfeed.com/weather/v2/data/40778ps5v9ke2m2nf22wpqk0sj.json?current=true&interval=Daily&forecasts=5&location="
  };

  function getQueryParams() {
    if (showIntro === 0) {
      $bumper.parent().remove();
    }
    if (showRevealer === 0) {
      $revealer.remove();
      console.log("revealer: " + showRevealer);
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
    $("#date").html(moment().format("DD"));
    $("#month").html(moment().format("MMMM"));
  }

  function getTime() {
    var currentTime = moment().format("h:mm");
    var currentmeridiem = moment().format("A");
    var timeRefresh = 60000;
    $("#time").html(currentTime);
    $("#meridiem").html(currentmeridiem);
    setInterval(function () {
      getTime();
    }, timeRefresh);
  }

  function setWeather(weather) {
    var location = weather.Locations[0] || {};
    var current = location.WeatherItems[0] || {};
    var forecast = location.WeatherItems.slice(1, 6) || {};
    // var iconServerPath = serverFeeds['assets'] + "/weather/icons/flat/";
    var iconPath = "assets/img/icons/";

    // $("#current-bg-video").attr({
    //     src: serverFeeds['assets'] + "/weather/video/" + getVideo(current.ConditionCode),
    //     type: "video/mp4"
    // });
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
    // var unsplashURL = "https://source.unsplash.com/1920x1080/?weather";
    // $(".bg-img").css("background-image", "url(" + unsplashURL + ")");

    $("#current-location").text(location.City);
    $("#current-temp").text(current.HighTempF + "°");
    $("#current-condition").text(current.Description);
    $("#current-icon").attr("src", iconPath + getIcon(current.ConditionCode));
    $("#forecast .day").each(function (i, el) {
      var $el = $(el);
      $el
        .find(".icon")
        .attr("src", iconPath + getIcon(forecast[i].ConditionCode));
      $el
        .find(".forecast-day")
        .text(moment(forecast[i].DateTime).format("dddd"));
      $el.find(".description").text(forecast[i].ShortDescription);
      $el.find(".forecast-temp").text(forecast[i].HighTempF + "°");
    });
    $("#today").text("Today");
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
    var location = zipcode + ".json";
    var local = localFeeds["weather"];
    var server = serverFeeds["weather"];
    var imageURL = serverFeeds["weatherimg"] + zipcode + ".jpg";
    getWeather(local, "weather.json").done(function (response) {
      if (response.status !== 400) {
        console.log("Fetching local data..");
        console.log(response.Locations[0]);
        $(".photo").css("background-image", "url(" + local + "weather.jpg");
        $bumper.attr("src", "./assets" + introVideo);
        $aosInit.removeClass("aos-animate");
        weatherVideoEventListeners(response, local);
      } else {
        $("#forecast").css({ opacity: 0 });
        return;
        // return getWeather(server, location)
        //     .done(function (response) {
        //         console.log("Local data not found. Fetching server data..");
        //         console.log("source: " + server + location);
        //         $(".photo").css("background-image", "url('" + imageURL + "')");
        //         $bumper.attr("src", serverFeeds['assets'] + feed + introVideo);
        //         $aosInit.removeClass("aos-animate");
        //         weatherVideoEventListeners(response, server);
        //     });
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
      easing: "ease-out", // default easing for AOS animations
      once: false, // whether animation should happen only once - while scrolling down
      mirror: false, // whether elements should animate out while scrolling past them
      anchorPlacement: "top-bottom", // defines which position of the element regarding to window should trigger the animation
    });
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
