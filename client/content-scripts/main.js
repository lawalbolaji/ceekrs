

caption = Utilities.fetchTimestampedCaption();

const state = {
    SEARCH_BOX: null,
    YOUTUBE_PLAYER: null,
    SEARCH_BOX_ID: "SEARCH_FRAME",
    SEARCH_BUTTON_ID: "SEARCH",
    SEARCH_BOX_VISIBILITY: false,
    YOUTUBE_RIGHT_CONTROLS: null,
    YOUTUBE_PLAYER_SEARCH_BUTTON: null, 
    SEARCH_SVG_HTML: `<svg width="56%" height="100%" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
        <path fill="#ff8fff" d="M1216 832q0-185-131.5-316.5t-316.5-131.5-316.5 131.5-131.5 316.5 131.5 316.5 316.5 131.5 316.5-131.5 131.5-316.5zm512 832q0 52-38 90t-90 38q-54 0-90-38l-343-342q-179 124-399 124-143 0-273.5-55.5t-225-150-150-225-55.5-273.5 55.5-273.5 150-225 225-150 273.5-55.5 273.5 55.5 225 150 150 225 55.5 273.5q0 220-124 399l343 343q37 37 37 90z"/>
      </svg>`
};

const helpers = {

    onUrlChange(callback) {
        let href = '';
        return setInterval(function () {
            if (href !== window.location.href) {
                href = window.location.href;
                callback(href);
            }
        }, 1)
    },

    isYouTubeVideoUrl(url) {
        return url.indexOf(`https://${window.location.host}/watch`) === 0;
    }
};

const render = {

    searchArea() {

        const searchBox = document.createElement('div');
        searchBox.setAttribute('id', state.SEARCH_BOX_ID);
        searchBox.style = "margin-left:-150px;top:10%;left:50%;position:absolute;z-index:99999;overflow:hidden;display:block;";
        // searchBox.appendChild(input({ ref: "search_input", spellcheck: "false", placeholder: "Search in video...", autocomplete: "off" }))
        return searchBox;
    },

    searchBoxElements() {
        const searchArea = render.searchArea()
        const divWithClass = (className, children) => div({ className, children })
        searchArea.appendChild(
            divWithClass("container",
                divWithClass("relative", SearchInput({caption}))));

                return searchArea;
    },

    baseButton() {
        const button = document.createElement("button");
        button.style.display = "inline";
        button.style.textAlign = "center";
        button.classList.add("ytp-button");
        return button;
    },

    searchButton() {
        const button = render.baseButton();
        button.setAttribute('id', state.SEARCH_BUTTON_ID);
        button.innerHTML = state.SEARCH_SVG_HTML;
        button.addEventListener("click", () => {
            state.SEARCH_BOX_VISIBILITY = !state.SEARCH_BOX_VISIBILITY;
            render.renderCurrentState();
            state.SEARCH_BOX.focus();
        });
        return button;
    },

    renderCurrentState() {

        if (!state.SEARCH_BOX_VISIBILITY) {
            if (!state.SEARCH_BOX.style.display !== 'none') {
                state.SEARCH_BOX.style.display = 'none'
            }
            return;
        }

        if (state.YOUTUBE_PLAYER.classList.contains('ytp-autohide')) {
            if (state.SEARCH_BOX.style.display !== "none") {
                state.SEARCH_BOX.style.display = "none";
            }
        } else {
            if (state.SEARCH_BOX.style.display !== "block") {
                state.SEARCH_BOX.style.display = "block";
            }
        }
    }

}


function main(url) {
    state.SEARCH_BOX_VISIBILITY = false

    if (!state.SEARCH_BOX) {
        state.SEARCH_BOX = render.searchBoxElements();
    }

    if (!helpers.isYouTubeVideoUrl(url)) {
        state.SEARCH_BOX.style.display = 'none';

        return;
    }

    state.YOUTUBE_PLAYER = document.querySelector('.html5-video-player');

    if (!document.getElementById(state.SEARCH_BOX_ID)) {
        if (state.YOUTUBE_PLAYER) {

            state.YOUTUBE_PLAYER.appendChild(state.SEARCH_BOX);
            state.YOUTUBE_PLAYER_SEARCH_BUTTON = render.searchButton();

            state.YOUTUBE_RIGHT_CONTROLS = state.YOUTUBE_PLAYER.querySelector('.ytp-right-controls');
            state.YOUTUBE_RIGHT_CONTROLS.insertBefore(state.YOUTUBE_PLAYER_SEARCH_BUTTON, state.YOUTUBE_RIGHT_CONTROLS.firstChild);

        }
    }
}

helpers.onUrlChange(main);
setInterval(render.renderCurrentState, 1);


