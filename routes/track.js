const express = require('express');
const router = express.Router();
const db = require('../database.js');

router.get('/', (req, res) => {
    const musicQuery = "SELECT * FROM track WHERE music_id > 1800 ORDER BY music_id, FIELD(diff,'nov','adv','exh','mxm','inf','grv','hvn','vvd','xcd')";
    db.query(musicQuery, (err, data, fields) => {
        if (err) throw err;
        res.render('track', { title: 'Track List', musicData: data });
    });
});

module.exports = router;