$(function () {
  const revealerSpeed = parseInt($(":root").css("--revealer-speed")),
    animeDuration = 750,
    timerDuration = 10000,
    indexes = getRandomIndexes(10),
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
      .delay(revealerSpeed * 1.5)
      .queue(function () {
        $(this).removeClass("revealer--animate").removeClass(mode[1]).dequeue();
      });
  }

  function animateItem(index) {
    let article = document.getElementById(index),
      content = article.querySelectorAll(".message");
    // var item = $template[0];
    var animateIn = anime
      .timeline({
        // easing: 'easeInOutQuad',
        easing: "easeInOutExpo",
        easing: "cubicBezier(0.645, 0.045, 0.355, 1.000)",
        duration: animeDuration,
        autoplay: true,
        loop: false,
      })
      .add({
        begin: () => revealer(),
      })
      .add({
        begin: function () {
          resizeText({ elements: content });
          isolateTag({ element: content });
        },
      })
      .add(
        {
          targets: article,
          opacity: [0, 1],
          translateX: ["100%", "0%"],
          endDelay: timerDuration - animeDuration * 2,
        },
        "-=" + animeDuration
      )
      .add({
        targets: article,
        opacity: [1, 0],
        translateX: ["0%", "-100%"],
      });
  }

  function animateTemplate($container, $template, data, current) {
    const $clone = $template
      .clone()
      .attr("id", current)
      .css("z-index", current)
      .removeClass("hidden");

    $clone.find(".media img").attr("src", data.image.src);
    $clone.find(".message").text(data.story);
    $container.append($clone);

    animateItem(current);

    setTimeout(function () {
      $clone.remove();
    }, timerDuration + revealerSpeed * 2);
  }

  function iterateAnimations() {
    const $template = $("article");
    const $container = $("main");

    // console.log(current, feeds[current])
    animateTemplate($container, $template, feeds[current], current);
    current++;

    setInterval(function () {
      // console.log(current, feeds[current])
      animateTemplate($container, $template, feeds[current], current);
      current = (current + 1) % feeds.length;
    }, timerDuration);

    $template.remove();
  }

  function onTemplateError(result) {
    console.warn("could not get data");
  }

  function onTemplateSuccess(result) {
    $.each(result.Items, function (i) {
      feeds.push(result.Items[i]);
    });
    iterateAnimations();
  }

  function init() {
    getArticles(dataURI.local, indexes)
    .done((response) => {
      onTemplateSuccess(response);
    })
    // .fail((response) => {
    //   onTemplateError(response);
    // });
  }

  init();
});
