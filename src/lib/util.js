export function search(value, timedTextList) {
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

export async function _getCaptionsSourceUrl(videoUrl) {
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
export async function _downloadRawXMLCaptions(url) {
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

export function _parseXmlCaptions(xml) {
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

export function fancyTimeFormat(time) {
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
