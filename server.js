require('dotenv').config();
const express = require('express');
const path = require('path');
const Redis = require('ioredis');
const os = require('os');
const axios = require('axios');
const { router, list } = require('./routes/endpoints');
const app = express();
const redis = new Redis(process.env.REDIS_URL);

const startTime = Date.now();
let serverRegion = "Detecting...";

axios.get('http://ip-api.com/json/').then(res => {
    serverRegion = `${res.data.city}, ${res.data.countryCode}`;
}).catch(() => { serverRegion = "Localhost"; });

app.use(async (req, res, next) => {
    if (req.path.startsWith('/api/')) {
        const start = Date.now();
        res.on('finish', async () => {
            const duration = Date.now() - start;
            const total = await redis.incr('requests');
            const data = JSON.stringify({ l: duration, r: total, t: Date.now() });
            await redis.lpush('analytics_history', data);
            await redis.ltrim('analytics_history', 0, 29);
        });
    }
    next();
});

app.use(express.static('public'));
app.use(router);

app.get('/api/stats', async (req, res) => {
    try {
        const requests = await redis.get('requests') || 0;
        const rawHistory = await redis.lrange('analytics_history', 0, -1);
        const history = rawHistory.map(x => JSON.parse(x)).reverse();
        
        const avgLat = history.length ? (history.reduce((a,b)=>a+b.l,0)/history.length).toFixed(0) : 0;
        const totalMem = os.totalmem(), freeMem = os.freemem(), usedMem = totalMem - freeMem, cpus = os.cpus();
        const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

        const dbInfo = await redis.info();
        const dbMemory = dbInfo.match(/used_memory_human:(.*?)\r/)?.[1] || "0B";
        const dbKeys = await redis.dbsize();

        res.json({
            requests: parseInt(requests), 
            latency: avgLat + 'ms', 
            categories: [...new Set(list.map(i=>i.category))].length,
            endpoints: list.length,
            region: serverRegion,
            analytics: history,
            db: { memory: dbMemory, keys: dbKeys },
            system: {
                cpu: cpus.length > 0 ? cpus[0].model : 'Generic CPU',
                os: `${os.type()} ${os.arch()}`,
                ram: `${(usedMem/1024/1024/1024).toFixed(2)}GB / ${(totalMem/1024/1024/1024).toFixed(2)}GB`,
                uptime: `${Math.floor(uptimeSeconds/3600)}h ${Math.floor((uptimeSeconds%3600)/60)}m`,
                load: os.loadavg()[0].toFixed(2)
            }
        });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/config', (req, res) => res.json(list));
app.get('/docs', (req, res) => res.sendFile(path.join(__dirname, 'public', 'docs.html')));
app.get('/stats', (req, res) => res.sendFile(path.join(__dirname, 'public', 'stats.html')));

app.listen(process.env.PORT || 3000, () => console.log(`Server: 3000`));
