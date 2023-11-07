function getVideo(weatherImg) {
  var videoName = weatherImg
    .replace(".png", "")
    .replace("m_", "")
    .split("_")
    .map(function (elem) {
      return elem.replace(/\d+/g, "");
    })
    .join("_");
  // console.log(imgName);
  switch (videoName) {
    case '': // Clear
      return 'clear.mp4';
    case '': // Partly Cloudy
      return 'partlycloudy.mp4';
    case '': // Cloudy
      return 'cloudy.mp4';
    case '': // Overcast
      return 'overcast.mp4';
    case '': // Snow
      return 'snow.mp4';
    case '': // Rain
      return 'rain.mp4';
    case '': // Storm
      return 'storm.mp4';
    default:
      return 'clear.mp4';
  }
  // switch (imgName2) {
  //   case 'skc': // Fair
  //   case 'nskc':
  //     return 'clear.mp4';
  //   case 'few': // A Few Clouds
  //   case 'nfew':
  //   case 'sct': // Partly Cloudy
  //   case 'nsct':
  //     return 'partlycloudy.mp4';
  //   case 'bkn': // Mostly Cloudy
  //   case 'nbkn':
  //     return 'cloudy.mp4';
  //   case 'ovc': // Overcast
  //   case 'novc':
  //     return 'overcast.mp4';
  //   case 'sn': // Snow
  //   case 'nsn':
  //     return 'snow.mp4';
  //   case 'ra_sn': // Rain Snow
  //   case 'nra_sn':
  //   case 'raip': // Rain Ice Pellets
  //   case 'nraip':
  //   case 'fzra': // Freezing Rain
  //   case 'nfzra':
  //   case 'ra_fzra': // Freezing rain rain
  //   case 'nra_fzra':
  //   case 'fzra_sn': // Freezing Rain Snow
  //   case 'nfzra_sn':
  //     return 'rain.mp4';
  //   case 'ip': // Ice Pellets
  //   case 'nip':
  //   case 'snip': // Snow Ice Pellets
  //   case 'nsnip':
  //   case 'blizzard': // Blizard
  //   case 'nblizzard':
  //     return 'snow.mp4';
  //   case 'minus_ra': // Light Rain
  //   case 'hi_shwrs': // Showers in Vicinity
  //   case 'hi_nshwrs':
  //   case 'ra': // Rain
  //   case 'nra':
  //   case 'shra': // Rain Showers
  //   case 'nshra':
  //     return 'rain.mp4';
  //   case 'tsra': // Thunderstorm
  //   case 'ntsra':
  //   case 'scttsra': // Thunderstorm in Vicinity
  //   case 'nsttsra':
  //   case 'hi_tsra': // (Cloud cover < 60%) Thunderstorm in Vicinity
  //   case 'hi_ntsra':
  //   case 'fc': // Funnel Cloud
  //   case 'nfc':
  //   case 'tor': // Tornado
  //   case 'ntor':
  //   case 'hur_warn': // Hurricane Warning
  //   case 'hur_watch': // Hurricane Watch
  //   case 'ts_warn': // Tropical Storm Warning
  //   case 'ts_watch': // Tropical Storm Watch
  //   case 'ts_nowarn': // Tropical Storm Conditions
  //     return 'storm.mp4';
  //   case 'wind_skc': // Windy
  //   case 'nwind_skc':
  //     return 'clear.mp4';
  //   case 'wind_few': // A Few Clouds and Windy
  //   case 'nwind_few':
  //   case 'wind_sct': // Partly Cloudy and Windy
  //   case 'nwind_sct':
  //     return 'partlycloudy.mp4';
  //   case 'wind_bkn': // Mostly Cloudy and Windy
  //   case 'nwind_bkn':
  //     return 'cloudy.mp4';
  //   case 'wind_ovc': // Overcast and Windy
  //   case 'nwind_ovc':
  //     return 'clear.mp4';
  //   case 'du': // Dust
  //   case 'ndu':
  //   case 'fu': // Smoke
  //   case 'nfu':
  //   case 'hz': // Haze
  //   case 'hot': // Hot
  //   case 'cold': // Cold
  //   case 'ncold':
  //   case 'fg': // Fog/Mist
  //   case 'nfg':
  //     return 'overcast.mp4';
  //   default:
  //     return 'clear.mp4';
  // }
}