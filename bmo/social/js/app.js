(function () {
  "use strict";

  const clientId = { Name: "BMO", Logo: "./img/bmo-logo_social.svg" };

  const socialProvider = [
    {
      Id: 24,
      Name: "X (Twitter)",
      Logo: "./img/twitter.png",
    },
    {
      Id: 25,
      Name: "Instagram",
      Logo: "./img/instagram.png",
    },
    {
      Id: 26,
      Name: "Facebook",
      Logo: "./img/facebook.png",
    },
  ][0]; // 0 = Twitter, 1 = Instagram, 2 = Facebook

  const dataURI = [
    {
      Content: "BMO_US",
      Url: "https://kitchen.screenfeed.com/social/data/6w24z789gena94j8yt3728zgzw.json",
    },
    {
      Content: "BMO_CA",
      Url: "https://kitchen.screenfeed.com/social/data/4qsr8pzd9vpp64n6cx26kazya3.json",
    },
  ][1]; // 0 = US, 1 = CA

  const defaultMedia = {
    Status: {
      Code: 200,
      Message: "defaultMedia",
      Type: "fallbackContent",
    },
    Items: [
      {
        ContentId: "defaultId",
        User: {
          Id: "0",
          Username: "",
          Name: "BMO",
          ProfileImageUrlSmall: null,
          ProfileImageUrl: "",
        },
        Images: [
          {
            Url: "./img/BMO_FollowUs_BokehBlue.png",
            Width: 1080,
            Height: 1080,
          },
        ],
        Content: "<div class='logo'><img src='./img/bmo-logo_blue.svg'></div>",
        Provider: socialProvider.Id,
        ProviderIcon: "",
        CreatedDate: "",
        DisplayTime: "",
        IsRetweet: false,
        IsSelected: false,
      },
    ],
  };

  let timerDuration = 10000,
    animeSpeed = 750,
    limit = 3,
    loop = false;

  const root = document.documentElement;
  root.style.setProperty("--anime-speed", animeSpeed + "ms");

  function setContent($template, data) {
    const $container = $("main");
    const $clone = $template.clone();

    $clone.attr({ id: data.ContentId });
    $clone.find(".usericon img").attr("src", clientId.Logo);
    $clone.find(".socialicon img").attr("src", socialProvider.Logo);
    $clone.find(".message").html(data.Content);
    $clone.find(".published").text(data.DisplayTime);
    $clone.find(".media img").attr("src", data.Images[0].Url);
    if (data.User.Name) $clone.find(".username").text(data.User.Name);
    if (!data.User.Name) $clone.find(".username").text(clientId.Name);
    if (data.User.Username)
      $clone.find(".useraccount").text(data.User.Username);
    if (!data.User.Username) $clone.find(".useraccount").text(data.User.Name);
    $container.append($clone);

    resizeText({ elements: $clone[0].querySelectorAll(".message") });
    isolateTag({ element: $clone[0].querySelectorAll(".message") });
  }

  function animateTemplate(data) {
    let item = document.getElementById(data.ContentId);
    item.classList.add("active");
    let delay = setTimeout(() => {
      item.classList.remove("active");
    }, timerDuration + animeSpeed);
  }

  function iterateAnimations(data) {
    let index = 0;
    timerDuration = (limit * timerDuration) / data.length;

    animateTemplate(data[index]);
    if (data.length == 1) return;
    index = index + 1;

    let interval = setInterval(() => {
      animateTemplate(data[index]);
      if (!loop) index = index + 1;
      if (loop) index = (index + 1) % data.length;
      if (index == data.length) clearInterval(interval);
    }, timerDuration);
  }

  function pastDate(obj, num) {
    const pastTime = new Date(obj);
    const now = new Date();
    const daysInMs = num * 24 * 60 * 60 * 1000;
    const timeDiffInMs = now.getTime() - pastTime.getTime();
    if (timeDiffInMs >= daysInMs) return true;
    return false;
  }

  function onError(result) {
    let $template = $("article");
    let results = defaultMedia.Items;
    let feeds = results;
    let removeLogos = $(".socialicon, .account").remove();
    feeds.forEach((article) => {
      setContent($template, article);
    });
    iterateAnimations(feeds);
    // console.error(result);
  }

  function onSuccess(result) {
    let $template = $("article");
    let results = result.Items;
    let feeds = {};

    feeds = results
      .filter((obj) => obj.Images != null && obj.Images.length != 0)
      .filter((obj) => obj.Provider == socialProvider.Id)
      // .filter((obj) => pastDate(obj.CreatedDate, 30) != true)
      // .sort((a, b) => {
      //   if (a.CreatedDate > b.CreatedDate) return -1;
      // })
      .splice(0, limit);

    feeds.forEach((article) => {
      setContent($template, article);
    });
    if (feeds.length >= 1) iterateAnimations(feeds);
    if (feeds.length == 0) onError(result);
    $template.remove();
  }

  async function getData(onSuccess, onError, url) {
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        onSuccess(data);
      })
      .catch((err) => {
        onError(err);
      });
  }

  function init() {
    getData(onSuccess, onError, dataURI.Url);
  }

  init();
})();
