$(function () {
  const url = new ExtendedURL(window.location.href),
    $date = $(".date").text(moment().format("dddd, MMMM Do")),
    revealerEnabled = parseInt(url.getSearchParam("reveal")) || 1,
    $revealerSpeed = parseInt($(":root").css("--revealer-speed")) || 1800,
    $animeDuration = $revealerSpeed / 2,
    timerDuration = 10000,
    screenLayout = ["standard", "videowall"][
      parseInt(url.getSearchParam("layout")) || 0
    ],
    embeddedStory = ["Hnews", "Xnews"][
      parseInt(url.getSearchParam("embedded")) || 1
    ],
    feedCategory = ["news", "celeb", "sports"][0],
    devPath =
      "https://retail.adrenalineamp.com/rss/" +
      embeddedStory +
      "/" +
      feedCategory +
      "/1920/",
    localPath = "c:\\data\\" + feedCategory + "\\";

  let dataURI = [devPath, localPath],
    indexes = getRandomIndexes(10),
    feeds = [],
    current = 0;

  Array.prototype.shuffle = function () {
    const input = this;
    for (let i = input.length - 1; i >= 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      const itemAtIndex = input[randomIndex];
      input[randomIndex] = input[i];
      input[i] = itemAtIndex;
    }
    return input;
  };

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
      media = article.querySelectorAll(".media"),
      story = article.querySelectorAll(".story"),
      headline = article.querySelectorAll(".headline");

    resizeText({
      elements: headline,
      minSize: 1.5,
      maxSize: 2.5,
      step: 0.1,
      unit: "em",
    });

    let animation = anime
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
      )
      .add({
        targets: [story, headline],
        opacity: [0, 1],
        translateY: ["50%", "0%"],
        delay: anime.stagger($animeDuration / 3),
      });
  }

  function animateTemplate($container, $template, item) {
    const $clone = $template
      .clone()
      .attr("id", current)
      .css("z-index", current)
      .removeClass("hidden")
      .addClass("active");

    if (!item.story) {
      $clone.find(".story").remove();
      $clone.find(".headline");
    } else {
      $clone.find(".story").removeClass("hidden");
      $clone.find(".headline").text(item.story);
    }

    $clone.find(".media img").attr("src", item.image.src);

    $container.append($clone);
    animateItem(current);

    setTimeout(() => {
      $clone.remove();
    }, timerDuration + $animeDuration);
  }

  function iterateAnimations(data) {
    const $template = $("article");
    const $container = $template.parent();
    $template.remove();

    $container.attr({ id: screenLayout });

    let intro = anime({
      targets: $container[0],
      easing: "cubicBezier(0.645, 0.045, 0.355, 1.000)",
      duration: $revealerSpeed,
      delay: $animeDuration,
      opacity: 1,
    });

    animateTemplate($container, $template, data[current]);
    current++;
    setInterval(() => {
      animateTemplate($container, $template, data[current]);
      current = (current + 1) % data.length;
    }, timerDuration);
  }

  function onTemplateError(result) {
    console.warn("loading server data..");
    getItems(dataURI[0], indexes).done((response) => {
      onTemplateSuccess(response);
    });
  }

  function onTemplateSuccess(result) {
    $.each(result.Items, (i) => {
      feeds.push(result.Items[i]);
    });
    iterateAnimations(feeds);
    // console.log(feeds);
  }

  function init() {
    getItems(dataURI[1], indexes).done((response) => {
      let items = response.Items;
      if (!items) {
        onTemplateError();
      } else {
        onTemplateSuccess(response);
      }
    });
  }

  init();

  //
  // Development Only
  //
  function fetchStories(path) {
    for (let i = 0; i < 10; i++) {
      let content = { image: path + i + ".jpg", story: path + i + ".xml" };
      feeds.push(content);
    }
    // randomize article array
    feeds.shuffle();

    // fetch xml story and add to array
    for (let i = 0; i < feeds.length; i++) {
      fetch(feeds[i].story)
        .then((response) => response.text())
        .then((data) => {
          const parser = new DOMParser();
          const xml = parser.parseFromString(data, "application/xml");
          feeds[i].headline = xml.getElementsByTagName("story")[0].innerHTML;
        })
        .catch(console.error);
    }
    console.log(feeds);
  }

  // fetchStories(dataURI);
  // iterateAnimations(feeds)
});
