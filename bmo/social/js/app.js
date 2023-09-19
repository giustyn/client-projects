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
  ][2]; // 0 = Twitter, 1 = Instagram, 2 = Facebook

  const dataURI = [
    {
      Content: "BMO_US",
      Url: "https://kitchen.screenfeed.com/social/data/6w24z789gena94j8yt3728zgzw.json",
    },
    {
      Content: "BMO_CA",
      Url: "https://kitchen.screenfeed.com/social/data/4qsr8pzd9vpp64n6cx26kazya3.json",
    },
    {
      Content: "DEV_TEST",
      Url: "./_data/test.json",
    },
  ][0]; // 0 = US, 1 = CA, 2 = DEV

  const defaultMedia = {
    Status: {
      Code: 200,
      Message: "defaultMedia",
      Type: "fallbackContent",
    },
    Items: [
      {
        ContentId: "0",
        User: {
          Id: "0",
          Username: "",
          Name: "BMO",
          ProfileImageUrlSmall: null,
          ProfileImageUrl: "",
        },
        Images: [
          {
            // Url: "./img/BMO_FollowUs_BokehWhite.png",
            Url: "./img/BMO_FollowUs_BokehBlue.png",
            // Url: "./img/BMO_FollowUs_Blue.png",
            Width: 1080,
            Height: 1080,
          },
        ],
        Content: "<div class='logo'><img src='./img/bmo-logo_blue.svg'></div>",
        // Content: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
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
    limit = 3,
    loop = false;

  function setContent($template, data, index, feeds) {
    const $container = $("main");
    const $clone = $template.clone();

    $clone.attr({ id: data.ContentId }).css("z-index", feeds.length - index);
    $clone.find(".usericon img").attr("src", clientId.Logo);
    $clone.find(".socialicon img").attr("src", socialProvider.Logo);
    $clone.find(".message").html(data.Content);
    $clone.find(".published").text(data.DisplayTime);
    $clone.find(".media img").attr("src", data.Images[0].Url);
    if (data.User.Name) $clone.find(".username").text(data.User.Name);
    if (!data.User.Name) $clone.find(".username").text(clientId.Name);
    if (data.User.Username)
      $clone.find(".useraccount").text(data.User.Username);
    if (!data.User.Username) $clone.find(".useraccount").remove();

    $container.append($clone);
    $template.remove();

    resizeText({ elements: $clone[0].querySelectorAll(".message") });
    isolateTag({ element: $clone[0].querySelectorAll(".message") });
  }

  function animateTemplate(data) {
    let item = document.getElementById(data.ContentId);
    item.classList.add("active");
    let delay = setTimeout(() => {
      item.classList.remove("active");
    }, timerDuration);
  }

  function iterateAnimations(data) {
    let index = 0;
    timerDuration = (limit * timerDuration) / data.length;

    animateTemplate(data[index]);
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
    console.warn(result);
    if (result.Status != undefined && result.Status.Code == 400) {
      result = defaultMedia;
      console.log(result, "fallback data");
      // console.log(results.filter((obj) => obj.Provider !== socialProvider.Id));
    }
  }

  function onSuccess(result) {
    let results = result.Items;
    let $template = $("article");
    let feeds = [];

    feeds = results
      // .filter((obj) => pastDate(obj.CreatedDate, 30) != true)
      .filter((obj) => obj.Provider == socialProvider.Id)
      .filter((obj) => obj.Images.length != 0)
      .sort((a, b) => {
        if (a.CreatedDate > b.CreatedDate) return -1;
      })
      .splice(0, limit);

    feeds.forEach((el, i, arr) => {
      setContent($template, el, i, arr);
    });

    iterateAnimations(feeds);
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

  init(diag(false));
})();
