const mysql = require('mysql');
const config = require('./lib/config.js');
const db = mysql.createConnection(config.database);

db.connect((err) => {
    if (err) throw err;
    console.log('Database connected.');
});

module.exports = db;