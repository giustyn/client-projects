$(function () {
  const url = new ExtendedURL(window.location.href),
    $date = $(".date").text(moment().format("dddd, MMMM Do")),
    $revealerSpeed = parseInt($(":root").css("--revealer-speed")),
    revealerEnabled = 1,
    videoEnabled = url.getSearchParam("video") || 1,
    dataURI = {
      news_local: "c:\\data\\news\\news.json",
      weather_local: "c:\\data\\weather\\weather.json",
      news_api:
        "https://kitchen.screenfeed.com/feed/7s51fskbkrzabmbzhqdtdydjj1.json",
      weather_api:
        "https://kitchen.screenfeed.com/weather/v2/data/40778ps5v9ke2m2nf22wpqk0sj.json?current=true&interval=Daily&forecasts=5&location=",
    },
    defaultZipCode = 32030;

  function revealer() {
    const $revealerSpeed = parseInt($(":root").css("--revealer-speed")),
      $revealerStyle = $("body").addClass("anim-effect-2"),
      $transition = $(".revealer"),
      mode = [
        "revealer--left",
        "revealer--right",
        "revealer--top",
        "revealer--bottom",
      ],
      shuffle = mode[(Math.random() * mode.length) | 0];
    $transition
      .addClass("revealer--animate")
      .addClass(mode[2])
      .delay($revealerSpeed * 1.5)
      .queue(function () {
        $(this).removeClass("revealer--animate").removeClass(mode[2]).dequeue();
      });
  }

  function newsHandler(data) {
    let stories = [];
    $.each(data.Items, function (i) {
      stories.push(data.Items[i]);
    });
    stories.sort(() => 0.5 - Math.random());
    $.each($("li"), function (i) {
      $(".story" + (i + 1)).text(stories[i].Title);
    });
  }

  function weatherHandler(data) {
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
      cloneDayOfWeek("#template", forecast.length);
      $(".day").each(function (i, el) {
        var $el = $(el);
        $el
          .find(".icon")
          .attr("src", "./img/icons/" + getIcon(forecast[i].ConditionCode));
        $el
          .find(".dayofweek")
          .text(moment(forecast[i].DateTime).format("dddd"));
        $el.find(".description").text(forecast[i].ShortDescription);
        $el.find(".high").text(forecast[i].HighTempF + "°");
        $el.find(".low").text(forecast[i].LowTempF + "°");
      });
    };

    const setCurrent = () => {
      $(".background video").attr({
        poster: "./img/" + loadMedia(forecast[0].ConditionCode) + ".jpg",
        src: "./video/" + loadMedia(forecast[0].ConditionCode) + ".mp4",
      });
      $(".location").text(location.City);
      $(".current .temp").text(current.CurrentTempF + "°");
      $(".current .description").text(current.Description);
      $(".current .high").text("High:  " + current.HighTempF + "°");
      $(".current .low").text("Low: " + current.LowTempF + "°");
      $(".current .feels").text("Feels like: " + current.FeelsLikeF + "°");
      $(".current .wind").text(
        "Wind: " + Number(current.WindSpeedMph) + " mph"
      );
      $(".current .humidity").text(
        "Humidity: " + Number(current.Humidity) + "%"
      );
      $(".current .icon img").attr({
        src: "./img/icons/" + getIcon(forecast[0].ConditionCode),
      });
    };

    setCurrent();
    setForecast();
  }

  function animate() {
    let container = $(".container"),
      animeSpeed = $revealerSpeed / 2,
      animeDelay = 80;

    let animation = anime
      .timeline({
        autoplay: true,
        loop: false,
        easing: "cubicBezier(0.645, 0.045, 0.355, 1.000)",
        delay: animeSpeed,
        duration: animeSpeed,
      })
      .add({
        targets: ".background, .container",
        opacity: [0, 1],
      })
      .add(
        {
          targets: container[0].querySelectorAll("#weather, #weather *"),
          delay: anime.stagger(animeDelay),
          translateY: ["10%", "0%"],
          opacity: [0, 1],
        },
        "-=" + animeSpeed
      )
      .add(
        {
          targets: container[0].querySelectorAll("#news, #news *"),
          delay: anime.stagger(animeDelay),
          // translateY: ["10%", "0%"],
          opacity: [0, 1],
        },
        "-=" + $revealerSpeed
      );
  }

  function getStories(a, b) {
    getData(a, onTemplateError, dataURI.news_api);
  }

  function onTemplateError(result) {
    console.warn("could not get data");
  }

  function onTemplateSuccess(result) {
    getStories(newsHandler);
    weatherHandler(result);
    animate();
  }

  function getData(onSuccess, onError, data) {
    //attempt to get data from localStorage
    if (localStorage.getItem(data)) {
      var expiry = JSON.parse(localStorage.getItem(data + "expiry"));

      if (new Date().getTime() <= expiry) {
        var result = JSON.parse(localStorage.getItem(data));
        onSuccess(result);
        console.log(result);
        return;
      }
    }
    return $.ajax({
      method: "GET",
      url: data,
      dataType: "json",
      success: function (result) {
        localStorage.setItem(data, JSON.stringify(result));
        localStorage.setItem(
          data + "expiry",
          JSON.stringify(new Date().getTime() + 1000 * 60 * 10 /*10 minutes*/)
        );
        onSuccess(result);
        console.log(result);
      },
      error: function (result) {
        onError(result);
      },
    });
  }

  function init() {
    // getOS();

    // setTimeout(() => {
    //   let testZipCode = 90210;
    //   window.parent.PlayerSDK = {
    //     getTagsPlayer: function () {
    //       return [{ Id: 0, Name: "ZIP-" + testZipCode + "" }];
    //     },
    //   };
    // }, 500);

    var intervalId = setInterval(function () {
      if (window.parent.PlayerSDK) {
        clearInterval(intervalId);

        var tags = window.parent.PlayerSDK.getTagsPlayer();
        var tag = tags.find(
          (tag) => tag.Name && tag.Name.toLowerCase().startsWith("zip-")
        );
        var code = tag && tag.Name && tag.Name.match(/\d{5}/);
        var zipcode = code || url.getSearchParam("zipcode") || defaultZipCode;
        var weather_api = dataURI.weather_api + zipcode;

        getData(onTemplateSuccess, onTemplateError, weather_api);
      } else {
        // console.log('fail')
        clearInterval(intervalId);
        localStorage.clear();
        return;
      }
    }, 1000);
  }

  init();
});

// localStorage.clear();
