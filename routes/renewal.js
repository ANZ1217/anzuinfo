const express = require('express');
const router = express.Router();
const db = require('../database.js');

router.get('/', (req, res) => {
    res.render('renewal', { title: 'Renewal' });
});

module.exports = router;