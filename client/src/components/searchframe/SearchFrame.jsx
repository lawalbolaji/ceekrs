/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useRef, useState } from "react";
import CancelIcon from "../../assets/cancel.icon.svg";
import PropTypes from "prop-types";

function search(value, timedTextList) {
  var results = [];
  var words = value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gim, "")
    .trim()
    .split(" ")
    .filter((word) => word);

  if (words.length === 0) {
    return [];
  }

  for (let i = 0; i < timedTextList.length; i++) {
    var matches = [];
    for (let j = 0; j < words.length; j++) {
      if (i + j >= timedTextList.length) {
        continue;
      }
      let word = words[j];
      if (timedTextList[i + j].word.indexOf(word) === 0) {
        matches.push({
          word: timedTextList[i + j].word,
          time: timedTextList[i + j].time,
          right: timedTextList.slice(i + j + 1, i + j + 4).map((_) => _.word),
        });
      }
    }
    if (matches.length === words.length) {
      results.push({
        time: matches[0].time,
        word: matches.map((_) => _.word).join(" "),
        right: matches[matches.length - 1].right,
      });
    }
  }

  return results;
}

async function _getCaptionsSourceUrl(videoUrl) {
  try {
    let res = await fetch(videoUrl);
    if (res.ok) {
      let html = await res.text();
      let languages = html.split("https://www.youtube.com/api/timedtext");
      for (let i = 0; i < languages.length; i++) {
        if (languages[i].indexOf("lang=en") !== -1) {
          let url = languages[i].split('","')[0];
          if (url.length < 1000) {
            let json =
              '{"url":"https://www.youtube.com/api/timedtext' + url + '"}';
            return (
              JSON.parse(json).url + "&lang=en&fmt=srv3&xorb=2&xobt=3&xovt=3"
            );
          }
        }
      }
    }

    throw new Error(`failed to download resources from ${videoUrl}`);
  } catch (error) {
    return null;
  }
}

// will return empty string onError
async function _downloadRawXMLCaptions(url) {
  let timedtextURL = await _getCaptionsSourceUrl(url);
  if (timedtextURL === null) return "";

  try {
    let res = await fetch(timedtextURL);
    if (res.ok) {
      let text = await res.text();
      return text;
    }
  } catch (error) {
    return "";
  }
}

function _parseTimedText(xml) {
  try {
    let jsonTimedText = [];
    let xmlDocument = document.implementation.createHTMLDocument("");
    xmlDocument.write(xml);

    Array.from(xmlDocument.querySelectorAll("p")).forEach((p) => {
      let time = parseInt(p.getAttribute("t"));
      let text = p.innerText
        .toLowerCase()
        .replace(/\n/gi, " ")
        .replace(/\[.*\]/gim, "")
        .replace(/\(.*\)/gim, "")
        .replace(/[^a-z0-9\s]/gim, "")
        .trim();

      if (text.length < 1) return;

      let words = text.split(" ");
      words.forEach((word) => {
        if (!word) return;

        jsonTimedText.push({
          word: word,
          time,
        });
      });
    });

    return jsonTimedText; // [{word: string, text: string}]
  } catch (error) {
    console.error("error parsing supplied xml string");
    return [];
  }
}

function fancyTimeFormat(time) {
  let hrs = ~~(time / 3600);
  let mins = ~~((time % 3600) / 60);
  let secs = ~~time % 60;
  let ret = "";
  if (hrs > 0) {
    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }
  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs;
  return ret;
}

function useSearchResults(searchTerm) {
  // const url = "https://www.youtube.com/watch?v=S9lewpdPlf8"; // for testing
  const url = window.location.href;
  const [captions, setCaptions] = useState([]); // todo: replace with [] once you are able to fetch captions safely

  const loadCap = useCallback(() => {
    (async () => {
      console.log("bootstrapping search");
      const donwloadedCaptions = _parseTimedText(
        await _downloadRawXMLCaptions(url)
      );
      setCaptions((captions) => [...donwloadedCaptions]);
    })();
  }, [url, setCaptions]);

  useEffect(() => {
    loadCap(); // this will trigger a CORS error in the browser in our sanboxed dev env since it is served out of localhost and the captions are @youtube
    // temp fix: we wither need another way to fetch the caption or move this to the server
  }, [url, loadCap]);

  return search(searchTerm, captions).slice(0, 5); // [{word: string, time: number, right: string}]
}

export function SearchFrame({ tearDownRoot }) {
  const [searchTerm, setSearchTerm] = useState("");
  const searchResults = useSearchResults(searchTerm);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div className="ceekrs-overlay-wrapper">
      <div className="ceekrs-searchbox-wrapper">
        <input
          type="text"
          placeholder="Search in Video"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          ref={inputRef}
        />
        <button onClick={() => tearDownRoot()}>
          <img
            src={`${chrome.runtime.getURL(CancelIcon)}`}
            alt="close search frame"
          />
        </button>
      </div>
      <div>
        <p>You can only search in english for now</p>
      </div>
      <div>
        <ResultsComponent results={searchResults} />
      </div>
    </div>
  );
}

function ResultsComponent(props) {
  return (
    <div>
      {props.results.map((result, idx) => (
        <div
          key={idx}
          onClick={(e) => {
            // register the time and let the player update
            console.log({ e });
          }}
        >
          <p>
            <span>{`${fancyTimeFormat(result.time / 1000)}`}</span>
            {` - ${result.word} ${result.right.join(" ")}`}
          </p>
        </div>
      ))}
    </div>
  );
}

ResultsComponent.propTypes = {
  results: PropTypes.array.isRequired,
};

SearchFrame.propTypes = {
  tearDownRoot: PropTypes.func.isRequired,
};
