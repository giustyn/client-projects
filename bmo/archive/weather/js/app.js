$(function () {
  const url = new ExtendedURL(window.location.href),
    zipCode = url.getSearchParam("zipcode") || "60606",
    $date = $(".date").text(moment().format("dddd, MMMM Do")),
    revealerEnabled = parseInt(url.getSearchParam("reveal")) || 1,
    $revealerSpeed = parseInt($(":root").css("--revealear-speed")) || 1800,
    $animeDuration = $revealerSpeed / 2,
    timerDuration = 10000,
    screenLayout = ["standard", "videowall"][
      parseInt(url.getSearchParam("layout")) || 0
    ],
    feedCategory = ["weather"][parseInt(url.getSearchParam("feed")) || 0],
    devPath =
      "https://retail.adrenalineamp.com/rss/" +
      feedCategory +
      "/1920/" +
      zipCode +
      ".jpg",
    localPath = "c:\\data\\" + feedCategory + "\\weather.jpg";

  let dataURI = [devPath, localPath],
    indexes = getRandomIndexes(10),
    feeds = [],
    current = 0;

  function revealer() {
    if (!revealerEnabled) return;
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
      .delay($revealerSpeed + $animeDuration)
      .queue(function () {
        $(this).removeClass("revealer--animate").removeClass(mode[1]).dequeue();
      });
  }

  function animateItem(index) {
    let article = document.getElementById(index),
      media = article.querySelectorAll(".media");

    /* resizeText({
      elements: headline,
      minSize: 1.5,
      maxSize: 2.5,
      step: 0.1,
      unit: "em",
    }); */

    var animation = anime
      .timeline({
        autoplay: true,
        loop: false,
        easing: "cubicBezier(0.645, 0.045, 0.355, 1.000)",
        duration: $animeDuration,
        delay: $animeDuration,
        begin: () => revealer(),
      })
      .add(
        {
          targets: media,
          opacity: [0, 1],
          delay: 0,
          translateX: ["50%", "0%"],
        },
        $animeDuration
      );
  }

  function animateTemplate($container, $template, data) {
    const $clone = $template
      .clone()
      .attr("id", current)
      .css("z-index", current)
      .removeClass("hidden")
      .addClass("active");
    // $clone.find(".media img").attr("src", data);
    $container.append($clone);
    animateItem(current);

    /* setTimeout(() => {
      $clone.remove();
    }, timerDuration + $animeDuration); */
  }

  function iterateAnimations(data) {
    const $template = $("article");
    const $container = $("main");
    $template.remove();

    $container.attr({ id: screenLayout });

    let intro = anime({
      targets: $container[0],
      easing: "cubicBezier(0.645, 0.045, 0.355, 1.000)",
      duration: $revealerSpeed,
      delay: $animeDuration,
      opacity: 1,
    });

    animateTemplate($container, $template, data);
  }

  function init() {
    let imgPath = dataURI[0];
    iterateAnimations(imgPath);
  }

  init();
});
