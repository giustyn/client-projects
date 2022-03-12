$(function () {
  const $date = $(".date").text(moment().format("dddd, MMMM Do")),
    $revealerSpeed = parseInt($(":root").css("--revealer-speed")),
    $animeDuration = $revealerSpeed / 2,
    timerDuration = 10000,
    indexes = getRandomIndexes(10),
    displayType = ["standard", "videowall"][0],
    category = ["news", "celeb", "sports"][0],
    dataURI = {
      local: "c:\\data\\" + category + "\\",
      server: "https://retail.adrenalineamp.com/rss/Xnews/" + category + "/",
    };

  let feeds = [],
    current = 0;

  function revealer() {
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
      .delay($revealerSpeed * 1.5)
      .queue(function () {
        $(this).removeClass("revealer--animate").removeClass(mode[1]).dequeue();
      });
  }

  function animateItem(index) {
    let container = document.querySelector("main"),
      article = document.getElementById(index),
      story = article.querySelectorAll(".story-container"),
      headline = article.querySelectorAll(".headline");

    resizeText({
      elements: headline,
      minSize: 2,
      maxSize: 2.4,
      step: 0.1,
      unit: "em",
    });

    var animation = anime
      .timeline({
        begin: () => revealer(),
        targets: article,
        autoplay: true,
        loop: false,
        easing: "cubicBezier(0.645, 0.045, 0.355, 1.000)",
        duration: $animeDuration,
      })
      .add({
        opacity: [0, 1],
        delay: $animeDuration,
        translateX: ["25%", "0%"],
      })
      .add({
        targets: [story, headline],
        opacity: [0, 1],
        translateY: ["50%", "0%"],
        delay: anime.stagger($animeDuration / 2),
      })
      .add({
        delay: timerDuration - $animeDuration * 3,
        opacity: [1, 0],
        translateX: ["0%", "-25%"],
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

    setTimeout(function () {
      $clone.remove();
    }, timerDuration + $revealerSpeed);
  }

  function iterateAnimations() {
    const $template = $("article");
    const $container = $("main");

    anime({
      begin: () => revealer(),
      easing: "easeInExpo",
      targets: $container[0],
      opacity: [0, 1],
      duration: $revealerSpeed
    });

    animateTemplate($container, $template, feeds[current]);
    current++;
    setInterval(function () {
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
    getArticles(dataURI.server, indexes)
      .done((response) => {
        onTemplateSuccess(response);
      })
      .fail((response) => {
        onTemplateError(response);
      });
  }

  init();
});
