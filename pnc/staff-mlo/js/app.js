(function () {
  var env = "prod"; // "dev"

  var example = {
    pathname: "./img/default.png",
    id: 1,
    jobTitle: {
      title: "",
      id: 1,
      templateValues: {
        heading: {
          key: "heading",
          value: "Let's talk",
          order: 0,
          id: 1,
        },
        message: {
          key: "message",
          value:
            "We're here to help you find the right solution to meet your goals.",
          order: 1,
          id: 2,
        },
        legal: {
          key: "legal",
          value:
            "The PNC Financial Services Group, Inc. All rights reserved. PNC Bank, National Association. Member FDIC ",
          order: 2,
          id: 3,
        },
        mloLicense: {
          key: "mloLicense",
          value: "12345",
          order: 3,
          id: 4,
        },
      },
    },
    user: {
      displayName: "",
      id: 1,
    },
  };

  var bgVideo = document.getElementById("bgVideo");
  var fallback = document.getElementById("fallback");

  function getStaff(onSuccess, onError) {
    var tag = window.parent.PlayerSDK.getTagByPrefix("PNC.MPS."); // Note: "PNC.MPS." for production
    var templateGroup = "pnc_2021_staff_mlo"; // Note: "pnc_2021_staff_mlo" for mlo templates, "pnc_2021_staff" all others.
    var host = "https://photos-dev.adrenalineamp.com";
    if (!tag) {
      onTemplateError();
      return;
    }

    if (env === "prod") {
      host = "https://dcn.adrenalineamp.com";
    }

    bgVideo.play();
    bgVideo.style.display = "block";

    return $.ajax({
      method: "GET",
      url:
        host +
        "/public-api/mps/" +
        tag.Name +
        "/template/" +
        templateGroup +
        "?a=e85711db-6395-4811-94c4-93ec1e83f4b3",
      dataType: "json",
      success: function (result) {
        console.log(result);
        onSuccess(result);
      },
      error: function (result) {
        console.error(result);
        onError(result);
      },
    });
  }

  function animate() {
    let speed = 750,
      delay = 50,
      pause = 5000,
      animation = anime
        .timeline({
          loop: false,
          autoplay: false,
          duration: speed,
          easing: "easeInOutExpo",
        })
        .add(
          {
            targets: ".container",
            easing: "easeInOutSine",
            delay: speed,
            opacity: [0, 1],
          },
          "-=" + speed
        )
        .add({
          targets: ".heading",
          translateY: "100%",
          translateX: ["100%", "0%"],
          opacity: [0, 1],
        })
        .add({
          targets: ".heading",
          delay: speed,
          translateY: ["100%", "0%"],
        })
        .add(
          {
            targets: ".photo",
            translateX: ["100%", "0%"],
            opacity: [0, 1],
            scale: [0, 1],
            duration: speed * 2,
          },
          "-=" + speed * 3.5
        )
        /** animate card #1 */
        .add(
          {
            targets: ".card-1, .card-1 *",
            translateX: ["50%", "0%"],
            opacity: [0, 1],
            delay: anime.stagger(delay / 2),
            endDelay: pause,
          },
          "-=" + speed
        )
        .add(
          {
            targets: ".card-1, .card-1 *",
            translateX: ["0%", "50%"],
            opacity: [1, 0],
            delay: anime.stagger(delay, {
              direction: "reverse",
            }),
            changeComplete: function () {
              $(".card-1").addClass("hide");
              $(".card-2").removeClass("hide");
            },
          },
          "-=" + speed
        )
        /** animate card #2 */
        .add(
          {
            targets: ".card-2, .card-2 *",
            translateX: ["50%", "0%"],
            opacity: [0, 1],
            delay: anime.stagger(delay),
            endDelay: pause,
          },
          "-=" + speed / 2
        )
        .add(
          {
            targets: ".card-2, .card-2 *",
            translateX: ["0%", "50%"],
            delay: anime.stagger(delay, {
              direction: "reverse",
            }),
            opacity: [1, 0],
            changeComplete: function () {
              $(".card-2").addClass("hide");
              $(".card-3").removeClass("hide");
            },
          },
          "-=" + speed
        )
        /** animate card #3 */
        .add(
          {
            targets: ".card-3, .card-3 *",
            translateX: ["50%", "0%"],
            opacity: [0, 1],
            delay: anime.stagger(delay),
            endDelay: pause,
          },
          "-=" + speed / 2
        )
        .add(
          {
            targets: ".card-3, .card-3 *",
            translateX: ["0%", "50%"],
            delay: anime.stagger(delay, {
              direction: "reverse",
            }),
            opacity: [1, 0],
            changeComplete: function () {
              $(".card-3").addClass("hide");
              $(".card-1").removeClass("hide");
            },
          },
          "-=" + speed
        )
        /** fade-out */
        .add(
          {
            targets: ".heading, .photo",
            translateX: ["0%", "-100%"],
            opacity: [1, 0],
            delay: anime.stagger(delay),
          },
          "-=" + speed / 2
        )
        .add({
          targets: "#template",
          easing: "easeInOutSine",
          opacity: [1, 0],
        });

    animation.play();
  }

  function renderEmployee(photo) {
    var img = new Image();

    img.onload = function () {
      $(".name").html(photo.user.displayName);
      $(".title").html(photo.jobTitle.title);
      $(".heading").html(photo.jobTitle.templateValues.heading.value);
      $(".message").html(photo.jobTitle.templateValues.message.value);
      $(".legal").html(photo.jobTitle.templateValues.legal.value);
      $(".license").html(photo.jobTitle.templateValues.mloLicense.value);
      $(".img").attr("src", photo.pathname).show();
      animate();
    };

    img.src = photo.pathname;
  }

  function videoFallback() {
    fallback.play();
    fallback.style.display = "block";
    bgVideo.style.display = "none";
  }

  function onTemplateError() {
    console.log("errr");
    // renderEmployee(example);
    videoFallback();
  }

  function init() {
    getStaff(renderEmployee, onTemplateError);
  }

  window.addEventListener("sdk-fail", function (e) {
    onTemplateError();
  });

  window.addEventListener("sdk-ready", function (e) {
    /**
     * e.detail contains the PlayerSDK object.
     * It is also attached at window.parent.PlayerSDK
     */
    // console.log(e.detail);

    init();
  });
})();
