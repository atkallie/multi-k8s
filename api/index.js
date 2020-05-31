const config = require('./config');

// ===== Express App Setup =====
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// initialize Express App
const app = express();
// handle CORS between Express API and React
app.use(cors());
// parse body of incoming POST requests to JSON
app.use(bodyParser.json());  //

// ===== PostgreSQL Client Setup =====
const { Pool } = require('pg');
const dbClient = new Pool({
    user: config.dbUser,
    host: config.dbHost,
    database: config.dbName,
    password: config.dbPassword,
    port: config.dbPort
})
dbClient.on('error', () => console.warn('Lost PG connection'));

// initialize the "values" SQL table with a single column "number"
dbClient
    .query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch((error) => console.error(error));


// ===== Redis Client Setup =====
const redis = require('redis');
const redisClient = redis.createClient({
    host: config.redisHost,
    port: config.redisPort,
    retry_strategy: () => 1000
});

// initialize the publisher
const publisher = redisClient.duplicate();

// ===== API Route Handlers =====
app.get('/', (request, response) => {
    respond.send('Good to go');
});

// send back all values that have ever been submitted
app.get('/values/all/', async (request, response) => {
    const values = await dbClient.query('SELECT * FROM values');
    response.send(values.rows);
});

app.get('/values/current/', (request, response) => {
    // Note: redis libray does have out of the box Promise support,
    // which is why we can't use async-await as we did above
    redisClient.hgetall('values', (error, values) => {
        response.send(values);
    });
});

app.post('/values/', async (request, response) => {
    const { index } = request.body;
    if(parseInt(index) > 40) return response.status(422).send('Index too high');

    redisClient.hset('values', index, 'N/A');  // not yet available
    // publish message to 'insert' channel (triggers worker process)
    publisher.publish('insert', index);
    // permanently store index in PostgreSQL Database
    dbClient.query('INSERT INTO values(number) VALUES($1)', [index]);

    response.send({ working: true });
})

app.listen(config.apiPort, (error) => {
    console.log(`Express API listening on port ${config.apiPort}`);
})
