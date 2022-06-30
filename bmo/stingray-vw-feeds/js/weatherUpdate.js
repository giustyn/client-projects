/**
 * Created by dmytro on 10/13/2016.
 */
//(function(){
var currentIcon,
    currentTemp,
    currentHigh,
    currentLow,
    currentFeelsLike,
    currentWindDir,
    currentWindSpeed,
    currentHumid,
    forecast,
    place,
    province,
    city;
var ICONS1 = {
    1: "1",
    2: "2",
    3: "a",
    4: "A",
    5: "v",
    6: "j",
    7: "p",
    8: "3",
    9: "Q",
    10: "K",
    11: "Q",
    12: "T",
    13: "O",
    14: "H",
    15: "H",
    16: "I",
    17: "Z",
    18: "6",
    19: "a",
    20: "a",
    21: "a",
    22: "H",
    23: "l",
    24: "p",
    25: "n",
    26: "h",
    27: "x",
    28: "F",
    29: "f",
    30: "U",
    31: "U",
    32: "U",
    33: "U"
};
var init = function() {
    city = "Toronto"; //city = location.search.substr(1);
    currentIcon = document.getElementById("currentIcon");
    currentTemp = document.getElementById("currentTemp");
    currentHigh = document.getElementById("currentHigh");
    currentLow = document.getElementById("currentLow");
    currentFeelsLike = document.getElementById("currentFeelsLike");
    currentWindDir = document.getElementById("currentWindDir");
    currentWindSpeed = document.getElementById("currentWindSpeed");
    currentHumid = document.getElementById("currentHumid");
    forecast = document.getElementById("forecast").getElementsByClassName("col");
    place = document.getElementById("place");
    province = document.getElementById("prov");
    if (navigator.onLine) {
        console.log("TV online");
        httpGetWeather("http://s3.amazonaws.com/nm-feeds/weather/" + city, function(data) {
            if (data) {
                console.log("Get response and data");
                setWeather(JSON.parse(data)[0]);
            }
        });
    } else {readFile();}
};
var error = function(e) {
    console.log("Error: " + e.message);
};

var readFile = function() {
    console.log("Read file...");
    var callweather = function(str) {
        console.log(JSON.parse(str));
        setWeather(JSON.parse(str));
    };

    var onsuccess = function(files) {
        console.log("Itterate files:" + files.length);

        for (var i = 0, len = files.length; i < len; i++) {
            console.log("Filename" + files[i].name);
            if (files[i].name === "weather.json") {
                files[i].readAsText(callweather, error, "UTF-8");
                break;
            }
        }
    };
    var onResolveSuccess = function(dir) {
        console.log("Resolve documents success");
        dir.listFiles(onsuccess);
    };
    tizen.filesystem.resolve('documents', onResolveSuccess, error, 'r');
};

var deleteFile = function(name,data) {
    var onResolveSuccess = function(dir) {
        var onListFilesSuccess = function(files) {
            files.forEach(function(file) {
                if (!file.isDirectory && file.name === name) {
                    dir.deleteFile(file.fullPath, onDeleteSuccess, error);
                }
            });
        };

        dir.listFiles(onListFilesSuccess, error);
    };

    var onDeleteSuccess = function() {
        console.log('Deleted');
        saveFile(data);
    };
    tizen.filesystem.resolve('documents', onResolveSuccess, error);
};

var saveFile = function(data) {
    console.log("Saving...");
    var onOpenSuccess = function(fs) {
        fs.write(JSON.stringify(data));
        console.log("Saved file ....");
        fs.close();
    };
    var newFile;
    tizen.filesystem.resolve("documents", function(result) {
        console.log("Start create file");
        newFile = result.createFile("weather.json");
        newFile.openStream("rw", onOpenSuccess, error, "UTF-8");
    }, error, "rw");
};

var httpGetWeather = function(theUrl, callback) {
    var xmlhttp = new XMLHttpRequest();
    var response;
    if (xmlhttp.overrideMimeType) {
    	xmlhttp.overrideMimeType('text/xml');
    	}
    xmlhttp.open("GET", theUrl, true);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            response = xmlhttp.responseText;
            xmlhttp = null;
            callback(response);
        }
    };
    xmlhttp.send(null);
};

var setWeather = function(data) {
    console.log(data);
    var current = data.Observations;
    var location = data.Location;
    var week = data.LongTermForecasts;
    var today = week[0];
    place.innerHTML = location.Name;
    province.innerHTML = location.SubDivisionCode;
    currentIcon.innerHTML = ICONS1[current.ObsIcon];
    currentTemp.innerHTML = current.TemperatureC;
    currentHigh.innerHTML = today.TemperatureCMax;
    currentLow.innerHTML = today.TemperatureCMin;
    currentFeelsLike.innerHTML = current.FeelsLikeC;
    currentWindDir.innerHTML = current.WindDirection;
    currentWindSpeed.innerHTML = current.WindSpeedKMH;
    currentHumid.innerHTML = current.HumidityPercent;
    for (var i = 0, len = forecast.length; i < len; i++) {
        var item = forecast[i];
        var weekday = week[i + 1];
        item.getElementsByClassName("forecast-day")[0].innerHTML = weekday.Name;
        item.getElementsByClassName("weather-icon-sm")[0].innerHTML = ICONS1[weekday.FxIconDay];
        item.getElementsByClassName("forecast-temp")[0].innerHTML = weekday.TemperatureCMax + "&deg;";
        console.log("Date = " + weekday.Name + "; icon=" + weekday.FxIconDay + ";temp " + weekday.TemperatureCMax);

    }
    console.log("Done with weather");
    deleteFile("weather.json", data);
};
window.onload = init;
//}());