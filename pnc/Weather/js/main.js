// (function () {

/**
 *  Weather API Functions
 */

function request(filePath, dataType) {
    var dfd = $.Deferred();
    $.ajax({
        url: filePath,
        type: "GET",
        dataType: dataType,
        error: function () {
            return dfd.resolve({
                status: 400
            });
        },
        success: function (response) {
            return dfd.resolve(response);
        }
    });
    return dfd.promise();
}

function getWeather(filePath, zipCode) {
    var url = new URL(window.location.href);
    return $.when(
        // request(filePath + zipCode + ".json", "JSON") // Retail server
        request(filePath + zipCode, "JSON")
    )
}

function getDate() {
    $("#date").html(moment().format('DD'));
    $("#month").html(moment().format('MMMM'));
}

function getTime() {
    var currentTime = moment().format('h:mm');
    var currentmeridiem = moment().format('A');
    var timeRefresh = 60000;
    $("#time").html(currentTime);
    $("#meridiem").html(currentmeridiem);
    setInterval(function () {
        getTime();
    }, timeRefresh);
}

/**
 *  Weather Content Functions
 */

/* function setWeather(weather) {
    var location = weather.Locations[0] || {};
    var current = location.WeatherItems[0] || {};
    var forecast = location.WeatherItems.slice(1, 6) || {};
    var iconPath = "assets/img/icons/";

    $("#current-location").text(location.City);
    $("#current-temp").text(current.HighTempF + "°");
    $("#current-condition").text(current.Description);
    $("#current-icon").attr("src", iconPath + getIcon(current.ConditionCode));
    $("#forecast .day").each(function (i, el) {
        var $el = $(el);
        $el.find(".icon").attr("src", iconPath + getIcon(forecast[i].ConditionCode));
        $el.find(".forecast-day").text(moment(forecast[i].DateTime).format('dddd'));
        $el.find(".description").text(forecast[i].ShortDescription);
        $el.find(".forecast-temp").text(forecast[i].HighTempF + "°");
    });
    $("#today").text("Today");
}

function weatherVideoUpdate(response) {
    function handler(event) {
        const eventItem = event.target;
        const current = Math.round(eventItem.currentTime * 1000);
        const total = Math.round(eventItem.duration * 1000);
        // console.log(current, total)
        if ((total - current) < $aosDuration) {
            eventItem.removeEventListener("timeupdate", handler);
            // Start animations
            setWeather(response);
            $aosInit.addClass("aos-animate");
            $revealer.addClass("revealer--animate");
            // Remove intro video
            $bumper.fadeOut($aosDuration, function () {
                $bumper.parent().remove();
            });
        }
    }
    return handler;
}

function weatherVideoEventListeners(response) {
    if (showIntro === 0) {
        $aosInit.addClass("aos-animate");
        setWeather(response);
        return;
    }
    var handler = weatherVideoUpdate(response);
    $bumper[0].addEventListener("timeupdate", handler);
}


function loadWeather() {
    var location = zipcode + ".json";
    var local = localFeeds['weather'];
    var server = serverFeeds['weather'];
    var imageURL = serverFeeds['weatherimg'] + zipcode + ".jpg";
    getWeather(local, "weather.json")
        .done(function (response) {
            if (response.status !== 400) {
                console.log("Fetching local data..");
                console.log(response.Locations[0]);
                $(".photo").css("background-image", "url(" + local + "weather.jpg")
                $bumper.attr("src", "./assets" + introVideo);
                $aosInit.removeClass("aos-animate");
                weatherVideoEventListeners(response, local);
            } else {
                return getWeather(server, location)
                    .done(function (response) {
                        console.log("Local data not found. Fetching server data..");
                        console.log("source: " + server + location);
                        $(".photo").css("background-image", "url('" + imageURL + "')");
                        $bumper.attr("src", serverFeeds['assets'] + feed + introVideo);
                        $aosInit.removeClass("aos-animate");
                        weatherVideoEventListeners(response, server);
                    });
            }
        });
}

function init() {
    getDate();
    getTime();
    loadWeather();
}

init(); */

// })();