const axios = require('axios');
const cheerio = require('cheerio');
class TikTokDL {
    async download(url) {
        try {
            if (!url.includes('tiktok.com')) return null;
            const { data: html, headers } = await axios.get('https://musicaldown.com/en');
            const $ = cheerio.load(html);
            const payload = {};
            $('#submit-form input').each((i, elem) => {
                const name = $(elem).attr('name');
                const value = $(elem).attr('value');
                if (name) payload[name] = value || '';
            });
            const urlField = Object.keys(payload).find(key => !payload[key]);
            if (urlField) payload[urlField] = url;
            const { data } = await axios.post('https://musicaldown.com/download', new URLSearchParams(payload).toString(), {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    cookie: headers['set-cookie'].join('; '),
                    origin: 'https://musicaldown.com',
                    referer: 'https://musicaldown.com/',
                    'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958) AppleWebKit/537.36'
                }
            });
            const $$ = cheerio.load(data);
            const downloads = [];
            $$('a.download').each((i, elem) => {
                const $elem = $$(elem);
                downloads.push({
                    type: $elem.data('event')?.replace('_download_click', ''),
                    label: $elem.text().trim(),
                    url: $elem.attr('href')
                });
            });
            return {
                title: $$('.video-desc').text().trim(),
                author: {
                    username: $$('.video-author b').text().trim(),
                    avatar: $$('.img-area img').attr('src')
                },
                cover: $$('.video-header').attr('style')?.match(/url\((.*?)\)/)?.[1],
                downloads
            };
        } catch (e) { return null; }
    }
}
module.exports = new TikTokDL();
