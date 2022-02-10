$(function () {
  const url = new ExtendedURL(window.location.href),
    zipcode = url.getSearchParam("zipcode") || "60606",
    dataURI = {
      local: "c:\\data\\weather\\weather.json",
      server:
        "https://kitchen.screenfeed.com/weather/v2/data/40778ps5v9ke2m2nf22wpqk0sj.json?current=true&interval=Daily&forecasts=5&location=" +
        zipcode,
    },
    $animeSpeed = parseInt($(":root").css("--anime-speed")),
    $animeDelay = parseInt($(":root").css("--anime-delay")),
    $revealerSpeed = parseInt($(":root").css("--revealer-speed"));

  function revealer(speed) {
    const $transition = $(".revealer"),
      mode = [
        "revealer--left",
        "revealer--right",
        "revealer--top",
        "revealer--bottom",
      ],
      shuffle = mode[(Math.random() * mode.length) | 0];
    $transition
      .addClass("revealer--animate")
      .addClass(shuffle)
      .delay(speed * 1.5)
      .queue(function () {
        $(this).removeClass("revealer--animate").removeClass(shuffle).dequeue();
      });
  }

  function handleWeather(data) {
    let location = data.Locations[0] || {};
    let current = location.WeatherItems[0] || {};
    let forecast = location.WeatherItems.slice(1, 6) || {};
    let videoEnabled = url.getSearchParam("video") || 0;

    const cloneDayOfWeek = (el, num) => {
      var $elem = $(el);
      for (var i = 1; i <= num; i++) {
        var clone = $elem.clone();
        clone.attr("id", "day" + (num - i + 1));
        $(".forecast").append(clone);
      }
      $elem.remove();
    };

    const setForecast = () => {
      $(".day").each(function (i, el) {
        var $el = $(el);
        $el
          .find(".icon")
          .attr("src", "./img/icons/" + getIcon(forecast[i].ConditionCode));
        $el.find(".dayofweek").text(moment(forecast[i].DateTime).format("ddd"));
        $el.find(".description").text(forecast[i].ShortDescription);
        $el.find(".htemp").text(forecast[i].HighTempF + "°");
        $el.find(".ltemp").text(forecast[i].LowTempF + "°");
        $el
          .find("video")
          .attr(
            "poster",
            "./img/" + loadMedia(forecast[i].ConditionCode) + ".jpg"
          );
        if (videoEnabled) {
          $el
            .find("video")
            .attr(
              "src",
              "./video/" + loadMedia(forecast[i].ConditionCode) + ".mp4"
            );
        }
      });
    };

    const setCurrent = () => {
      $(".date").text(moment().format("dddd, MMMM Do"));
      $(".day:first-child .dayofweek").replaceWith(
        '<span class="dayofweek">Today</span>'
      );
      $(".location").text(location.City);
      $(".temperature").text(current.CurrentTempF + "°");
      $(".description").text(current.Description);
      $(".wind").text("Wind: " + Number(current.WindSpeedMph) + "mph");
      $(".humidity").text("Humidity: " + Number(current.Humidity) + "%");
      $(".header .icon").attr({
        src: "./img/icons/" + getIcon(forecast[0].ConditionCode),
      });
    };

    const mainBgVideo = () => {
      $(".background video").attr(
        "poster",
        "./img/" + loadMedia(forecast[0].ConditionCode) + ".jpg"
      );
      if (videoEnabled)
        $(".primary.background video").attr(
          "src",
          "./video/" + loadMedia(forecast[0].ConditionCode) + ".mp4"
        );
    };

    cloneDayOfWeek("#template", forecast.length);
    dayPartGreeting(".greeting");
    mainBgVideo();
    setForecast();
    setCurrent();
  }

  function animateWeather() {
    const header = document.querySelectorAll(".header, .header .wrap *"),
      forecast = document.querySelectorAll(".forecast .day *");

    let animation = anime
      .timeline({
        autoplay: true,
        loop: false,
        easing: "cubicBezier(0.645, 0.045, 0.355, 1.000)",
        duration: $animeSpeed,
      })
      .add({
        // targets: ".container",
        delay: $revealerSpeed / 2,
        opacity: [0, 1],
        begin: () => {
          revealer($revealerSpeed);
          animateContent();
        },
      })
      .add({
        targets: header,
        delay: anime.stagger(100),
        translateY: [-100, 0],
        opacity: [0, 1],
      })
      .add({
        targets: forecast,
        delay: anime.stagger(100),
        translateY: [-200, 0],
        rotateX: [90, 0],
        opacity: [0, 1],
      });
  }

  function animateContent() {
    let animation = anime
      .timeline({
        autoplay: true,
        loop: false,
        duration: $animeSpeed * 1.5,
        easing: "easeInOutQuad",
      })
      .add({
        targets: ".stage",
        opacity: [0, 1],
        duration: $animeSpeed,
        begin: () => revealer("revealer--bottom"),
      })
      .add({
        targets: ".standard .footer-container, .anamorphic .footer-container",
        opacity: [0, 1],
        translateY: [20, 0],
      })
      .add({
        targets: ".roundel .circle-container",
        scale: [0.5, 1],
        opacity: [0, 1],
      })
      .add({
        targets: ".roundel .circle-white",
        scale: [0, 2],
        opacity: [1, 0],
      })
      .add({
        targets: ".roundel .circle-inner",
        scale: [0, 1],
        opacity: [0, 1],
      })
      .add({
        targets: ".roundel .text",
        opacity: [0, 1],
        translateX: [100, 0],
        delay: anime.stagger(200),
      });
  }

  function onTemplateError(result) {
    console.warn("could not get data");
  }

  function onTemplateSuccess(result) {
    const config = $("body").addClass(screen.config),
      brandLogo = $(".brand-logo").attr({
        src: "./img/BMOHB_T2_White_Tagline.svg",
      });

    handleWeather(result);
    animateWeather();
  }

  function getData(onSuccess, onError, data) {
    return $.ajax({
      method: "GET",
      url: data,
      dataType: "json",
      success: function (result) {
        console.log(result);
        onSuccess(result);
      },
      error: function (result) {
        // console.error(result);
        onError(result);
      },
    });
  }

  function getPlayerTagId(onSuccess, onError) {
    var tag = window.parent.PlayerSDK.getTagByPrefix("Z.MPS.PNC.");

    return $.ajax({
      method: "GET",
      url:
        "https://photos-dev.adrenalineamp.com/public-api/mps/" +
        tag.Name +
        "/staff?a=e85711db-6395-4811-94c4-93ec1e83f4b3",
      dataType: "json",
      success: function (result) {
        console.log(result);
        onSuccess(result);
      },
      error: function (result) {
        console.error(result);
        onError(result);
      },
    });
  }

  function init() {
    getOS();
    // getData(onTemplateSuccess, onTemplateError, dataURI.local); // get local data, located at c:\data
    getData(onTemplateSuccess, onTemplateError, dataURI.server); // get server data, via screenfeed.com
  }

  init();
});
