var express = require('express');
var mysql = require('mysql2');
var cors = require('cors')
var connection = mysql.createConnection({
    host: 'ls-65984030458039fd3d922fc04d034a82be10f2be.czueisqkgcoa.us-east-1.rds.amazonaws.com',
    user: 'dbmasteruser',
    password: 'G~C$BJ5qfZ3r9SCQAhJ7%4ig2$fQ9osk',
    database: 'dbmaster',
})

connection.connect(function(err){
    if(err) throw err;
    else console.log('Connection Successful')
})

var app = express();
app.use(cors)
app.use(express.json())

var server = app.listen(8080, () => {
    console.log('App listening on 8080')
})
