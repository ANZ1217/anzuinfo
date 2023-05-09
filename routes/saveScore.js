const express = require('express');
const moment = require('moment');
const router = express.Router();
const db = require('../database.js');

const diffDict = {
    "novice": "diff = 'nov'",
    "advanced": "diff = 'adv'",
    "exhaust": "diff = 'exh'",
    "maximum": "diff = 'mxm'",
    "infinite": "(diff = 'inf' OR diff = 'grv' OR diff = 'hvn' OR diff = 'vvd' OR diff = 'xcd')"
};

function forceMul(score) {
    if (score >= 9900000) return 1.05;
    else if (score >= 9800000) return 1.02;
    else if (score >= 9700000) return 1.00;
    else if (score >= 9500000) return 0.97;
    else if (score >= 9300000) return 0.94;
    else if (score >= 9000000) return 0.91;
    else if (score >= 8700000) return 0.88;
    else if (score >= 7500000) return 0.85;
    else if (score >= 6500000) return 0.82;
    else return 0.79;
}

function clearMul(clear) {
    if (clear == 'per') return 1.10;
    else if (clear == 'uc') return 1.05;
    else if (clear == 'comp_ex') return 1.02;
    else if (clear == 'comp') return 1.00;
    else return 0.50;
}

function getVolforce(level, clear, score) {
    return parseInt((level * 2) * (score / 10000) / 1000 * forceMul(score) * clearMul(clear) * 10) / 10;
}

router.post('/', function (req, res, next) {
    const userData = req.body.user.split('\t');
    const tmpTrackData = req.body.track.split('|');
    const trackData = [];
    tmpTrackData.forEach(elem => {
        trackData.push(elem.split('\t'));
    });

    let id = userData[0].replace("SV", "").replace(/-/g, "");
    let name = userData[1];
    let skill = userData[3];
    if (skill == "inf") skill = 12;
    let skill2 = 0;
    let volforce = userData[2];
    let playCount = userData[4];
    let updateTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

    const userQuery = "INSERT INTO user (id, name, skill, skill2, volforce, playcount, updatetime) VALUES ("
        + id + ", \"" + name + "\", " + skill + ", " + skill2 + ", " + volforce
        + ", " + playCount + ", \"" + updateTime + "\") ON DUPLICATE KEY UPDATE "
        + "name = \"" + name + "\", "
        + "skill = " + skill + ", "
        + "skill2 = " + skill2 + ", "
        + "volforce = " + volforce + ", "
        + "playcount = " + playCount + ", "
        + "updatetime = \"" + updateTime + "\"";

    db.query(userQuery, (err, data, fields) => {
        if (err) throw err;
    });

    trackData.forEach(elem => {
        let music = elem[0].replace(/\"/g, "\\\"");
        let diff = elem[1];
        let comp = elem[2];
        let score = elem[3];

        const musicQuery = "SELECT id FROM music WHERE BINARY title LIKE \"" + music + "\"";

        db.query(musicQuery, (err, data, fields) => {
            if (err) throw err;
            let musicId = data[0]['id'];
            const trackQuery = "SELECT id, level FROM track WHERE music_id = " + musicId
                + " AND " + diffDict[diff];

            db.query(trackQuery, (err, data, fields) => {
                if (err) throw err;
                let trackId = data[0]['id'];
                let level = data[0]['level'];
                const insertQuery = "INSERT INTO score (userId, trackId, comp, score, volforce) VALUES ("
                    + id + ", \"" + trackId + "\", \"" + comp + "\", " + score + ", " + getVolforce(level, comp, score) + ") ON DUPLICATE KEY UPDATE "
                    + "comp = \"" + comp + "\", "
                    + "score = " + score + ", "
                    + "volforce = " + getVolforce(level, comp, score);

                db.query(insertQuery, (err, data, fields) => {
                    if (err) throw err;
                });
            });
        });
    });

    let str = id + "<br>"
        + name + "<br>"
        + skill + "<br>"
        + volforce + "<br>"
        + playCount + "<br>"
        + updateTime + "<br><br>"
        + "업데이트 완료!!!!!<br><br>";

    const volforceQuery = "SELECT * FROM score WHERE userId = " + id + " ORDER BY volforce DESC, score DESC LIMIT 50";
    db.query(volforceQuery, (err, data, fields) => {
        if (err) throw err;
        data.forEach(elem => {
            str += elem['trackId'] + ", " + elem['comp'] + ", " + elem['score'] + ", " + elem['volforce'] + "<br>";
        })
        res.send(str);
    });
});

module.exports = router;
