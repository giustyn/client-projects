(function () {
  let dataUrl =
    "https://kitchen.screenfeed.com/weather/v2/data/40778ps5v9ke2m2nf22wpqk0sj.json?current=true&location=";

  let backgrounds = {
    Morning: [
      { Id: 0, Label: "Morning Option A", Url: "./img/Morning_A.jpg" },
      { Id: 1, Label: "Morning Option B", Url: "./img/Morning_B.jpg" },
      { Id: 2, Label: "Morning Option C", Url: "./img/Morning_C.jpg" },
    ],
    Afternoon: [
      { Id: 0, Label: "Afternoon Option A", Url: "./img/Afternoon_A.jpg" },
      { Id: 1, Label: "Afternoon Option B", Url: "./img/Afternoon_B.jpg" },
      { Id: 2, Label: "Afternoon Option C", Url: "./img/Afternoon_C.jpg" },
    ],
    Evening: [
      { Id: 0, Label: "Evening Option A", Url: "./img/Evening_A.jpg" },
      { Id: 1, Label: "Evening Option B", Url: "./img/Evening_B.jpg" },
      { Id: 2, Label: "Evening Option C", Url: "./img/Evening_C.jpg" },
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
