$(function () {
  const userName = "FNBO",
    userIcon = "./img/fnbo-logo.svg",
    animeDuration = 750,
    timerDuration = 10000,
    revealerSpeed = parseInt($(":root").css("--revealer-speed"));

  const dataURI = {
    local: "c:\\data\\news\\news.json",
    news: "https://kitchen.screenfeed.com/feed/7s51fskbkrzabmbzhqdtdydjj1.json",
    celeb:
      "https://kitchen.screenfeed.com/feed/541t7bgbww0emmrwpgfqtzsddm.json",
    sports:
      "https://kitchen.screenfeed.com/feed/3vyb6d30j18tj4a5ep97nx7vbd.json",
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
      .addClass(shuffle)
      .delay(revealerSpeed * 1.5)
      .queue(function () {
        $(this).removeClass("revealer--animate").removeClass(shuffle).dequeue();
      });
  }

  function animateItem($template) {
    var item = $template[0];
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
        begin: function () {
          revealer();

          resizeText({
            elements: document.querySelectorAll(".message"),
          });

          isolateTag({
            element: document.querySelectorAll(".message"),
          });
        },
      })
      .add({
        targets: item,
        opacity: [0, 1],
        // translateX: [100, 0],
        endDelay: timerDuration - animeDuration * 2,
      })
      .add({
        targets: item,
        opacity: [1, 0],
        // translateX: [0. - 100],
      });
  }

  function animateTemplate($container, $template, data, current) {
    const $clone = $template
      .clone()
      .attr("id", current)
      .css("z-index", current)
      .removeClass("hidden");

    if (data.Media === undefined || data.Media.length == 0) {
      let defaultImg = { Url: userIcon };
      $clone.find(".media video, .media img").attr("src", defaultImg);
    } else {
      $clone.find(".media video, .media img").attr("src", data.Media[0].Url);
    }

    $clone.find(".message").text(data.Title);
    $clone.find(".credit").text(data.Media[0].Credit);

    $container.append($clone);

    animateItem($clone);

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

  function getJsonData(onSuccess, onError, data) {
    return $.ajax({
      method: "GET",
      url: data,
      dataType: "json",
      success: function (result) {
        console.log(result);
        onSuccess(result);
      },
      error: function (result) {
        // console.error(result);
        onError(result);
      },
    });
  }

  function init() {
    // getJsonData(onTemplateSuccess, onTemplateError, dataURI.local); // get local data, located at c:\data
    getJsonData(onTemplateSuccess, onTemplateError, dataURI.sports); // get server data, via screenfeed.com
  }

  init();
});
