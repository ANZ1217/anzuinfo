const axios = require("axios");
const cheerio = require("cheerio");
const FormData = require('form-data');
const URL = "https://p.eagate.573.jp";
const URL_base = "/game/sdvx/vi/music/index.html";
var fs = require('fs')

const db = require('../database.js');

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const getHtml = async () => {
    try {
        return await axios.get(URL + URL_base, {
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
        return await axios.post(URL + URL_base, form, {
            responseEncoding: 'utf8'
        });
    } catch (error) {
        console.error(error);
    }
};

const getDetail = async (URL_detail) => {
    try {
        return await axios.get(URL + URL_detail, {
            responseEncoding: 'utf8'
        });
    } catch (error) {
        console.error(error);
    }
};

const getImage = async (imageURL) => {
    try {
        return await axios.get(URL + imageURL, {
            responseType: 'arraybuffer'
        });
    } catch (error) {
        console.error(error);
    }
}

async function loadComplete(urlList, page) {
    await sleep((page - 1) * 10000);
    console.log("Awake! :" + page);

    urlList.forEach(elem => {
        getDetail(elem).then(html => {
            const $ = cheerio.load(html.data);
            const $bodyList = $(".cat");
            let title = $(".info p:nth-child(1)").text().replace("(EXIT TUNES)", "").replace(/\"/g, "\\\"");

            const musicQuery = "SELECT id FROM music WHERE BINARY title LIKE \"" + title + "\"";

            db.query(musicQuery, (err, data, fields) => {
                if (err) throw err;

                let musicId = ("0000" + data[0]['id']).slice(-4);

                $bodyList.each(function (i, elem) {
                    let jacket = $(this).find("img").attr("src");
                    let diff = $(this).find("p:nth-child(2)").attr("class");
                    let level = $(this).find("p:nth-child(2)").text();
                    let effect = $(this).find(".effect").text().replace(/\"/g, "\\\"");
                    let illust = $(this).find(".illust").text().replace(/\"/g, "\\\"");

                    let trackId = musicId + diff.charAt(0);

                    getImage(jacket).then(imageResult => {
                        fs.writeFileSync(__dirname + "/../public/images/" + trackId + ".jpg", imageResult.data);
                    });

                    const trackQuery = "INSERT INTO track (id, music_id, diff, level, effect, illust) VALUES (\""
                        + trackId + "\", \"" + musicId + "\", \"" + diff + "\", \"" + level + "\", \"" + effect + "\", \"" + illust + "\")";

                    db.query(trackQuery, (err, data, fields) => {
                        //if (err) throw err;
                    });

                    console.log(trackId + ", " + diff + ", " + level + ", " + effect + ", " + illust);
                });
            });
        });
    });
}

getHtml().then(html => {
    const $ = cheerio.load(html.data);
    let pages = $("#search_page").children().length;
    console.log(pages);

    for (let page = 1; page <= pages; page++) {
        getPage(page).then(html => {
            const $ = cheerio.load(html.data);
            const $bodyList = $("#music-result").find(".jk").find("a");

            urlList = [];
            $bodyList.each(function (i, elem) {
                urlList.push($(this).attr("href"));
            });

            loadComplete(urlList, page);
            console.log(page + "페이지 완료!");
        });
    }
});