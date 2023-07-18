import { useCallback, useEffect, useState } from "react";
import { _downloadRawXMLCaptions, _parseXmlCaptions, search } from "../lib/util";

export function useSearchResults(searchTerm) {
  const url = window.location.href;
  const [captions, setCaptions] = useState([]); // todo: replace with [] once you are able to fetch captions safely

  const loadCap = useCallback(() => {
    (async () => {
      console.log("bootstrapping search");
      const downloadedCaptions = _parseXmlCaptions(
        await _downloadRawXMLCaptions(url)
      );
      setCaptions(() => [...downloadedCaptions]);
    })();
  }, [url, setCaptions]);

  useEffect(() => {
    loadCap();
  }, [url, loadCap]);

  return search(searchTerm, captions).slice(0, 5); // [{word: string, time: number, right: string}]
}
