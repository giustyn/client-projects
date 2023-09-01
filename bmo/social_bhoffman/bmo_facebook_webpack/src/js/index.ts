import $ from "jquery";
import { ScreenFeedItem, SocialScreenFeedResponse } from "./types";
import { isolateTag, preloadImage, resizeText, Revealer } from "./utils";

$(() => {
  const slideTemplate = document.querySelector("#slide-template > *");
  const mainElem = document.querySelector("main");
  const revealer = new Revealer();

  function getStoredItems(): ScreenFeedItem[]|null {
    const items = window.localStorage.getItem("bmo-social");
    if (items) {
      return JSON.parse(items);
    }
    return null;
  }

  function getContent (url: string): JQuery.Promise<ScreenFeedItem[]> {
    const deferred = $.Deferred();
    $.ajax({ url })
      .done((data: SocialScreenFeedResponse) => {
        const items = data.Items
          .filter((item) => item.Provider === 26 && item.Images.length === 1 && item.Content)
          .sort((a, b) => new Date(b.CreatedDate).getTime() - new Date(a.CreatedDate).getTime());
        if (window.localStorage) {
          const lItems = getStoredItems();
          window.localStorage.setItem("bmo-social", JSON.stringify(items));
          if (lItems) {
            return deferred.resolve(lItems);
          }
        }
        return deferred.resolve(items);
      })
      .fail((err) => {
        const lItems = getStoredItems();
        if (lItems) {
          return deferred.resolve(lItems);
        }
        return deferred.reject(err);
      });
    return deferred.promise();
  }

  function init () {
    getContent("https://kitchen.screenfeed.com/social/data/6w24z789gena94j8yt3728zgzw.json")
      .done(iterateSlides);
  }

  function createSlide (item: ScreenFeedItem, isLast = false): void {
    revealer.reveal();
    const slide = slideTemplate!.cloneNode(true) as HTMLDivElement;
    const messageElem = slide.querySelector(".message")!;
    messageElem.textContent = item.Content;
    const imgElems = slide.querySelectorAll(".slide-inner-left img");
    for (const elem of imgElems) {
      elem.setAttribute("src", item.Images[0].Url);
    }

    slide.querySelector(".socialicon img")!.setAttribute("src", item.ProviderIcon);
    slide.querySelector(".username")!.textContent = item.User.Name || "BMO";
    slide.querySelector(".useraccount")!.textContent = item.User.Username;
    slide.querySelector(".published")!.textContent = item.DisplayTime;
    slide.querySelector(".usericon img")!.setAttribute("src", item.User.ProfileImageUrl || "./img/bmo-logo.svg");
    mainElem?.appendChild(slide);

    resizeText([messageElem]);

    isolateTag([messageElem]);

    setTimeout(() => {
      slide.classList.add("slide-animate-in");
    }, 500);

    if (!isLast) {
      setTimeout(() => {
        slide.remove();
      }, 12000);
    }
  }

  function iterateSlides (items: ScreenFeedItem[]) {
    let index = 0;
    preloadImage(items[index].Images[0].Url);
    createSlide(items[index]);
    index = index + 1;

    setTimeout(() => {
      preloadImage(items[index].Images[0].Url);
    }, 3000);

    const interval = setInterval(function () {
      if (index < 3) {
        preloadImage(items[index + 1].Images[0].Url);
        createSlide(items[index], index === 2);
        index = index + 1;
      } else {
        clearInterval(interval);
      }
    }, 10000);
  }

  init();
});
