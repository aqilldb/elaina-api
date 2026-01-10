const Redis = require('ioredis');
const redis = new Redis("rediss://default:AVQjAAIncDJhYTYwNjNmOTIxYzY0OWEzYjVhZGI4MjQwMGM5MmFkNnAyMjE1Mzk@fit-griffon-21539.upstash.io:6379");
module.exports = redis;
