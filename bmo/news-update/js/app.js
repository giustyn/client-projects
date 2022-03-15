$(function () {
  const $date = $(".date").text(moment().format("dddd, MMMM Do")),
    $revealerSpeed = parseInt($(":root").css("--revealer-speed")),
    $animeDuration = $revealerSpeed / 2,
    timerDuration = 10000,
    revealerEnabled = 1,
    screenLayout = ["standard", "videowall"][1],
    feedCategory = ["news", "celeb", "sports"][0],
    devPath =
      "https://retail.adrenalineamp.com/rss/Xnews/" + feedCategory + "/",
    localPath = "c:\\data\\" + feedCategory + "\\";

  // let dataURI = devPath,
  let dataURI = localPath,
    current = 0,
    feeds = [];

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
      media = article.querySelectorAll(".media-container"),
      story = article.querySelectorAll(".story-container"),
      headline = article.querySelectorAll(".headline");

    resizeText({
      elements: headline,
      minSize: 1.5,
      maxSize: 2.5,
      step: 0.1,
      unit: "em",
    });

    var animation = anime
      .timeline({
        autoplay: true,
        loop: false,
        easing: "cubicBezier(0.645, 0.045, 0.355, 1.000)",
        duration: $animeDuration,
        delay: $animeDuration,
        begin: () => revealer(),
      })

      .add({
        targets: media,
        opacity: [0, 1],
        // translateY: ["25%", "0%"],
      })
      .add({
        targets: [story, headline],
        opacity: [0, 1],
        translateY: ["25%", "0%"],
        delay: anime.stagger($animeDuration / 2, { direction: "normal" }),
      });
  }

  function animateTemplate($container, $template, data) {
    const $clone = $template
      .clone()
      .attr("id", current)
      .css("z-index", current)
      .removeClass("hidden")
      .addClass("active");

    if (!data.story) $clone.find(".story-container").addClass("hidden");
    $clone.find(".media-container img").attr("src", data.image.src);
    $clone.find(".headline").text(data.story);
    $container.append($clone);
    animateItem(current);

    setTimeout(() => {
      $clone.remove();
    }, timerDuration + $animeDuration);
  }

  function iterateAnimations() {
    const $template = $("article");
    const $container = $("main");

    $container.attr({ id: screenLayout });

    let intro = anime({
      targets: $container[0],
      easing: "easeInExpo",
      duration: $revealerSpeed,
      opacity: 1,
    });

    animateTemplate($container, $template, feeds[current]);
    current++;
    setInterval(() => {
      animateTemplate($container, $template, feeds[current]);
      current = (current + 1) % feeds.length;
    }, timerDuration);

    $template.remove();
  }

  function onTemplateError(result) {
    console.warn("could not get data");
  }

  function onTemplateSuccess(result) {
    $.each(result.Items, (i) => {
      feeds.push(result.Items[i]);
    });
    iterateAnimations();
  }

  function init() {
    let indexes = getRandomIndexes(10);
    getArticles(dataURI, indexes).done((response) => {
      onTemplateSuccess(response);
    });
    /* .fail((response) => {
        onTemplateError(response);
      }); */
  }

  init();
});
