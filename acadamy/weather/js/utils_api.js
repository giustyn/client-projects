/**
 *  Helper Functions
 */

// function request(filePath, dataType) {
//     var dfd = $.Deferred();
//     $.ajax({
//         url: filePath,
//         type: "GET",
//         dataType: (dataType || "JSON"),
//         error: function () {
//             return dfd.resolve({
//                 status: 400
//             });
//         },
//         success: function (response) {
//             return dfd.resolve(response);
//         }
//     });
//     return dfd.promise();
// }

// function getWeather(filePath) {
//     var url = new URL(window.location.href);
//     return $.when(
//         request(filePath, "JSON")
//     )
// }

function ExtendedURL(href) {
    this.url = new URL(href);
    this.getSearchParam = function (param) {
        return this.url.searchParams.get(param)
    };
    return this;
}

function getDefaultIcon() {
    var hour = moment().format("H");
    if (hour < 4 && hour > 16) return '32.svg';
    else if (hour >= 4 && hour < 6) return '32.svg';
    else return '32.svg';
}

function getIcon(e) {
    switch (e) {
        case "am_pcloudy":
            return "30.svg";
        case "am_pcloudyr":
            return "39.svg";
        case "am_showers":
            return "11.svg";
        case "am_showshowers":
            return "16.svg";
        case "am_snowshowers":
            return "16.svg";
        case "am_tstorm":
            return "37.svg";
        case "blizzard":
            return "14.svg";
        case "blizzardn":
            return "46.svg";
        case "blowingsnow":
            return "43.svg";
        case "blowingsnown":
            return "43.svg";
        case "chancetstorm":
            return "37.svg";
        case "chancetstormn":
            return "47.svg";
        case "clear":
            return "32.svg";
        case "clearn":
            return "33.svg";
        case "clearw":
            return "32.svg";
        case "clearwn":
            return "33.svg";
        case "cloudy":
            return "26.svg";
        case "cloudyn":
            return "27.svg";
        case "cloudyw":
            return "26.svg";
        case "cloudywn":
            return "27.svg";
        case "drizzle":
            return "40.svg";
        case "drizzlef":
            return "09.svg";
        case "drizzlen":
            return "09.svg";
        case "dust":
            return "19.svg";
        case "dustn":
            return "19.svg";
        case "fair":
            return "34.svg";
        case "fairn":
            return "33.svg";
        case "fairw":
            return "34.svg";
        case "fairwn":
            return "33.svg";
        case "fdrizzle":
            return "10.svg";
        case "fdrizzlen":
            return "10.svg";
        case "flurries":
            return "16.svg";
        case "flurriesn":
            return "46.svg";
        case "flurriesw":
            return "43.svg";
        case "flurrieswn":
            return "43.svg";
        case "fog":
            return "20.svg";
        case "fogn":
            return "20.svg";
        case "freezingrain":
            return "07.svg";
        case "freezingrainn":
            return "07.svg";
        case "hazy":
            return "21.svg";
        case "hazyn":
            return "21.svg";
        case "mcloudy":
            return "28.svg";
        case "mcloudyn":
            return "27.svg";
        case "mcloudyr":
            return "39.svg";
        case "mcloudyrn":
            return "45.svg";
        case "mcloudyrw":
            return "39.svg";
        case "mcloudyrwn":
            return "45.svg";
        case "mcloudys":
            return "16.svg";
        case "mcloudysfn":
            return "46.svg";
        case "mcloudysfw":
            return "43.svg";
        case "mcloudysfwn":
            return "43.svg";
        case "mcloudysn":
            return "46.svg";
        case "mcloudysw":
            return "43.svg";
        case "mcloudyswn":
            return "43.svg";
        case "mcloudyt":
            return "37.svg";
        case "mcloudytn":
            return "47.svg";
        case "mcloudytw":
            return "37.svg";
        case "mcloudytwn":
            return "47.svg";
        case "mcloudyw":
            return "28.svg";
        case "mcloudywn":
            return "27.svg";
        case "na":
            return "na.svg";
        case "pcloudy":
            return "30.svg";
        case "pcloudyn":
            return "29.svg";
        case "pcloudyr":
            return "39.svg";
        case "pcloudyrn":
            return "45.svg";
        case "pcloudyrw":
            return "39.svg";
        case "pcloudyrwn":
            return "45.svg";
        case "pcloudys":
            return "16.svg";
        case "pcloudysf":
            return "16.svg";
        case "pcloudysfn":
            return "46.svg";
        case "pcloudysfw":
            return "16.svg";
        case "pcloudysfwn":
            return "46.svg";
        case "pcloudysn":
            return "46.svg";
        case "pcloudysw":
            return "16.svg";
        case "pcloudyswn":
            return "46.svg";
        case "pcloudyt":
            return "37.svg";
        case "pcloudytn":
            return "47.svg";
        case "pcloudytw":
            return "37.svg";
        case "pcloudytwn":
            return "47.svg";
        case "pcloudyw":
            return "30.svg";
        case "pcloudywn":
            return "29.svg";
        case "pm_pcloudy":
            return "29.svg";
        case "pm_pcloudyr":
            return "45.svg";
        case "pm_showers":
            return "45.svg";
        case "pm_snowshowers":
            return "46.svg";
        case "pm_tstorm":
            return "47.svg";
        case "rain":
            return "11.svg";
        case "rainandsnow":
            return "05.svg";
        case "rainandsnown":
            return "05.svg";
        case "rainn":
            return "45.svg";
        case "raintosnow":
            return "05.svg";
        case "raintosnown":
            return "05.svg";
        case "rainw":
            return "01.svg";
        case "showers":
            return "11.svg";
        case "showersn":
            return "01.svg";
        case "showersw":
            return "01.svg";
        case "showerswn":
            return "01.svg";
        case "sleet":
            return "07.svg";
        case "sleetn":
            return "07.svg";
        case "sleetsnow":
            return "07.svg";
        case "sleetsnown":
            return "07.svg";
        case "smoke":
            return "22.svg";
        case "smoken":
            return "22.svg";
        case "snow":
            return "42.svg";
        case "snown":
            return "46.svg";
        case "snowshowers":
            return "42.svg";
        case "snowshowersn":
            return "46.svg";
        case "snowshowersw":
            return "43.svg";
        case "snowshowerswn":
            return "43.svg";
        case "snowtorain":
            return "05.svg";
        case "snowtorainn":
            return "05.svg";
        case "snoww":
            return "43.svg";
        case "snowwn":
            return "43.svg";
        case "sunny":
            return "32.svg";
        case "sunnyn":
            return "31.svg";
        case "sunnyw":
            return "32.svg";
        case "sunnywn":
            return "31.svg";
        case "tstorm":
            return "37.svg";
        case "tstormn":
            return "47.svg";
        case "tstormsw":
            return "37.svg";
        case "tstormswn":
            return "47.svg";
        case "tstormw":
            return "37.svg";
        case "tstormwn":
            return "47.svg";
        case "wind":
            return "23.svg";
        case "windn":
            return "23.svg";
        case "wintrymix":
            return "16.svg";
        case "wintrymixn":
            return "46.svg";
        default:
            return getDefaultIcon()
    }
}

