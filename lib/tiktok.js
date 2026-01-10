const axios = require('axios');
class TikTok {
    async stalk(user) {
        const ip = `${Math.floor(Math.random() * 255) + 1}.${Math.floor(Math.random() * 255) + 1}.${Math.floor(Math.random() * 255) + 1}.${Math.floor(Math.random() * 255) + 1}`;
        const ua = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
        try {
            const res = await axios.get(`https://www.tiktok.com/@${user}`, {
                headers: { 'User-Agent': ua, 'X-Forwarded-For': ip, 'X-Real-IP': ip },
                timeout: 10000
            });
            const data = res.data.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application\/json">(.*?)<\/script>/s);
            if (!data) return null;
            const json = JSON.parse(data[1]);
            const info = json.__DEFAULT_SCOPE__['webapp.user-detail']?.userInfo;
            if (!info) return null;
            return {
                user: info.user,
                stats: info.stats,
                statsV2: info.statsV2
            };
        } catch (e) { return null; }
    }
}
module.exports = new TikTok();
