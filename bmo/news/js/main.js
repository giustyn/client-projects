$(function () {
  const devMode = true;

  const url = new ExtendedURL(window.location.href),
    $bumper = $("#bumper"),
    dataURI = ["c:\\data\\", "https://retail.adrenalineamp.com/rss/Hnews/"],
    folderName = ["news", "weather"][0 || url.getSearchParam("news")],
    screenLayout = ["landscape", "videowall"][
      0 || url.getSearchParam("layout")
    ],
    timerDuration = 10000,
    revealerEnabled = 1,
    revealerSpeed = parseInt($(":root").css("--revealer-speed"));

  let loadedStories = [],
    currentStory = 0,
    videoIntro = false;

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

  function ExtendedURL(href) {
    this.url = new URL(href);
    this.getSearchParam = function (param) {
      return this.url.searchParams.get(param);
    };
    return this;
  }

  function revealer() {
    if (!revealerEnabled) return;
    const $transition = $(".revealer"),
      mode = [
        "revealer--left",
        "revealer--right",
        "revealer--top",
        "revealer--bottom",
      ].shuffle();
    $transition
      .addClass("revealer--animate")
      .addClass(mode[1])
      .delay(revealerSpeed * 2)
      .queue(function () {
        $(this).removeClass("revealer--animate").removeClass(mode[1]).dequeue();
      });
  }

  function loadImages() {
    const imageArray = [];
    for (let i = 0; i < 10; i++) {
      imageArray.push(i + ".jpg");
    }
    imageArray.shuffle();
    addStories(imageArray);
  }

  function loadWeather() {
    let feedContainer = document.querySelector(".feed"),
      zipCode = 60606,
      weatherImg = [
        dataURI[Number(devMode)] + folderName + "\\weather.jpg",
        "https://retail.adrenalineamp.com/rss/weather/1920/" + zipCode + ".jpg",
      ],
      img = $("<img/>", {
        class: "weather-image",
        src: weatherImg[Number(devMode)],
      });
    $(img).appendTo(feedContainer);
    console.log(img[0]);
  }

  function init() {
    const $date = $(".date").text(moment().format("dddd, MMMM Do"));
    const $screenConfig = $("#container")
      .addClass(folderName)
      .addClass(screenLayout)
      .css({ opacity: 1 });
    if (folderName == "news") loadImages();
    if (folderName == "weather") loadWeather();
  }

  function addStories(imageNames) {
    let feedContainer = document.querySelector(".feed");
    let ten = 10; //there are only 10 stories
    while (ten) {
      //once 0 it will be false
      const newImage = new Image();
      newImage.addEventListener(
        "load",
        function (e) {
          const storyDiv = document.createElement("div");
          storyDiv.id =
            folderName +
            "_" +
            e.path[0].src.slice(e.path[0].src.lastIndexOf("/") + 1, -4);
          storyDiv.classList.add("story");
          storyDiv.appendChild(newImage);
          feedContainer.appendChild(storyDiv);
          loadedStories.push(storyDiv);
          loadXML(e.path[0].src.slice(0, -3) + "xml");
        },
        false
      );
      newImage.src =
        dataURI[Number(devMode)] + folderName + "\\" + imageNames[ten - 1]; //offset to 0-1
      ten--;
    }
  }

  function loadXML(xmlPath) {
    const request = new XMLHttpRequest();
    request.open("GET", xmlPath, true);
    request.send(null);

    // state changes
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        // done
        if (request.status === 200 || request.status === 0) {
          // complete
          const storyID =
            folderName +
            "_" +
            request.responseURL.slice(
              request.responseURL.lastIndexOf("/") + 1,
              -4
            );

          const xmlstory = loadedStories.find((e) => e.id == storyID);

          let textDiv = document.createElement("div");
          textDiv.classList.add("text");
          textDiv.innerHTML = $(request.responseText).find(
            "story"
          )[0].innerHTML;
          xmlstory.appendChild(textDiv);
        }
      }
    };
  }

  function videoTimeUpdate(event) {
    const eventItem = event.target;
    const current = Math.round(eventItem.currentTime * 1000);
    const total = Math.round(eventItem.duration * 1000);
    revealer();

    if (loadedStories.length == 0) return;
    if (videoIntro === true) {
      if (total - current < 500) {
        eventItem.removeEventListener("timeupdate", videoTimeUpdate);
        loadedStories[0].classList.add("active");
        setInterval(showNextStory, timerDuration);
        $($bumper).fadeOut(500, function () {
          $($bumper).remove();
        });
        a;
      }
    } else {
      eventItem.removeEventListener("timeupdate", videoTimeUpdate);
      if (folderName != "weather") {
        loadedStories[0].classList.add("active");
        setInterval(showNextStory, timerDuration);
      }
    }
  }

  function showNextStory() {
    loadedStories[currentStory].classList.remove("active");
    currentStory++;
    currentStory = currentStory >= loadedStories.length ? 0 : currentStory;
    loadedStories[currentStory].classList.add("active");
    revealer();
  }

  $bumper[0].addEventListener("timeupdate", videoTimeUpdate);
  init();

  // console.log($bumper[0]);
  // console.log(folderName);
});
