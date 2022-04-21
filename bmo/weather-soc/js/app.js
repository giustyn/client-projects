(function () {
  const url = new ExtendedURL(window.location.href),
    zipcode = url.getSearchParam("zipcode") || "60606";

  var $background = $(".background"),
    backgroundImage = "./img/bmoh-bg_Weather.jpg",
    $media = $(".media"),
    dataPath =
      "https://kitchen.screenfeed.com/feed/0bguMIg3y0CKeD2PSb0RHA.json?location=";

  function ExtendedURL(href) {
    this.url = new URL(href);
    this.getSearchParam = function (param) {
      return this.url.searchParams.get(param);
    };
    return this;
  }

  function setContent() {
    let portal = dataPath + zipcode;
    fetch(portal)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        var mediaURL = data.Items[0].Media[0].Url;
        $background.attr("src", backgroundImage);
        $media.attr("src", mediaURL);
      })
      .catch((err) => {
        // Do something for an error here
      });
  }

  function init() {
    setContent();
  }

  init();
})();
