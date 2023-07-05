window.Utilities = {
    postMessage(message) {
       // TODO: implement communication btw extension and content scripts
        console.log(message);
    },
    getYouTubeURL() {
        try {
            var url = decodeURIComponent(window.location.href.split('url=')[1]);
            if (url.indexOf('https://www.youtube.com/watch') !== 0) {
                return null;
            }
            return url;
        } catch (error) {
            return null;
        }
    },

    getYouTubeVideoID(){

    },

    search(value, timestamped_caption) {
        var results = [];
        var words = value.toLowerCase().replace(/[^a-z0-9\s]/gim, '').trim().split(' ').filter(word => word);

        if (words.length === 0) {
            return [];
        }
        //TODO: Perform search on timestamped caption
        //return dummy results for now

        results = [
            {
                time: 100,
                word: 'dummy',
                right: ['results', 'to', 'display']
            }, {
                time: 200,
                word: 'dummy',
                right: ['results', 'to', 'display']
            }, {
                time: 300,
                word: 'dummy',
                right: ['results', 'to', 'display']
            }
        ]
        return results;
    },

    fetchTimestampedCaption(url){
        return [
            {
                time: 100,
                word: 'dummy',
                right: ['results', 'to', 'display']
            }, {
                time: 200,
                word: 'dummy',
                right: ['results', 'to', 'display']
            }, {
                time: 300,
                word: 'dummy',
                right: ['results', 'to', 'display']
            }
        ]
    },

    formatTime(time) {
        let hrs = ~~(time / 3600);
        let mins = ~~((time % 3600) / 60);
        let secs = ~~time % 60;
        let formattedTime = "";
        if (hrs > 0) {
            formattedTime += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }
        formattedTime += "" + mins + ":" + (secs < 10 ? "0" : "");
        formattedTime += "" + secs;
        return formattedTime;
    }
};