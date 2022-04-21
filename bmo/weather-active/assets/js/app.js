(function () {
  const url = new ExtendedURL(window.location.href),
    zipcode = url.getSearchParam("location") || "60606";

  var $content = $(".content"),
    $bumper = $("#bumper"),
    // portal = 'c://data//weather//',
    portal = "https://retail.adrenalineamp.com/rss/weather/1920/",
    weatherData = zipcode + ".jpg";

  function ExtendedURL(href) {
    this.url = new URL(href);
    this.getSearchParam = function (param) {
      return this.url.searchParams.get(param);
    };
    return this;
  }

  function dayPartGreeting() {
    var hours = new Date().getHours();
    var greeting;
    var morning = "Good Morning,";
    var afternoon = "Good Afternoon,";
    var evening = "Good Evening,";

    if (hours >= 0 && hours < 12) {
      greeting = morning;
    } else if (hours >= 12 && hours < 17) {
      greeting = afternoon;
    } else if (hours >= 17 && hours < 24) {
      greeting = evening;
    }

    $(".salutation").text(greeting);
  }

  function setContent(article) {
    var video = document.getElementById("bumper");
    if (video.readyState > 0) {
      // it's loaded
      console.log("Video loaded");
      $(".revealer").removeClass("revealer--animate");
    } else {
      // it's not loaded
      console.log("Video not loaded");
      $(".revealer").addClass("revealer--animate");
    }
    $(".blur-img").css({ background: "url('" + portal + weatherData + "')" });
    $(".src-img").css({ content: "url('" + portal + weatherData + "')" });
  }

  function videoTimeUpdate(event) {
    var eventItem = event.target;
    var current = Math.round(eventItem.currentTime * 1000);
    var total = Math.round(eventItem.duration * 1000);

    if (total - current < 500) {
      $(".revealer").addClass("revealer--animate");
      eventItem.removeEventListener("timeupdate", videoTimeUpdate);
      $($bumper).fadeOut(500, function () {
        $($bumper).remove();
      });
    }
  }

  function init() {
    // Setup
    setContent();
    $bumper[0].addEventListener("timeupdate", videoTimeUpdate);
  }

  init();
})();
