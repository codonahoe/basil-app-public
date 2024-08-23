var express = require('express');
var mysql = require('mysql2');
const path = require('path');   
var cors = require('cors');
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
app.use(cors())
app.use(express.json())

app.listen(8080, () => {
    console.log('App listening on 8080')
})

app.use(express.static(path.join(__dirname, 'dist', 'basil-frontend')));
// Handle Angular routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'basil-frontend', 'index.html'));
  });

app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello from Express!' });
});



