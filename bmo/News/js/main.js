$(document).ready(function () {
  const url = new ExtendedURL(window.location.href),
    timerDuration = 5000,
    transition = 1;

  let folderName = url.getSearchParam("category") || ["news", "sports", "celeb"][0],
    loadedStories = [],
    currentStory = 0,

    $date = $('.date').text(moment().format('dddd, MMMM Do')),
    $bumper = $("#bumper").attr("src", "./video/").parent().remove(),
    $background = $("#bgvideo").attr("src", "./video/Bokeh_1920x1080.mp4"),

    dataURI = [
      local = "c:\\data\\" + folderName,
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
        storyDiv.id = folderName + '_' + e.path[0].src.slice(e.path[0].src.lastIndexOf('/') + 1, -4);
        storyDiv.classList.add('story');
        storyDiv.appendChild(newImage);
        $('.article-container').append(storyDiv);
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
    let $animeSpeed = parseInt($(':root').css('--anime-speed'));
    let $animeDelay = parseInt($(':root').css('--anime-delay'));
    let $revealerSpeed = parseInt($(':root').css('--revealer-speed'));

    let animation = anime.timeline({
        autoplay: true,
        loop: false,
        easing: 'easeInOutQuad',
        begin: function () {
          revealer('revealer--bottom');
        }
      })
      .add({
        targets: '.content',
        opacity: [0, 1],
        delay: ($revealerSpeed - $animeSpeed),
        duration: $animeSpeed,
      }, '+=0')
      .add({
        targets: '.roundel .circle-container',
        scale: [0, 1],
        opacity: [0, 1],
        // translateY: ['-200%', '0%']
      }, '-=0')
      .add({
        targets: '.roundel .circle-white',
        scale: [0, 3],
        opacity: [1, 0],
      }, '-=500')
      .add({
        targets: '.roundel .circle-inner',
        scale: [0, 1],
        opacity: [0, 1],
      }, '-=500')
      .add({
        targets: '.roundel .circle-line',
        scale: [0, 1],
        opacity: [0, 1],
      }, '-=2500')
      .add({
        targets: '.roundel .text:first-child',
        // scale: [0, 1],
        opacity: [0, 1],
        translateX: ['-150%', '0%'],
      }, '-=500')
      .add({
        targets: '.roundel .text:last-child',
        // scale: [0, 1],
        opacity: [0, 1],
        translateX: ['150%', '0%'],
      }, '-=1000')
      .add({
        targets: '.footer-container',
        opacity: [0, 1],
        duration: ($animeSpeed / 1.5),
        translateY: ['100%', '0%'],
      }, '-=2000')
      .add({
        targets: '.footer-wrapper *',
        opacity: [0, 1],
        delay: anime.stagger(100),
        translateY: ['100%', '0%'],
      }, '-=1500')
      .add({
        begin: function () {
          $(loadedStories[currentStory]).addClass('visible');
          cycleStories();
        }
      }, '-=1000')

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
        // $bumper[0].addEventListener("timeupdate", videoTimeUpdate);
      });
  }

  init();

});