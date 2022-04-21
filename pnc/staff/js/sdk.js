/**
 * window.parent.PlayerSDK is loaded after the DOMContentLoaded event
 *
 * Must continuously check for PlayerSDK and fire new event when PlayerSDK is available.
 *
 * Add Tag finder method.
 */
function readyPlayerSDK() {
  var checks = 0;
  var intervalId = setInterval(function () {
    checks++;
    if (window.parent.PlayerSDK) {
      clearInterval(intervalId);
      window.parent.PlayerSDK.getTagByPrefix = getTagByPrefix;
      const event = new CustomEvent("sdk-ready", {
        detail: window.parent.PlayerSDK,
      });

      window.dispatchEvent(event);
    } else if (checks > 100) {
      clearInterval(intervalId);
      const event = new CustomEvent("sdk-fail", {
        detail: null,
      });
      window.dispatchEvent(event);
    }
  }, 10);
}

// TODO: Handle non valid NV-ID???
/**
 * Find a tag name by prefix. Workaround to finding the 'nv number'
 * returns a tag object.
 *
 * @param prefix
 * @returns {{ Id: number, Name: string }}
 */
function getTagByPrefix(prefix = "PNC.MPS.") {
  var mpsTag = "";

  var tags = window.parent.PlayerSDK.getTagsPlayer();

  for (var i = 0; i < tags.length; i++) {
    if (tags[i].Name.includes(prefix)) {
      mpsTag = tags[i];
      break;
    }
  }

  return mpsTag;
}

/**
 * Init PlayerSDK search loop. Required to be executed here to use PlayerSDK in other js files.
 */
readyPlayerSDK();

/**
 * Uncomment for developing in the browser.
 */
/* setTimeout(() => {
  window.parent.PlayerSDK = {
    getTagsPlayer: function() {
      // return [{ Id: 1, Name: "Z.MPS.PNC.TEST-PLAYER" }];
      return [{ Id: 1, Name: "PNC.MPS.NV1050" }];
    }
  }
}, 250); */