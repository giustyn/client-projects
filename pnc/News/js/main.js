(function () {
  const url = new ExtendedURL(window.location.href),
    timerDuration = 10000,
    screenConfig = 1;

  let folderName = url.getSearchParam("category") || ["news", "sports", "celeb"][0],
    loadedStories = [],
    currentStory = 0,
    videoIntro = [{
      "news": "PNC_Syn_News.mp4",
      "sports": "PNC_Syn_Sports.mp4",
      "celeb": "PNC_Syn_Entertainment.mp4",
      "fin": "PNC_Syn_Stocks.mp4"
    }][0],
    $bumper = $("#bumper").attr("src", "./video/" + videoIntro[folderName]),
    dataURI = [
      local = "c:\\data\\",
      server = "https://retail.adrenalineamp.com/rss/Xnews/"
    ];

  Array.prototype.shuffle = function () {
    const input = this;
    for (let i = input.length - 1; i >= 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      const itemAtIndex = input[randomIndex];
      input[randomIndex] = input[i];
      input[i] = itemAtIndex;
    }
    return input;
  }

  function ExtendedURL(href) {
    this.url = new URL(href);
    this.getSearchParam = function (param) {
      return this.url.searchParams.get(param)
    };
    return this;
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
          const storyID = folderName + "_" + request.responseURL.slice(request.responseURL.lastIndexOf('/') + 1, -4);
          const xmlstory = loadedStories.find(ele => ele.id == storyID);
          let textDiv = document.createElement('div');
          textDiv.classList.add('text');
          textDiv.innerHTML = $(request.responseText).find("story")[0].innerHTML;
          xmlstory.appendChild(textDiv);
        }
      }
    };
  }

  function revealer(direction) {
    let $transition = $('.revealer');
    let $enabled = parseInt($(':root').css('--revealer'));
    let $speed = parseInt($(':root').css('--revealer-speed'));
    if ($enabled == 1) {
      $transition.addClass(direction).show();
      $transition.addClass('revealer--animate').delay($speed * 2).queue(function () {
        $(this).removeClass('revealer--animate ' + direction).hide().dequeue();
      });
    }
  }

  function addStories(imageNames, dataPath) {
    let ten = 10; //there are only 10 stories
    while (ten) { //once 0 it will be false
      const newImage = new Image();
      newImage.addEventListener("load", function (e) {
        const storyDiv = document.createElement("div");
        storyDiv.id = folderName + '_' + e.path[0].src.slice(e.path[0].src.lastIndexOf('/') + 1, -4);
        storyDiv.classList.add('story');
        storyDiv.appendChild(newImage);
        document.body.appendChild(storyDiv);
        loadedStories.push(storyDiv);
        loadXML(e.path[0].src.slice(0, -3) + "xml");
      }, false);
      newImage.src = dataPath + folderName + "\\" + imageNames[ten - 1]; //offset to 0-1
      ten--;
    }
  }

  function showNextStory() {
    revealer('revealer--right');
    if (screenConfig == 2) {
      loadedStories[currentStory].classList.remove('visible');
      loadedStories[currentStory + 1].classList.remove('visible');
      currentStory = (currentStory + 2) % loadedStories.length;
      loadedStories[currentStory].classList.add('visible');
      loadedStories[currentStory + 1].classList.add('visible');
    } else {
      loadedStories[currentStory].classList.remove('visible');
      currentStory = (currentStory + 1) % loadedStories.length;
      loadedStories[currentStory].classList.add('visible');
    }
  }

  function animateIntro() {
    let $animeSpeed = parseInt($(':root').css('--anime-speed'));
    let $date = $('.date').text(moment().format('dddd, MMMM Do'));
    let animation = anime.timeline({
        targets: '#intro .date',
        easing: 'easeInOutExpo',
      })
      .add({
        scale: [0, 1],
        opacity: [0, 1],
        translateX: ['-100%', '0%'],
        duration: ($animeSpeed * 2),
        delay: 1000,
        endDelay: 3200
      })
      .add({
        opacity: [1, 0],
        duration: ($animeSpeed * 2),
        update: function (anim) {
          $date.css('filter', 'blur(' + 20 * anim.progress / 100 + 'px)')
        }
      });
  }

  function animateStories() {
    revealer('revealer--right');
    loadedStories[0].classList.add('visible');
    if (screenConfig == 2) {
      loadedStories[1].classList.add('visible');
    }
    setInterval(showNextStory, timerDuration);
  }

  function videoTimeUpdate(event) {
    const eventItem = event.target;
    const current = Math.round(eventItem.currentTime * 1000);
    const total = Math.round(eventItem.duration * 1000);
    if ((total - current) < 500) {
      eventItem.removeEventListener("timeupdate", videoTimeUpdate);
      $($bumper).fadeOut(500, function () {
        $($bumper).parent().remove();
      });
      animateStories();
    }
  }

  function setLayout() {
    colorTheme = $(':root').css('--clr-story-background', 'var(--' + folderName + ')');
    if (screenConfig == 1) {
      $('body').addClass('single-screen')
    } else if (screenConfig == 2) {
      $('body').addClass('dual-screen')
    };
    console.log("screens: " + screenConfig);
    console.log("category: " + folderName);
  }

  function setContent(dataPath) {
    const imageArray = [];
    for (let i = 0; i < 10; i++) {
      imageArray.push(i + ".jpg");
    }
    setLayout();
    animateIntro();
    imageArray.shuffle();
    addStories(imageArray, dataPath);
  }

  function init() {
    $.get(dataURI[0], function () {
        console.log("local data found")
      })
      .done(function () {
        console.log("dataURI: " + dataURI[0]);
        setContent(dataURI[0]);
      })
      .fail(function () {
        $.get(dataURI[1], function () {
          console.log("dataURI: " + dataURI[1]);
          setContent(dataURI[1]);
        })
      })
      .always(function () {
        $bumper[0].addEventListener("timeupdate", videoTimeUpdate);
      });
  }

  init();


})();