(function () {
  let questions = [],
    current = 0,
    timerDuration = 30000;

  function populateQuestion(data) {
    let circle = document.querySelector("circle");
    let radius = circle.r.baseVal.value;
    let circumference = radius * 2 * Math.PI;

    circle.style.strokeDasharray = `${circumference} ${circumference}`;

    let timeleft = 10;
    let downloadTimer = setInterval(function () {
      if (timeleft <= 0) {
        clearInterval(downloadTimer);
        data.Answer.split(", ").forEach((answer) =>
          document.getElementById(`answers-${answer}`).classList.add("bold")
        );
        if (data.Answer.length > 1) {
          document.getElementById("timer").classList.add("small");
        }
        document.getElementById("timer").innerText = data.Answer;
        document.getElementById("timer").classList.add("done");
        circle.style.strokeDashoffset = 0;
      } else {
        document.getElementById("timer").innerText = timeleft;
        timeleft -= 1;
        const offset =
          circumference - (((10 - timeleft) * 10) / 100) * circumference;
        circle.style.strokeDashoffset = offset;
      }
    }, 1000);

    document.getElementById("page2").classList.add("hidden");
    document.getElementById("page3").classList.add("hidden");
    document.getElementById("question").innerText = data.Question;
    document.getElementById("answers-A").classList.remove("bold");
    document.getElementById("answers-B").classList.remove("bold");
    document.getElementById("answers-C").classList.remove("bold");
    document.getElementById("answers-D").classList.remove("bold");
    document.getElementById("timer").classList.remove("done");
    document.getElementById("timer").classList.remove("small");
    document.getElementById("timer").innerText = 10;
    document.getElementById("answers-A").innerText = data.A;
    document.getElementById("answers-B").innerText = data.B;
    document.getElementById("answers-C").innerText = data.C;
    document.getElementById("answers-D").innerText = data.D;
    document.getElementById("tip").innerText = data.Tip;
    document.getElementById("cta").innerText = data.CTA;

    let page2timeleft = 16;
    let page2 = setInterval(function () {
      if (page2timeleft <= 0) {
        clearInterval(page2);
        document.getElementById("page2").classList.remove("hidden");
        document.getElementById("page2").classList.add("visible");
      } else {
        page2timeleft -= 1;
      }
    }, 1000);

    let page3timeleft = 22;
    let page3 = setInterval(function () {
      if (page3timeleft <= 0) {
        clearInterval(page3);
        circle.style.strokeDashoffset = `${circumference}`;
        document.getElementById("page3").classList.remove("hidden");
        document.getElementById("page3").classList.add("visible");
      } else {
        page3timeleft -= 1;
      }
    }, 1000);
  }

  function populateQuestions() {
    populateQuestion(questions[current]);
    current = (current + 1) % questions.length;

    setTimeout(populateQuestions, timerDuration);
  }

  function onTemplateError(result) {
    console.warn(result);
    console.warn("could not get data");
  }

  /* Randomize array in-place using Durstenfeld shuffle algorithm */
  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  function onTemplateSuccess(result) {
    console.log(result);
    questions = result.Items.filter((question) => question.isUS);
    shuffleArray(questions);
    populateQuestions();
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
    const data =
      "https://retail.adrenalineamp.com/navori/clients/bmo/trivia/data.json";
    getJsonData(onTemplateSuccess, onTemplateError, data);
  }

  init();
})();
