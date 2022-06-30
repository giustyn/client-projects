$(function () {
  const url = new ExtendedURL(window.location.href),
    $date = $(".date").text(moment().format("dddd, MMMM Do")),
    $revealerSpeed = parseInt($(":root").css("--revealer-speed")),
    revealerEnabled = 1,
    zipcode = url.getSearchParam("zipcode") || "60606",
    videoEnabled = url.getSearchParam("video") || 0,
    dataURI = {
      local: "c:\\data\\weather\\weather.json",
      server:
        "https://kitchen.screenfeed.com/weather/v2/data/40778ps5v9ke2m2nf22wpqk0sj.json?current=true&interval=Daily&forecasts=5&location=" +
        zipcode,
    };

  function revealer() {
    if (!revealerEnabled) return;
    const $transition = $(".revealer"),
      mode = [
        "revealer--left",
        "revealer--right",
        "revealer--top",
        "revealer--bottom",
      ].shuffle();
    $transition
      .addClass("revealer--animate")
      .addClass(mode[1])
      .delay($revealerSpeed * 2)
      .queue(function () {
        $(this).removeClass("revealer--animate").removeClass(mode[1]).dequeue();
      });
  }

  function handleWeather(data) {
    let location = data.Locations[0] || {};
    let current = location.WeatherItems[0] || {};
    let forecast = location.WeatherItems.slice(1, 6) || {};

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
    mainBgVideo();
    setForecast();
    setCurrent();
  }

  function animateWeather() {
    let container = document.querySelectorAll(".container")[0],
      animeSpeed = $revealerSpeed / 2,
      animeDelay = 50;
    let animation = anime
      .timeline({
        autoplay: true,
        loop: false,
        easing: "cubicBezier(0.645, 0.045, 0.355, 1.000)",
        duration: animeSpeed,
      })
      .add({
        targets: container,
        delay: animeSpeed,
        opacity: [0, 1],
        begin: () => revealer(),
      })
      .add({
        targets: container.querySelectorAll(".header, .header .wrap *"),
        delay: anime.stagger(animeDelay),
        translateY: ["-100%", "0%"],
        opacity: [0, 1],
      })
      .add(
        {
          targets: container.querySelectorAll(".forecast .day"),
          delay: anime.stagger(animeDelay),
          // translateX: ["-100%", "0%"],
          scaleX: ["0%", "100%"],
          opacity: [0, 1],
        },
        "-=" + 0
      )
      .add(
        {
          targets: container.querySelectorAll(
            ".dayofweek, .icon, .htemp, .ltemp"
          ),
          delay: anime.stagger(animeDelay),
          translateY: ["50%", "0%"],
          scale: ["50%", "100%"],
          opacity: [0, 1],
        },
        "-=" + animeSpeed
      );
  }

  function onTemplateError(result) {
    console.warn("could not get data");
  }

  function onTemplateSuccess(result) {
    handleWeather(result);
    animateWeather();
  }

  function getData(onSuccess, onError, data) {
    return $.ajax({
      method: "GET",
      url: data,
      dataType: "json",
      success: function (result) {
        console.log(result, data);
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
