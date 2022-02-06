/**
 *  API Components
 */

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const isOverflown = ({ clientHeight, scrollHeight }) =>
  scrollHeight > clientHeight;
const resizeText = ({
  element,
  elements,
  minSize = 1,
  maxSize = 3,
  step = 0.01,
  unit = "em",
}) => {
  (elements || [element]).forEach((el) => {
    let i = minSize;
    let overflow = false;

    const parent = el.parentNode;

    while (!overflow && i < maxSize) {
      el.style.fontSize = `${i}${unit}`;
      overflow = isOverflown(parent);

      if (!overflow) i += step;
    }
    // revert to last state where no overflow happened
    el.style.fontSize = `${i - step}${unit}`;
  });
};

const isolateTag = ({ element, elements }) => {
  (elements || [element]).forEach((el) => {
    let hashTag = $(el)
      .last()
      .html()
      .replace(/(^|\s)(#[a-z\d-]+)/gi, "$1<span class='hashtag'>$2</span>");
    $(el).last().html(hashTag);
  });
};

function ExtendedURL(href) {
  this.url = new URL(href);
  this.getSearchParam = function (param) {
    return this.url.searchParams.get(param);
  };
  return this;
}

function get(filePath) {
  var url = new URL(window.location.href);
  return $.when(request(filePath, "JSON"));
}

function request(filePath, dataType) {
  var dfd = $.Deferred();
  $.ajax({
    url: filePath,
    type: "GET",
    dataType: dataType,
    error: function () {
      return dfd.resolve({
        status: 400,
      });
    },
    success: function (response) {
      return dfd.resolve(response);
    },
  });
  return dfd.promise();
}
