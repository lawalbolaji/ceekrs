import "vite/modulepreload-polyfill";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App.jsx";
import SearchIcon from "./assets/search.icon.svg";
import "./index.css";

window.addEventListener("load", function () {
  const events = {
    ACTION_CLICKED: "ACTION_CLICKED",
  };

  const _global = (function stateHandler() {
    let isVisible = 0;

    return Object.freeze({
      toggleVisibility() {
        isVisible = +!isVisible;
      },
      getVisibility() {
        return isVisible;
      },
    });
  })();

  function _render() {
    if (_global.getVisibility() === 0) {
      const player = document.querySelector("#player");
      if (player !== null) {
        if (document.querySelector(".ceekrs-box") !== null) return true;
        const entryNode = document.createElement("div");
        entryNode.classList.add("ceekrs-box");

        const tearDownRoot = () => {
          entryNode.remove();
          _global.toggleVisibility();
        };

        player.appendChild(entryNode);
        ReactDOM.createRoot(entryNode).render(
          <React.StrictMode>
            <App tearDownRoot={tearDownRoot} />
          </React.StrictMode>
        );

        _global.toggleVisibility();
      }

      // sendResponse({ action: "ACK" });
      return true;
    }

    // tear down search
    const box = document.querySelector(".ceekrs-box");
    if (box !== null) {
      box.remove();

      _global.toggleVisibility();
      return true;
    }
  }

  // add search button to btn controls list
  (function () {
    const btnImage = document.createElement("img");
    btnImage.alt = "search icon";
    btnImage.src = chrome.runtime.getURL(SearchIcon);
    btnImage.style.scale = ".5";

    const searchBtn = document.createElement("button");
    searchBtn.style.textAlign = "center";
    searchBtn.classList.add("ytp-button");
    searchBtn.append(btnImage);
    searchBtn.addEventListener("click", () => _render());

    const ytRightControls = document
      .querySelector("#container .html5-video-player")
      .querySelector(".ytp-right-controls");
    ytRightControls.insertBefore(searchBtn, ytRightControls.firstChild);
  })();

  // eslint-disable-next-line no-unused-vars
  chrome.runtime.onMessage.addListener(async (message, _, sendResponse) => {
    if ((message.event = events.ACTION_CLICKED)) {
      _render();
    }

    return true;
  });
});

/* 
  TODOS:
    - mount ceekrs on wide-player as well

    fullscreenbtn = .ytp-fullscreen-button | key press "f"
    midscreenbtn = .ytp-size-button | key press "t"
 */
