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

var server = app.listen(8080, () => {
    console.log('App listening on 8080')
})

app.use(express.static(path.join(__dirname, 'basil-frontend/dist', 'basil-frontend')));
// Handle Angular routing
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'basil-frontend/dist', 'basil-frontend', 'index.html'));
});

app.use((req, res, next) => 
{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello from Express!' });
});

module.exports = {
    server:server
};