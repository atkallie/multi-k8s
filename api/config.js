module.exports = {
    // Express API
    apiPort: process.env.API_PORT || 5000,

    // Redis (In-Memory Data Store)
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,

    // Postgres (SQL Database)
    dbUser: process.env.DB_USER,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    dbPassword: process.env.DB_PASSWORD,
    dbPort: process.env.DB_PORT
}
