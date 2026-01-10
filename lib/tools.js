const axios = require('axios');
const FormData = require('form-data');
class Tools {
    async ssweb(url, width = 1280, height = 720) {
        try {
            const { data } = await axios.post('https://gcp.imagy.app/screenshot/createscreenshot', {
                url, browserWidth: width, browserHeight: height, fullPage: false, deviceScaleFactor: 1, format: 'png'
            }, { headers: { 'content-type': 'application/json', 'user-agent': 'Mozilla/5.0' } });
            const res = await axios.get(data.fileUrl, { responseType: 'arraybuffer' });
            return Buffer.from(res.data);
        } catch (e) { return null; }
    }
    async ihancer(imgUrl, method = 1, size = 'high') {
        try {
            const imgRes = await axios.get(imgUrl, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(imgRes.data);
            const form = new FormData();
            form.append('method', method.toString());
            form.append('is_pro_version', 'false');
            form.append('is_enhancing_more', 'false');
            form.append('max_image_size', size);
            form.append('file', buffer, `image.jpg`);
            const { data } = await axios.post('https://ihancer.com/api/enhance', form, {
                headers: { ...form.getHeaders(), 'user-agent': 'Dart/3.5' },
                responseType: 'arraybuffer'
            });
            return Buffer.from(data);
        } catch (e) { return null; }
    }
}
module.exports = new Tools();
