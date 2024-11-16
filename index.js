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
});

var ipAddress = '192.168.0.80';
const axios = require('axios');
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

app.get('/api/changable-data', async (req, res) => {
  try {
    let [rows, fields] = await getChangeableData(); 
    return res.json(rows); 
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ message: 'Internal Server Error' }); 
  }
});


app.get('/api/login', async (req, res) => {
  try {
    const request = req;
    const username = request.query.username;
  
    let [rows, fields] = await getLogin(username); 
    const password = rows[0].Password;
    if(password == request.query.password) return res.json(200);
    else return res.json(401);
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
    
    const content = `I have a basil plant in a hydroponic system with 
    these values, please help me improve the plants health with recommendations. There are 3 sets of measurements,
    each are represented in parentheses in order from latest to oldest, the first being 1 day old, then 2 days old, then 3 days old.
    Temperature of the environment is (${plantData[0].temperature} F, ${plantData[1].temperature} F,${plantData[2].temperature} F), 
    Humidity is (${plantData[0].humidity}%, ${plantData[1].humidity}%, ${plantData[2].humidity}%), 
    Color is (${plantData[0].color}, ${plantData[1].color}, ${plantData[2].color}), 
    pH is (${plantData[0].ph}, ${plantData[1].ph}, ${plantData[2].ph}). I'm using angular and this response will be for an innerHTML element, give me pure code for innerHTML that looks clean, absolutely no comments or anything. 
    Don't put the html with backticks. Here is an example <div>
    <h2>Basil Plant Health Recommendations</h2>
    <p><strong>Temperature:</strong> CHATGPT RECOMMENDATION HERE.</p>
    <p><strong>Humidity:</strong> CHATGPT RECOMMENDATION HERE.</p>
    <p><strong>Color:</strong> CHATGPT RECOMMENDATION HERE.</p>
    <p><strong>pH Level:</strong> CHATGPT RECOMMENDATION HERE.</p>
    <h3>Action Plan (give detailed action plan)</h3>
    <ul>
    (<li></li> suggestions as needed)
        <li>CHATGPT RECOMMENDATION HERE.</li>
        <li>CHATGPT RECOMMENDATION HERE.</li>
        <li>CHATGPT RECOMMENDATION HERE.</li>
    </ul>
</div>`

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

async function getChangeableData() {
  try {   
    return conn.execute('SELECT * FROM ChangeableValues;');
  } catch (error) {
    console.error('Database query failed:', error);
    throw error; 
  }
}


async function updateLightArrayInDatabase(lightArrayValue) {
  try {   
    return conn.execute(`UPDATE ChangeableValues SET LightArray = ${lightArrayValue}`);
  } catch (error) {
    console.error('Database query failed:', error);
    throw error; 
  }
}

async function updateWaterPumpInDatabase(waterPumpValue) {
  try {   
    return conn.execute(`UPDATE ChangeableValues SET WaterPump = ${waterPumpValue}`);
  } catch (error) {
    console.error('Database query failed:', error);
    throw error; 
  }
}



async function getLogin(username) {
  try {   
    return conn.execute(`SELECT * FROM Users WHERE Username = '${username}'`);
  } catch (error) {
    console.error('Database query failed:', error);
    throw error; 
  }
}

async function sendMotorOnOff(waterPumpValue) {
  try {
    console.log('update water pump endpoint', waterPumpValue)
    const response = await axios.post(`http://${ipAddress}/update-water-pump`, null, {
      params: {
        waterPumpValue: waterPumpValue
      },
    });
    console.log('Response from ESP32:', response.data);
  } catch (error) {
    console.error('Error sending data to ESP32:', error.message);
    throw error;
  }
}

async function sendLightArrayOnOff(lightArrayValue) {
  try {
    const response = await axios.post(`http://10.173.220.77:80/update-light-array`, null, {
      params: {
        lightArrayValue:lightArrayValue
      },
    });
    console.log('Response from ESP32:', response.data);
  } catch (error) {
    console.error('Error sending data to ESP32:', error.message);
    throw error;
  }
}

app.post('/api/send-to-esp32-water-pump', (req, res) => {
  const { waterPumpValue } = req.body;


  if (waterPumpValue != null) {
    sendMotorOnOff(waterPumpValue)
      .then(async () => {
        await updateWaterPumpInDatabase(waterPumpValue)
        res.status(200).json({ status: 'success' })
      })
      .catch((err) => res.status(500).json({ status: 'error', message: err.message }));
  } else {
    res.status(400).json({ status: 'error', message: 'Missing parameters' });
  }
});

app.post('/api/send-to-esp32-light-array', (req, res) => {
  const { lightArrayValue } = req.body;

  if (lightArrayValue != null) {
    sendLightArrayOnOff(lightArrayValue)
      .then(async () => { 
        console.log('updated')
        await updateLightArrayInDatabase(lightArrayValue)
        res.status(200).json({ status: 'success' })
      })
      .catch((err) => res.status(500).json({ status: 'error', message: err.message }));
  } else {
    res.status(400).json({ status: 'error', message: 'Missing parameters' });
  }
});



module.exports = {
    server:server
};