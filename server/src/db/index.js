require('dotenv').config();
var mysql = require('mysql');

var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

con.connect(function(err) {
    if (err) {
        console.error('Error connecting to the database: ', err);
        return;
    }
    console.log('Connected to the database!');
});


module.exports = con;
