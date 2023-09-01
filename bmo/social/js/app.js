$(function () {
  const revealerSpeed = parseInt($(":root").css("--revealer-speed")),
    userName = "BMO",
    userIcon = "./img/bmo-logo.svg",
    animeDuration = 1500,
    timerDuration = 10000,
    twitterId = 24,
    instagramId = 25,
    facebookId = 26;

  const dataURI = {
    local: "c:\\data\\social\\social.json",
    bmo_US:
      "https://kitchen.screenfeed.com/social/data/6w24z789gena94j8yt3728zgzw.json",
    bmo_CA:
      "http://kitchen.screenfeed.com/social/data/4qsr8pzd9vpp64n6cx26kazya3.json",
  };

  let feeds = [],
    current = 0,
    limit = 3;

  function revealer() {
    const revealerEnabled = false;
    if (revealerEnabled) {
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
        .addClass(mode[1])
        .delay(revealerSpeed)
        .queue(function () {
          $(this)
            .removeClass("revealer--animate")
            .removeClass(mode[1])
            .dequeue();
        });
    }
  }

  function animateItem(index) {
    let article = document.getElementById(index),
      content = article.querySelectorAll(".message"),
      animation = anime
        .timeline({
          easing: "cubicBezier(0.645, 0.045, 0.355, 1.000)",
          easing: "easeInOutElastic(1, .6)",
          duration: animeDuration,
          autoplay: true,
          loop: false,
        })
        // .add({ begin: () => revealer() })
        .add({
          targets: article,
          opacity: [0, 1],
          translateX: ["100%", "0%"],
          endDelay: timerDuration - animeDuration,
        })
        .add({
          targets: article,
          translateX: ["0%", "-100%"],
          // delay: animeDuration,
          opacity: [0],
          // endDelay: timerDuration - animeDuration,
        });

    // console.log(article)
  }

  function setContent($template, data, index) {
    const $container = $("main");
    const $clone = $template.clone();

    if (
      data.User.ProfileImageUrlSmall == null &&
      data.User.ProfileImageUrl == ""
    ) {
      $clone.find(".usericon img").attr("src", userIcon);
    } else {
      $clone.find(".usericon img").attr("src", data.User.ProfileImageUrl);
    }

    $clone
      .attr({ id: index, contentid: data.ContentId })
      .css("z-index", feeds.length - index)
      .css("opacity", 0);
    $clone.find(".socialicon img").attr("src", data.ProviderIcon);
    $clone.find(".username").text(data.User.Name);
    $clone.find(".useraccount").text(data.User.Username);
    $clone.find(".message").text(data.Content);
    $clone.find(".published").text(data.DisplayTime);
    $clone.find(".media video, .media img").attr("src", data.Images[0].Url);
    $container.append($clone);
    $template.remove();

    resizeText({ elements: $clone[0].querySelectorAll(".message") });
    isolateTag({ element: $clone[0].querySelectorAll(".message") });
  }

  function onTemplateError(result) {
    console.warn("could not get data");
  }

  function onTemplateSuccess(result) {
    const $template = $("article");

    // adds each json object to feeds array
    $.each(result.Items, function (i) {
      feeds.push(result.Items[i]);
    });

    // remove posts without images
    feeds = feeds.filter((obj) => obj.Images.length != 0);
    // sort array by date
    feeds = feeds.sort((a, b) => {
      if (a.CreatedDate > b.CreatedDate) {
        return -1;
      }
    });
    // filter out results based on social provider (ie: instagramId, facebookId, twitterId)
    feeds = feeds.filter((obj) => obj.Provider == instagramId);
    feeds = feeds.splice(0, limit);
    $.each(feeds, (i) => {
      setContent($template, feeds[i], i);
    });


    animateItem(current);
    current++;
    let intervalId = setInterval(function () {
      if ((current + 1) != limit) {
        console.log(current,limit)
        animateItem(current);
        current = (current + 1) % feeds.length;
      } else {
        // current = 0;
        clearInterval(intervalId);
        return;
      }
    }, timerDuration);
  }

  function getData(onSuccess, onError, data) {
    //attempt to get data from localStorage
    if (localStorage.getItem(data)) {
      var expiry = JSON.parse(localStorage.getItem(data + "expiry"));

      if (new Date().getTime() <= expiry) {
        var result = JSON.parse(localStorage.getItem(data));
        onSuccess(result);
        // console.log("localStorage:", result);
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
        // console.log("saved to localStorage", result);
      },
      error: function (result) {
        onError(result);
      },
    });
  }

  function init() {
    getData(onTemplateSuccess, onTemplateError, dataURI.bmo_US);
    // getData(onTemplateSuccess, onTemplateError, dataURI.bmo_CA);
  }

  // localStorage.clear();
  init();
});
