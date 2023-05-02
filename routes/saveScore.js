const express = require('express');
const router = express.Router();

router.post('/', function(req, res, next) {
    res.send(req.body);
});

module.exports = router;
