$(function () {
  const revealerSpeed = parseInt($(":root").css("--revealer-speed")),
    animeDuration = revealerSpeed / 2,
    timerDuration = 10000,
    indexes = getRandomIndexes(10),
    category = ["news", "celeb", "sports"][0],
    dataURI = {
      local: "c:\\data\\" + category + "\\",
      server:
        "https://retail.adrenalineamp.com/rss/Hnews/" + category + "/1920/",
    },
    displayType = ["standard", "videowall"][0];

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
      .delay(revealerSpeed * 1.5)
      .queue(function () {
        $(this).removeClass("revealer--animate").removeClass(mode[1]).dequeue();
      });
  }

  function animateItem(index) {
    let article = document.getElementById(index),
      container = article.querySelectorAll(".story-container");
    content = article.querySelectorAll(".message");

    resizeText({
      elements: content,
      minSize: 2,
      maxSize: 2,
      step: 0.1,
      unit: "em",
    });

    var animateIn = anime
      .timeline({
        autoplay: true,
        loop: false,
        easing: "cubicBezier(0.645, 0.045, 0.355, 1.000)",
        duration: animeDuration,
      })
      .add({
        begin: () => revealer(),
        delay: animeDuration,
        targets: article.parentElement,
      })
      .add({
        targets: article,
        opacity: [0, 1],
        translateX: ["10%", "0%"],
        duration: animeDuration,
      })
      .add({
        targets: [container, content],
        opacity: [0, 1],
        translateY: ["100%", "0%"],
        delay: anime.stagger(animeDuration),
        // endDelay: timerDuration - animeDuration * 2,
      })
      .add({
        targets: article,
        delay: timerDuration/2, 
        opacity: [1, 0],
        translateY: ["0%", "5%"],
      });
  }

  function animateTemplate($container, $template, data) {
    const $clone = $template
      .clone()
      .attr("id", current)
      .css("z-index", current)
      .removeClass("hidden")
      .addClass("active");

    $clone.find(".media-container img").attr("src", data.image.src);
    $clone.find(".message").text(data.story);
    if (!data.story) $clone.find(".story-container").addClass("hidden");

    $container.append($clone);

    animateItem(current);

    setTimeout(function () {
      $clone.remove();
    }, timerDuration + revealerSpeed);
  }

  function iterateAnimations() {
    const $template = $("article");
    const $container = $("main");

    $container
      .removeClass("hidden")
      .addClass("fade")
      .delay(revealerSpeed * 1.5)
      .queue(function () {
        $(this).removeClass("fade").dequeue();
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
    getArticles(dataURI.server, indexes).done((response) => {
      onTemplateSuccess(response);
    });
    // .fail((response) => {
    //   onTemplateError(response);
    // });
  }

  init();
});