function loadMedia(condition) {
    switch (condition) {

        case "na":
        case "clear":
        case "clearn":
        case "clearw":
        case "clearwn":
        case "fair":
        case "fairn":
        case "fairw":
        case "fairwn":
        case "sunny":
        case "sunnyn":
        case "sunnyw":
        case "sunnywn":
        case "mcloudyw":
        case "mcloudywn":
            return "clear";

        case "dust":
        case "dustn":
        case "fog":
        case "fogn":
        case "hazy":
        case "hazyn":
        case "smoke":
        case "smoken":
            return "overcast";

        case "pcloudyw":
        case "pcloudywn":
        case "pm_pcloudy":
        case "pcloudy":
        case "pcloudyn":
        case "am_pcloudy":
        case "am_pcloudyr":
        case "wind":
        case "windn":
            return "partlycloudy";

        case "cloudy":
        case "cloudyn":
        case "cloudyw":
        case "cloudywn":
        case "mcloudy":
            return "cloudy";

        case "am_showers":
        case "am_showshowers":
        case "am_snowshowers":
        case "freezingrain":
        case "freezingrainn":
        case "mcloudyn":
        case "mcloudyr":
        case "mcloudyrn":
        case "mcloudyrw":
        case "mcloudyrwn":
        case "drizzle":
        case "drizzlef":
        case "drizzlen":
        case "fdrizzle":
        case "fdrizzlen":
        case "pcloudyr":
        case "pcloudyrn":
        case "pcloudyrw":
        case "pcloudyrwn":
        case "pm_pcloudyr":
        case "pm_showers":
        case "pm_snowshowers":
        case "rain":
        case "rainandsnow":
        case "rainandsnown":
        case "rainn":
        case "raintosnow":
        case "raintosnown":
        case "rainw":
        case "showers":
        case "showersn":
        case "showersw":
        case "showerswn":
        case "sleet":
        case "sleetn":
        case "sleetsnow":
        case "sleetsnown":
            return "rain";

        case "pcloudyt":
        case "pcloudytn":
        case "pcloudytw":
        case "pcloudytwn":
        case "tstorm":
        case "tstormn":
        case "tstormsw":
        case "tstormswn":
        case "tstormw":
        case "tstormwn":
        case "am_tstorm":
        case "chancetstorm":
        case "chancetstormn":
        case "mcloudyt":
        case "mcloudytn":
        case "mcloudytw":
        case "mcloudytwn":
        case "pm_tstorm":
            return "storm";

        case "blizzard":
        case "blizzardn":
        case "blowingsnow":
        case "blowingsnown":
        case "flurries":
        case "flurriesn":
        case "flurriesw":
        case "flurrieswn":
        case "mcloudys":
        case "mcloudysfn":
        case "mcloudysfw":
        case "mcloudysfwn":
        case "mcloudysn":
        case "mcloudysw":
        case "mcloudyswn":
        case "snow":
        case "snown":
        case "snowshowers":
        case "snowshowersn":
        case "snowshowersw":
        case "snowshowerswn":
        case "snowtorain":
        case "snowtorainn":
        case "snoww":
        case "snowwn":
        case "wintrymix":
        case "wintrymixn":
        case "pcloudys":
        case "pcloudysf":
        case "pcloudysfn":
        case "pcloudysfw":
        case "pcloudysfwn":
        case "pcloudysn":
        case "pcloudysw":
        case "pcloudyswn":
            return "snow";
    }
}