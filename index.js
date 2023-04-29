const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
let template = require('./lib/template.js');

app.use(express.json());
app.get('/', function(req, res) {
    fs.readdir('./data', function(error, filelist){
        let title = "안즈인포 2.0 대기방";
        let description = "Hello, Node.js";
        let list = template.list(filelist);
        let html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/">create</a>`
        );
        res.send(html);
    });
});

app.get('/test', (req, res) => res.send('Test'));

app.listen(8001, () => console.log('Server Up and running at 8001'));
