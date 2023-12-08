const express = require('express');
const bodyParser = require('body-parser');

// Create an Express application
const app = express();
const PORT = 3000;

// parse JSON data in incoming requests
app.use(bodyParser.json());

// Define an API endpoint to handle incoming sensor data
app.post('/api/sensors', (req, res) => {
    // Extract the sensor data from the request body
    const sensorData = req.body;

    const { Pool } = require('pg');

    // Create a cnx pool with our db
    const pool = new Pool({
       user: 'postgres',
       host: 'localhost',
       database: 'sensors',
       password: 'montassar',
       port: 5432,
});

// Store the data to the db
pool.query(
    'INSERT INTO sensors_table (serial, swVersion, temperature, date, gps) VALUES ($1, $2, $3, $4, $5)',
    [
        sensorData.serial,
        sensorData.swVersion,
        sensorData.temperature,
        sensorData.date,
        sensorData.gps,
    ],
    (error, results) => {
        if (error) {
            throw error;
        }
        console.log('Sensor data stored in the database.');
    }
);
    // See thz stored data in server logs
    console.log('Received Sensor Data:', sensorData);

    pool.end(); 

    // Send a response back to the client
    res.send('Sensor data received and stored.');
});

// Start the server and lissten on port 3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});