const axios = require("axios");
const cheerio = require("cheerio");
const FormData = require('form-data');
const URL = "https://p.eagate.573.jp/game/sdvx/vi/music/index.html";
const db = require('../database.js');

const getHtml = async () => {
    try {
        return await axios.get(URL, {
            responseEncoding: 'utf8'
        });
    } catch (error) {
        console.error(error);
    }
};

const getPage = async (page) => {
    try {
        let form = new FormData();
        form.append('page', page);
        return await axios.post(URL, form, {
            responseEncoding: 'utf8'
        });
    } catch (error) {
        console.error(error);
    }
};

let musicList = [];
let loadCnt = 0;
const loadComplete = (pages) => {
    console.log(musicList);
    let id = 1;
    for (let page = pages; page >= 1; page--) {
        musicList[page].slice().reverse().forEach(elem => {
            let curId = id++;
            let title = elem.title;
            let artist = elem.artist;

            console.log(curId + ", " + title + ", " + artist);

            const musicQuery = "INSERT INTO music (id, title, artist) VALUES (" + curId + ", \"" + title + "\", \"" + artist + "\")";
            db.query(musicQuery, (err, data, fields) => {
                if (err) throw err;
            });
        });
    }
}

getHtml().then(html => {
    const $ = cheerio.load(html.data);
    let pages = $("#search_page").children().length;
    console.log(pages);
    //pages = 2;

    for (let page = 1; page <= pages; page++) {
        getPage(page).then(html => {
            const $ = cheerio.load(html.data);
            musicList[page] = [];
            const $bodyList = $("#music-result").find(".cat");
            $bodyList.each(function (i, elem) {
                musicList[page][i] = {
                    title: $(this).find('.info p:nth-child(1)').text().replace("(EXIT TUNES)", "").replace(/\"/g, "\\\""),
                    artist: $(this).find('.info p:nth-child(3)').text().replace(/\"/g, "\\\"")
                };
            });

            console.log(page + "페이지 완료!");
            if (++loadCnt == pages) {
                loadComplete(pages);
            }
        });
    }
});