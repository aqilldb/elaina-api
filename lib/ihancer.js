const axios = require('axios');
const FormData = require('form-data');
class Ihancer {
    async enhance(imageUrl, method = 1, size = 'low') {
        try {
            const imgRes = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(imgRes.data);
            const form = new FormData();
            form.append('method', method.toString());
            form.append('is_pro_version', 'false');
            form.append('is_enhancing_more', 'false');
            form.append('max_image_size', size);
            form.append('file', buffer, `image_${Date.now()}.jpg`);
            const { data } = await axios.post('https://ihancer.com/api/enhance', form, {
                headers: { ...form.getHeaders(), 'user-agent': 'Dart/3.5 (dart:io)' },
                responseType: 'arraybuffer'
            });
            return { buffer: Buffer.from(data), type: 'image/jpeg' };
        } catch (e) { return null; }
    }
}
module.exports = new Ihancer();
