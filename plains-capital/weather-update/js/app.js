$(function () {
  const url = new ExtendedURL(window.location.href),
    // $date = $(".date").text(moment().format("dddd, MMMM Do")),
    $revealerSpeed = parseInt($(":root").css("--revealer-speed")),
    zipcode = url.getSearchParam("zipcode"),
    dataURI = {
      weather_local: "c:\\data\\weather\\weather.json",
      news_local: "c:\\data\\news\\news.json",
      news_api:
        "https://kitchen.screenfeed.com/feed/7s51fskbkrzabmbzhqdtdydjj1.json",
      weather_api:
        "https://kitchen.screenfeed.com/weather/v2/data/40778ps5v9ke2m2nf22wpqk0sj.json?current=true&interval=Daily&forecasts=5&location=" +
        zipcode,
    };
  let videoEnabled = url.getSearchParam("video") || 1,
    $bumper = $("#bumper");

  function getDate() {
    var todaysDate = moment().format("dddd MMMM D, YYYY");
    $(".date").html(todaysDate);
  }

  function getTime() {
    var currentTime = moment().format("h:mm A");
    var timeRefresh = 1000;
    $(".time").html(currentTime);
    setInterval(function () {
      getTime();
    }, timeRefresh);
    clearInterval();
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
    let forecast = location.WeatherItems.slice(2, 6) || {};

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
      $("main .background video").attr({
        poster: "./img/" + loadMedia(current.ConditionCode) + ".jpg",
        src: "./video/" + loadMedia(current.ConditionCode) + ".mp4",
      });
      $(".salutation").text(dayPartGreeting());
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
        src: "./img/icons/" + getIcon(current.ConditionCode),
      });
    };

    getDate();
    getTime();

    setCurrent();
    setForecast();
  }

  function animate() {
    let container = $(".container"),
      animeSpeed = $revealerSpeed / 2,
      animeDelay = 25;
    let animation = anime
      .timeline({
        autoplay: true,
        loop: false,
        easing: "cubicBezier(0.645, 0.045, 0.355, 1.000)",
        duration: animeSpeed,
      })
      .add({
        targets: container[0],
        // delay: 500,
        opacity: [0, 1],
        // begin: () => revealer(),
      })
      .add({
        targets: container[0].querySelectorAll("#weather *, #forecast *"),
        delay: anime.stagger(animeDelay),
        translateY: ["10%", "0%"],
        opacity: [0, 1],
      });
  }

  function getStories(a, b) {
    getData(a, onTemplateError, dataURI.news_api);
  }

  function onTemplateError(result) {
    let img = "./img/bmo-logo.svg";
    $(".container").remove();
    // $("#bmo-logo").attr({ src: img }).css({ opacity: 1 });
    $("#error").css({ visibility: "visible" });
    console.warn("could not load data");
  }

  function onTemplateSuccess(result) {
    getStories(newsHandler);
    weatherHandler(result);
    animate();
  }

  function getData(onSuccess, onError, data) {
    return $.ajax({
      method: "GET",
      url: data,
      dataType: "json",
      success: function (result) {
        // console.log(result, data);
        onSuccess(result);
      },
      error: function (result) {
        // console.error(result);
        onError(result);
      },
    });
  }

  function videoEventHandler() {
    function handler(event) {
      const eventItem = event.target;
      const current = Math.round(eventItem.currentTime * 1000);
      const total = Math.round(eventItem.duration * 1000);
      if (total - current < 500) {
        eventItem.removeEventListener("timeupdate", handler);
        init();
        $bumper.parent().fadeOut(500, function () {
          $bumper.remove();
        });
      }
    }
    return handler;
  }

  function videoEventListener() {
    var handler = videoEventHandler();
    $bumper.attr("src", "./video/bumper.mp4");
    $bumper[0].addEventListener("timeupdate", handler);
  }

  function init() {
    // window.parent.PlayerSDK = {
    //   getTagsPlayer: function () {
    //     return [{ Id: 2, Name: "ZIP-10001" }];
    //   },
    // };
    var intervalId = setInterval(function () {
      if (window.parent.PlayerSDK) {
        clearInterval(intervalId);

        try {
          var tags = window.parent.PlayerSDK.getTagsPlayer();
          var tag = tags.find(
            (tag) => tag.Name && tag.Name.toLowerCase().startsWith("zip-")
          );
          var code = tag && tag.Name && tag.Name.match(/\d{5}/);
          var zipcode = code || url.getSearchParam("zipcode");
          var weather_api =
            "https://kitchen.screenfeed.com/weather/v2/data/40778ps5v9ke2m2nf22wpqk0sj.json?current=true&interval=Daily&forecasts=5&location=" +
            zipcode;

          getData(onTemplateSuccess, onTemplateError, weather_api); // get server data, via screenfeed.com
        } catch (error) {
          document.getElementById("error").innerHTML = error;
        }
      } else {
        clearInterval(intervalId);
        onTemplateError();
        // document.getElementById("error").innerHTML = getOS();
      }
    }, 100);
  }

  // init();
  videoEventListener();
});
