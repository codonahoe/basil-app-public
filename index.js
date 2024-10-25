var express = require('express');
require('dotenv').config();
var mysql = require('mysql2/promise');
const path = require('path');   
var cors = require('cors');
var conn = mysql.createPool({
    host: 'ls-65984030458039fd3d922fc04d034a82be10f2be.czueisqkgcoa.us-east-1.rds.amazonaws.com',
    user: 'dbmasteruser',
    password: 'G~C$BJ5qfZ3r9SCQAhJ7%4ig2$fQ9osk',
    database: 'dbmaster',
})

var openai = require('openai');
openai.apiKey = process.env.OPENAI_API_KEY;

const openAi = new openai.OpenAI({
  organization: "org-hOvZbpFaPmxNg8mzKBD138Xk",
  project: "proj_oa67gWVfJpnp5ULtXqhQ5Gfv	",
});



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


app.get('/api/data', async (req, res) => {
  try {
    let [rows, fields] = await getResults(); 
    return res.json(rows); 
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ message: 'Internal Server Error' }); 
  }
});

app.get('/api/ai-feedback', async (req, res) => {
  try {

    let rows = await getResults();

    let plantData = [];
    rows[0].forEach((record) => {
      plantData.push({
        temperature: record.temperature,
        humidity: record.humidity,
        color: record.color,
        light: record.light,
        ph: record.ph,
      })
    })

    console.log(plantData)
    const content = `I have a basil plant in a hydroponic system with 
    these values, please help me improve the plants health with recommendations. There are 3 sets of measurements,
    each are represented in parentheses in order from latest to oldest, the first being 1 day old, then 2 days old, then 3 days old.
    Temperature of the environment is (${plantData[0].temperature} F, ${plantData[1].temperature} F,${plantData[2].temperature} F), 
    Humidity is (${plantData[0].humidity}%, ${plantData[1].humidity}%, ${plantData[2].humidity}%), 
    Color is (${plantData[0].color}, ${plantData[1].color}, ${plantData[2].color}), 
    pH is (${plantData[0].ph}, ${plantData[1].ph}, ${plantData[2].ph})`

    const completion = await openAi.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
          { role: "system", content: "You are a helpful assistant." },
          {
              role: "user",
              content: content,
          },
      ],
  });
   console.log(completion.choices[0].message.content);

    return res.json(completion.choices[0].message.content); 
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ message: 'Internal Server Error' }); 
  }
});


async function getResults() {
  try {   
    return conn.execute('SELECT * FROM measurements ORDER BY addedUTCDateTime DESC LIMIT 3');
  } catch (error) {
    console.error('Database query failed:', error);
    throw error; 
  }
}


module.exports = {
    server:server
};