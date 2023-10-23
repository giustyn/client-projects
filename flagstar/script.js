(function () {
  let dataUrl =
    "https://kitchen.screenfeed.com/weather/v2/data/40778ps5v9ke2m2nf22wpqk0sj.json?current=true&location=";

  let backgrounds = {
    Morning: [
      {
        Label: "Morning Option A",
        Url: "./img/Morning_A.jpg",
        code: {
          hex: "#000",
        },
      },
      {
        Label: "Morning Option B",
        Url: "./img/Morning_B.jpg",
        code: {
          hex: "#000",
        },
      },
      {
        Label: "Morning Option C",
        Url: "./img/Morning_C.jpg",
        code: {
          hex: "#000",
        },
      },
    ],
    Afternoon: [
      {
        Label: "Afternoon Option A",
        Url: "./img/Afternoon_A.jpg",
        code: {
          hex: "#000",
        },
      },
      {
        Label: "Afternoon Option B",
        Url: "./img/Afternoon_B.jpg",
        code: {
          hex: "#000",
        },
      },
      {
        Label: "Afternoon Option C",
        Url: "./img/Afternoon_C.jpg",
        code: {
          hex: "#000",
        },
      },
    ],
    Evening: [
      {
        Label: "Evening Option A",
        Url: "./img/Evening_A.jpg",
        code: {
          hex: "#000",
        },
      },
      {
        Label: "Evening Option B",
        Url: "./img/Evening_B.jpg",
        code: {
          hex: "#000",
        },
      },
      {
        Label: "Evening Option C",
        Url: "./img/Evening_C.jpg",
        code: {
          hex: "#000",
        },
      },
    ],
  };

  function dayPart() {
    var oneDate = new Date();
    var theHour = oneDate.getHours();
    if (theHour < 12) {
      return "morning";
    } else if (theHour < 18) {
      return "afternoon";
    } else {
      return "evening";
    }
  }

  document.body.className = dayPart();
})();
