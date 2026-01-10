class WaifuScraper {
    constructor() { 
        this.waifuImBase = "https://api.waifu.im/search";
        this.waifuPicsBase = "https://api.waifu.pics";
        this.nekosBestBase = "https://nekos.best/api/v2";
    }
    async getBuffer(tag, isNsfw = false) {
        const params = new URLSearchParams({ included_tags: tag, is_nsfw: isNsfw });
        const res = await fetch(`${this.waifuImBase}?${params}`);
        const data = await res.json();
        const imgUrl = data.images[0]?.url;
        if (!imgUrl) return null;
        const imgRes = await fetch(imgUrl);
        return { buffer: Buffer.from(await imgRes.arrayBuffer()), type: imgRes.headers.get('content-type') };
    }
    async getPicsBuffer(type, tag) {
        const res = await fetch(`${this.waifuPicsBase}/${type}/${tag}`);
        const data = await res.json();
        if (!data.url) return null;
        const imgRes = await fetch(data.url);
        return { buffer: Buffer.from(await imgRes.arrayBuffer()), type: imgRes.headers.get('content-type') };
    }
    async getNekosBestBuffer(tag) {
        const res = await fetch(`${this.nekosBestBase}/${tag}`);
        const data = await res.json();
        const imgUrl = data.results[0]?.url;
        if (!imgUrl) return null;
        const imgRes = await fetch(imgUrl);
        return { buffer: Buffer.from(await imgRes.arrayBuffer()), type: imgRes.headers.get('content-type') };
    }
}
module.exports = new WaifuScraper();
