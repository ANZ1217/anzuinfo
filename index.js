const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');

const mysql = require('mysql');
const config = require('./lib/config.js');
const db = mysql.createConnection(config.database);

const template = require('./lib/template.js');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    let title = "안즈인포 2.0 대기방";
    //let description = "ABCDE";
    
    let testQuery = "SELECT * FROM music";
    db.query(testQuery, (err, results, fields) => {
        res.send(results);
    });

    //let html = template.HTML(title, description);
});

app.get('/test', (req, res) => res.send('Test'));

app.listen(8001, () => console.log('Server Up and running at 8001'));
