const axios = require('axios');
class Pinterest {
    async search(query, limit = 10) {
        try {
            const main = await axios.get('https://id.pinterest.com/');
            const cookie = main.headers['set-cookie'].join('; ');
            const token = cookie.match(/csrftoken=(.*?);/)[1];
            const sourceUrl = `/search/pins/?q=${encodeURIComponent(query)}`;
            const data = {
                options: { query: query, scope: 'pins', bookmarks: [] },
                context: {}
            };
            const res = await axios.post(
                'https://id.pinterest.com/resource/BaseSearchResource/get/',
                `source_url=${encodeURIComponent(sourceUrl)}&data=${encodeURIComponent(JSON.stringify(data))}`,
                {
                    headers: {
                        'Cookie': cookie,
                        'X-CSRFToken': token,
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'User-Agent': 'Mozilla/5.0'
                    }
                }
            );
            return res.data.resource_response.data.results.map(p => p.images['orig']?.url || p.images['736x']?.url).slice(0, limit);
        } catch (e) { return []; }
    }
}
module.exports = new Pinterest();
