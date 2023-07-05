
function SearchInput(props) {

    let SUGGESTIONS_INDEX = -1;

    function renderSearchResultListItem(item) {
        return li({ onClick: () => handleListItemClick(item) }, [
            strong({ innerText: item.word + " " }),
            span({ innerText: item.right.join(" ") }),
            small({ innerText: Utilities.formatTime(item.time / 1000) })
        ])
    }

    function handleListItemClick(item) {
        Utilities.postMessage({
            action: "SKIP",
            payload: item.time / 1000
        });

        $refs.search_input.value = "";
        $refs.dropdown.innerHTML = "";
    }

    function keyboardShortcuts(event) {
        let result = false;
        switch (event.keyCode) {
            case 13:
                if (SUGGESTIONS_INDEX > -1) {
                    $refs.dropdown_ul.children[SUGGESTIONS_INDEX].click();
                }
                result = true;
                break;
            case 38:
                // ArrowUp
                result = true;
                if (SUGGESTIONS_INDEX - 1 >= 0) {
                    if (SUGGESTIONS_INDEX !== null) {
                        $refs.dropdown_ul.children[SUGGESTIONS_INDEX].classList.remove("active");
                    }
                    SUGGESTIONS_INDEX--;
                    $refs.dropdown_ul.children[SUGGESTIONS_INDEX].classList.add("active");
                }
                break;
            case 40:
                // ArrowDown
                result = true;
                if (SUGGESTIONS_INDEX + 1 < $refs.dropdown_ul.children.length) {
                    if (SUGGESTIONS_INDEX >= 0) {
                        $refs.dropdown_ul.children[SUGGESTIONS_INDEX].classList.remove("active");
                    }
                    SUGGESTIONS_INDEX++;
                    $refs.dropdown_ul.children[SUGGESTIONS_INDEX].classList.add("active");
                }
                break;

        }
        return result;
    }

    function handleInput(event) {
        if (keyboardShortcuts(event)) {
            return;
        }

        SUGGESTIONS_INDEX = -1;
        $refs.dropdown.innerHTML = "";

        const value = event.target.value.toLowerCase();

        if (value.length === 0) {
            return;
        }

        $refs.dropdown.appendChild(DropDownList({
            render: renderSearchResultListItem,
            items: Utilities.search(value, props.caption).slice(0, 8)
        }));
    }

    function handleCloseButtonClicked() {
        Utilities.postMessage({ action: "SEARCH.CLOSE" });
    }

    return [
        input({ onKeyUp: handleInput, ref: "search_input", spellcheck: "false", placeholder: "Search in video...", autocomplete: "off" }),
        CloseButton({ onClick: handleCloseButtonClicked }),
        div({ className: "result_list", ref: "dropdown" })
    ];
}

function DropDownList(props) {
    const children = props.items ? props.items.map(props.render) : [];
    return ul({ ref: "dropdown_ul", children });
}


function CloseButton(props) {
    return div({ ...props, className: "close-container", innerHTML: '<svg height="17px" width="17" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <path d="M437.5,386.6L306.9,256l130.6-130.6c14.1-14.1,14.1-36.8,0-50.9c-14.1-14.1-36.8-14.1-50.9,0L256,205.1L125.4,74.5 c-14.1-14.1-36.8-14.1-50.9,0c-14.1,14.1-14.1,36.8,0,50.9L205.1,256L74.5,386.6c-14.1,14.1-14.1,36.8,0,50.9 c14.1,14.1,36.8,14.1,50.9,0L256,306.9l130.6,130.6c14.1,14.1,36.8,14.1,50.9,0C451.5,423.4,451.5,400.6,437.5,386.6z" /> </svg>' });
}