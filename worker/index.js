const config = require('./config');
const redis = require('redis');

// initialize redis client
const redisClient = redis.createClient({
    host: config.redisHost,
    port: config.redisPort,
    // try to reconnect every 1s to the redis server if ever the
    // connection is lost
    retry_strategy: () => 1000
});

// duplicate redis client
// this is needed because if the Redis client is listening to a channel the
// Redis client cannot be used for other purposes. Duplication creates a second
// connection so we can still use the redis client for other things
const subscriber = redisClient.duplicate();

// define the fibonacci function (our work function in this demo)
function fib(index){
    if(index < 2) return 1;
    return fib(index - 1) + fib(index - 2);
}

// Sub (Subscribe) piece of Pub-Sub (Publish-Subscribe) Setup
// watch redis for any time we get a new value inserted into the data store
subscriber.on('message', (channel, message) => {
    // insert into a hash called 'values'
    redisClient.hset('values', message, fib(parseInt(message)));
})

// subscribe to the 'insert' channel (name chosen by us)
// will send any messages received from subscribed channels to our message
// handler defined above
// Ref: https://medium.com/@ridwanfajar/using-redis-pub-sub-with-node-js-its-quite-easy-c9c8b4dae79f
subscriber.subscribe('insert');
