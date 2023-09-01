import $ from "jquery";

export function preloadImage (src: string): void {
  const image = new Image();
  image.src = src;
}

export const isOverflown = ({ clientHeight, scrollHeight }: HTMLElement) => {
  return scrollHeight > clientHeight;
};

export const resizeText = (elements: Element[]): void => {
  const minSize = 0.5;
  const maxSize = 2.5;
  const step = 0.01;
  const unit = "em";
  for (const el of elements as HTMLElement[]) {
    let i = minSize;
    let overflow = false;
    const parent = el.parentNode;

    while (!overflow && i < maxSize) {
      el.style.fontSize = `${i}${unit}`;
      overflow = isOverflown(parent as any);
      if (!overflow) i += step;
    }
    // revert to last state where no overflow happened
    el.style.fontSize = `${i - step}${unit}`;
  }
};

export const isolateTag = (elements: Element[]): void => {
  for (const el of elements) {
    const hashTag = $(el)
      .last()
      .html()
      .replace(/(^|\s)(#[a-z\d-]+)/gi, "$1<span class='hashtag'>$2</span>");
    $(el).last().html(hashTag);
  }
};

export class Revealer {
  elem: HTMLElement | null;

  constructor(selector = ".revealer", private delay = 2000) {
    this.elem = document.querySelector(selector);
  }

  reveal = () => {
    this.elem?.classList.add("revealer-animate-in");
    setTimeout(() => {
      this.elem?.classList.remove("revealer-animate-in");
    }, this.delay);
  };
}
