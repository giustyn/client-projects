$(document).ready(function () {
  const url = new ExtendedURL(window.location.href),
    timerDuration = 10000,
    transition = 1,
    screen = [{
      'config': 'standard'
    }, {
      'config': 'anamorphic'
    }][0];

  let $date = $('.date').text(moment().format('dddd, MMMM Do')),
    folderName = url.getSearchParam("category") || ["news", "sports", "celeb"][1],
    loadedStories = [],
    currentStory = 0,
    dataURI = [
      local = "c:\\data\\" + folderName,
      server = "https://retail.adrenalineamp.com/rss/Xnews/"
      // server = "https://retail.adrenalineamp.com/rss/Hnews/"
    ],
    video_1S = $("#bgvideo").attr("src", "./video/Bokeh_1920x1080.mp4"),
    video_3S = $("#bgvideo").attr("src", "./video/Bokeh_4200x1080.mp4");

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

  function revealer(direction) {
    let $transition = $('.revealer');
    let $speed = parseInt($(':root').css('--revealer-speed'));
    if (transition == 1) {
      $transition.addClass(direction).show();
      $transition.addClass('revealer--animate').delay($speed * 2).queue(function () {
        $(this).removeClass('revealer--animate ' + direction).hide().dequeue();
      });
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

  function addStories(imageNames, dataPath) {
    let ten = 10; //there are only 10 stories

    while (ten) { //once 0 it will be false
      const newImage = new Image();
      newImage.addEventListener("load", function (e) {
        const storyDiv = document.createElement("div");
        const articles = document.querySelector(".article-container");
        storyDiv.id = folderName + '_' + e.path[0].src.slice(e.path[0].src.lastIndexOf('/') + 1, -4);
        // storyDiv.classList.add('story');
        $(storyDiv).addClass('story');
        $('<div>').addClass('photo').appendTo(storyDiv);
        $(storyDiv).append(newImage);
        $(storyDiv).find('.photo').css('background-image','url(' + newImage.src +')');
        articles.appendChild(storyDiv);
        loadedStories.push(storyDiv);
        loadXML(e.path[0].src.slice(0, -3) + "xml");
      }, false);
      newImage.src = dataPath + folderName + "\\" + imageNames[ten - 1]; //offset to 0-1
      ten--;
    }
  }

  function showNextStory() {
    revealer('revealer--left');
    $(loadedStories[currentStory]).removeClass('visible');
    currentStory = (currentStory + 1) % loadedStories.length;
    $(loadedStories[currentStory]).addClass('visible');
  }

  function animateContent() {
    let
      $animeSpeed = parseInt($(':root').css('--anime-speed')),
      $animeDelay = parseInt($(':root').css('--anime-delay')),
      $revealerSpeed = parseInt($(':root').css('--revealer-speed'));

    let animation = anime.timeline({
        autoplay: true,
        loop: false,
        duration: $animeSpeed,
        easing: 'easeInOutSine',
      })
      .add({
        targets: '.stage',
        opacity: [1],
        duration: $animeSpeed,
        complete: function () {
          $(loadedStories[currentStory]).addClass('visible'),
            // revealer('revealer--bottom');
            cycleStories();
        }
      }, '-=0')
      .add({
        targets: '.roundel .circle-container',
        scale: [0, 1],
        opacity: [0, 1],
      }, '-=500')
      .add({
        targets: '.roundel .circle-white',
        scale: [0, 3],
        opacity: [1, 0],
      }, '-=500')
      .add({
        targets: '.roundel .circle-inner',
        scale: [0, 1],
        opacity: [0, 1],
      }, '-=750')
      .add({
        targets: '.roundel .text',
        opacity: [0, 1],
        delay: anime.stagger(500),
        translateX: ['-200%', '0%'],
      }, '-=500')
      .add({
        targets: '.roundel .circle-line',
        opacity: [0, 1],
      }, '-=2500')
      .add({
        targets: '.standard .footer-container',
        opacity: [0, 1],
        duration: ($animeSpeed / 1.5),
        translateY: ['100%', '0%'],
      }, '-=2000')
      .add({
        targets: '.anamorphic .footer-container',
        opacity: [0, 1],
        duration: ($animeSpeed / 1.5),
        translateX: ['100%', '0%'],
      }, '-=2000')
      .add({
        targets: '.footer-left *',
        opacity: [0, 1],
        delay: anime.stagger(300),
      }, '-=1000')
      .add({
        targets: '.footer-right *',
        opacity: [0, 1],
        delay: anime.stagger(300),
        translateY: ['50%', '0%'],
      }, '-=0')

  }

  function cycleStories() {
    setInterval(showNextStory, timerDuration);
  }

  function setContent(dataPath) {
    const imageArray = [];
    for (let i = 0; i < 10; i++) {
      imageArray.push(i + ".jpg");
    }
    imageArray.shuffle();
    addStories(imageArray, dataPath);
    animateContent();
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
      animateContent();
      cycleStories();
    }
  }

  function screenLayout() {
    $('body').addClass(screen.config);
    // $bumper[0].addEventListener("timeupdate", videoTimeUpdate);
  }

  function init() {
    $.get(dataURI[0], function () {
        console.log("local data found")
      })
      .done(function () {
        setContent(dataURI[0]);
      })
      .catch(function () {
        $.get(dataURI[1], function () {
          setContent(dataURI[1]);
        })
      })
      .always(function () {
        screenLayout();
      });
  }

  init();

});