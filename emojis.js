function getJSON(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
};

const EMOJI_MAP_JSON = "./emoji_map.json";

let emojiMap;
getJSON(EMOJI_MAP_JSON, (err, data) => {
    if (err !== null) return;

    emojiMap = data;
});
