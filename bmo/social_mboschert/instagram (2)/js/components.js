/**
 *  API Components
 */

const isOverflown = ({ clientHeight, scrollHeight }) =>
  scrollHeight > clientHeight;
const resizeText = ({
  element,
  elements,
  minSize = 0.5,
  maxSize = 2.5,
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
    const html = el[0].innerHTML.replace(
      /(^|\s)(#[a-z\d-]+)/gi,
      "$1<span class='hashtag'>$2</span>"
    );
    el[0].innerHTML = html;
  });
};
