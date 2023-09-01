(function () {
  const userName = "BMO",
    userIcon = "./img/bmo-logo.svg",
    socialMediaIcon = "./img/social-media-icon.png",
    timerDuration = 10000;

  const dataURI = {
    local: "c:\\data\\social\\social.json",
    server:
      "https://kitchen.screenfeed.com/social/data/6w24z789gena94j8yt3728zgzw.json",
  };

  let feeds = [],
    current = 0;

  function animateTemplate(data, _current) {
    const $clone = document.getElementsByTagName("article")[0];

    let ProfileImageUrl = data.User.ProfileImageUrl,
      ProfileUserName = data.User.Name;

    // $clone
    //   .querySelectorAll(".media video, .media img")
    //   .forEach((elem) => elem.setAttribute("src", data.Images[0].Url));

    if (!data.User.ProfileImageUrl) {
      // use default instagram image & username
      ProfileImageUrl = userIcon;
      ProfileUserName = userName;
    }

    // $clone.setAttribute("id", current);
    // $clone.style.zIndex = current;
    // $clone.classList.remove("hidden");
    const media = document.getElementById(data.ContentId);
    media.classList.remove("hidden");

    $clone
      .querySelectorAll(".socialicon img")
      .forEach((icon) => icon.setAttribute("src", socialMediaIcon));
    $clone
      .querySelectorAll(".username")
      .forEach((icon) => (icon.innerText = ProfileUserName));
    $clone
      .querySelectorAll(".useraccount")
      .forEach((icon) => (icon.innerText = data.User.Username));
    $clone
      .querySelectorAll(".usericon img")
      .forEach((icon) => icon.setAttribute("src", ProfileImageUrl));

    const content = $clone.querySelectorAll(".message");
    content.forEach((icon) => (icon.innerText = data.Content));
    resizeText({ elements: content });
    isolateTag({ element: content });

    $clone
      .querySelectorAll(".published")
      .forEach((icon) => (icon.innerText = data.DisplayTime));

    setTimeout(function () {
      media.classList.add("hidden");
    }, timerDuration);
  }

  function iterateAnimations() {
    animateTemplate(feeds[current], current);
    current = (current + 1) % feeds.length;

    setTimeout(iterateAnimations, timerDuration);
  }

  function onTemplateError(result) {
    console.warn(result);
    console.warn("could not get data");
  }

  function onTemplateSuccess(result) {
    feeds = [
      ...new Map(result.Items.map((item) => [item.Content, item])).values(),
    ]
      .filter(
        (item) => item.Provider == 25 && item.Images.length == 1 && item.Content
      )
      .sort(
        (a, b) =>
          new Date(b.CreatedDate).getTime() - new Date(a.CreatedDate).getTime()
      )
      .slice(0, 5);

    const container = document.getElementById("media-container");
    feeds.forEach((feed) => {
      const image = feed.Images[0].Url;

      const media = document.createElement("div");
      media.setAttribute("id", feed.ContentId);
      media.classList.add("media");
      media.classList.add("hidden");

      const featureImg = document.createElement("img");
      featureImg.setAttribute("src", image);
      featureImg.classList.add("feature");

      const blurredImg = document.createElement("img");
      blurredImg.setAttribute("src", image);
      blurredImg.classList.add("blurred");

      media.appendChild(featureImg);
      media.appendChild(blurredImg);

      container.append(media);
    });

    iterateAnimations();
  }

  async function getJsonData(onSuccess, onError, data) {
    try {
      const response = await fetch(data);
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      const results = await response.json();
      onSuccess(results);
    } catch (error) {
      onError(error);
    }
  }

  function init() {
    // getJsonData(onTemplateSuccess, onTemplateError, dataURI.local); // get local data, located at c:\data
    getJsonData(onTemplateSuccess, onTemplateError, dataURI.server); // get server data, via screenfeed.com
  }

  init();
})();
