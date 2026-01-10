const axios = require('axios');
class SSWEB {
    async screenshot(url) {
        try {
            if (!url.startsWith('http')) url = 'https://' + url;
            const { data } = await axios.post('https://gcp.imagy.app/screenshot/createscreenshot', {
                url, browserWidth: 1280, browserHeight: 720,
                fullPage: false, deviceScaleFactor: 1, format: 'png'
            }, {
                headers: {
                    'content-type': 'application/json',
                    referer: 'https://imagy.app/',
                    'user-agent': 'Mozilla/5.0'
                }
            });
            return data.fileUrl;
        } catch (e) { return null; }
    }
}
module.exports = new SSWEB();
