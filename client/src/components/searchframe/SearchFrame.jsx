/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import CancelIcon from "../../assets/cancel.icon.svg";
import PropTypes from "prop-types";
import { _downloadRawXMLCaptions, _parseXmlCaptions, fancyTimeFormat } from "../../lib/util";
import { useSearchResults } from "../../hooks/useSearchResults";

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
          <img src={`${chrome.runtime.getURL(CancelIcon)}`} alt="close search frame" />
        </button>
      </div>
      <div>
        <p>You can only search in english for now</p>
      </div>
      <div>
        <ResultsComponent results={searchResults.slice(0, 5)} tearDownRoot={tearDownRoot} />
      </div>
    </div>
  );
}

function ResultsComponent({ results, tearDownRoot }) {
  return (
    <div className="ceekrs-search-results">
      {results.map((result, idx) => (
        <div
          key={idx}
          onClick={(e) => {
            document.querySelector("video").currentTime = result.time / 1000; // ms - seconds
            tearDownRoot();
          }}
        >
          <p>
            <span id="ceekrs-timestamp">{`${fancyTimeFormat(result.time / 1000)}`}</span>
            {` - ${result.word} ${result.right.join(" ")}`}
          </p>
        </div>
      ))}
    </div>
  );
}

ResultsComponent.propTypes = {
  results: PropTypes.array.isRequired,
  tearDownRoot: PropTypes.func.isRequired,
};

SearchFrame.propTypes = {
  tearDownRoot: PropTypes.func.isRequired,
};
