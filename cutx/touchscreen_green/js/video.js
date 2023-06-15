(function () {
  var video = document.getElementById("myVideo");
  var touchContain = document.getElementById("cutxtouch");

  let inactivityTime = function () {
    let time;
    time = setTimeout(playVid, 120000);
    window.onload = resetTimer;
    document.onload = resetTimer;
    document.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onmousedown = resetTimer; // touchscreen presses
    document.ontouchstart = resetTimer;
    document.onclick = resetTimer; // touchpad clicks
    document.addEventListener("scroll", resetTimer, true); // improved; see comments

    function playVid() {
      video.parentElement.style.display = "block";
      touchContain.style.display = "none";
      touchContain.firstElementChild.src = touchContain.firstElementChild.src;

      clearTimeout(time);
    }
    function resetTimer() {
      clearTimeout(time);
      time = setTimeout(playVid, 120000);
      console.log('reset timer')
    }
  };

  video.addEventListener("click", function () {
    touchContain.style.display = "block";
    video.parentElement.style.display = "none";
    inactivityTime();
  });
})();
