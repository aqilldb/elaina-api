const express = require('express');
const router = express.Router();
require('dotenv').config();
const scrap = require('../lib/index');

const list = [
  {
    category: "AI", name: "AI Chat Multi", path: "/api/ai/aichat", method: "GET",
    params: [
        { name: "prompt", required: true, placeholder: "Tanyakan apapun..." },
        { name: "model", required: false, options: ['gpt-4o-mini', 'gpt-5-nano', 'gemini', 'deepseek', 'claude', 'grok', 'meta-ai', 'qwen'] }
    ],
    handler: async (req, res) => {
      const { prompt, model } = req.query;
      if (!prompt) return res.status(400).json({ status: 400 });
      try { 
        const r = await scrap.aichat.chat(prompt, model || 'gpt-5-nano');
        res.json({ status: 200, creator: "elaina", data: r });
      } catch (e) { res.status(500).json({ status: 500, error: e.message }); }
    }
  },
  {
    category: "AI", name: "Gemini AI", path: "/api/ai/gemini", method: "GET",
    params: [{ name: "prompt", required: true }],
    handler: async (req, res) => {
      const { prompt } = req.query;
      if (!prompt) return res.status(400).json({ status: 400 });
      try { const r = await scrap.gemini.ask(prompt); res.json({ status: 200, creator: "elaina", data: r }); }
      catch (e) { res.status(500).json({ status: 500 }); }
    }
  },
  {
    category: "Tools", name: "SS Website", path: "/api/tools/ssweb", method: "GET",
    params: [{ name: "url", required: true, placeholder: "google.com" }],
    handler: async (req, res) => {
      const { url } = req.query;
      if (!url) return res.status(400).json({ status: 400 });
      try { const r = await scrap.ssweb.screenshot(url); res.json({ status: 200, creator: "elaina", data: { url: r } }); }
      catch (e) { res.status(500).json({ status: 500 }); }
    }
  }
];

const cModels = [{n:"GPT OSS 120B",id:"gpt-oss-120b"},{n:"Zai GLM 4.7",id:"zai-glm-4.7"},{n:"Llama 3.1 8B",id:"llama3.1-8b"},{n:"Llama 3.3 70B",id:"llama-3.3-70b"},{n:"Qwen 3 32B",id:"qwen-3-32b"},{n:"Qwen 3 235B",id:"qwen-3-235b-a22b-instruct-2507"}];
const gModels = [{n:"Groq Compound",id:"groq/compound"},{n:"Groq Compound Mini",id:"groq/compound-mini"},{n:"Llama 4 Scout 17B",id:"meta-llama/llama-4-scout-17b-16e-instruct"},{n:"Llama 4 Maverick 17B",id:"meta-llama/llama-4-maverick-17b-128e-instruct"},{n:"Llama Guard 4 12B",id:"meta-llama/llama-guard-4-12b"},{n:"Llama Prompt Guard 2 22M",id:"meta-llama/llama-prompt-guard-2-22m"},{n:"Llama Prompt Guard 2 86M",id:"meta-llama/llama-prompt-guard-2-86m"},{n:"Llama 3.1 8B Instant",id:"llama-3.1-8b-instant"},{n:"Llama 3.3 70B Versatile",id:"llama-3.3-70b-versatile"},{n:"Allam 2 7B",id:"allam-2-7b"},{n:"Kimi K2 Instruct",id:"moonshotai/kimi-k2-instruct"},{n:"Kimi K2 Instruct 0905",id:"moonshotai/kimi-k2-instruct-0905"},{n:"GPT OSS 20B",id:"openai/gpt-oss-20b"},{n:"GPT OSS Safeguard 20B",id:"openai/gpt-oss-safeguard-20b"}];
const regAI = (m, cl) => { m.forEach(x => list.push({ category: "AI", name: x.n, path: `/api/ai/${x.id.split('/').pop()}`, method: "GET", params: [{ name: "prompt", required: true }, { name: "system_instructions", required: false }], handler: async (req, res) => { const { prompt, system_instructions } = req.query; if (!prompt) return res.status(400).json({ status: 400 }); try { const r = await cl.chat(x.id, prompt, system_instructions); res.json({ status: 200, creator: "elaina", data: r }); } catch (e) { res.status(500).json({ status: 500 }); } } })); };
regAI(cModels, scrap.cerebras); regAI(gModels, scrap.groq);
const waImTags = ["maid", "waifu", "marin-kitagawa", "mori-calliope", "raiden-shogun", "oppai", "selfies", "uniform", "kamisato-ayaka"];
const waImNsfw = ["ass", "hentai", "milf", "oral", "paizuri", "ecchi", "ero"];
const waPiTags = ["waifu","neko","shinobu","megumin","bully","cuddle","cry","hug","awoo","kiss","lick","pat","smug","bonk","yeet","blush","smile","wave","highfive","handhold","nom","bite","glomp","slap","kill","kick","happy","wink","poke","dance","cringe"];
const waPiNsfw = ["waifu","neko","trap","blowjob"];
const neBeTags = ["neko","waifu","husbando","kitsune","lurk","shoot","sleep","shrug","stare","wave","poke","smile","peck","wink","blush","smug","tickle","yeet","think","highfive","feed","bite","bored","nom","yawn","facepalm","cuddle","kick","happy","hug","baka","pat","angry","run","nod","nope","kiss","dance","punch","handshake","slap","cry","pout","handhold","thumbsup","laugh"];
const regTag = (t, c, s) => { t.forEach(tag => { let name = tag.toUpperCase().replace(/-/g, ' '); let path = `/api/${c.toLowerCase().replace(/\s+/g, '-')}/${tag}`; let ex = list.filter(x => x.path === path).length; if (ex === 1) { name += " V2"; path += "v2"; } else if (ex === 2) { name += " V3"; path += "v3"; } list.push({ category: c, name, path, method: "GET", params: [], handler: async (req, res) => { try { let r; if (s === 'im') r = await scrap.waifu.getBuffer(tag, c.includes("NSFW")); else if (s === 'pics') r = await scrap.waifu.getPicsBuffer(c.includes("NSFW") ? "nsfw" : "sfw", tag); else if (s === 'best') r = await scrap.waifu.getNekosBestBuffer(tag); res.setHeader('Content-Type', r.type); res.send(r.buffer); } catch (e) { res.status(500).send("Error"); } } }); }); };
regTag(waImTags, "Random", "im"); regTag(waImNsfw, "Random NSFW", "im");
regTag(waPiTags, "Random", "pics"); regTag(waPiNsfw, "Random NSFW", "pics");
regTag(neBeTags, "Random", "best");
const discov = [
    { name: "Anilist Search", path: "/api/discovery/anilist", p: [{name: "search", required: true}], h: (q) => scrap.anilist.search(q.search) },
    { name: "TikTok Stalker", path: "/api/discovery/st-tiktok", p: [{name: "user", required: true}], h: (q) => scrap.tiktok.stalk(q.user) },
    { name: "Instagram Stalker", path: "/api/discovery/st-instagram", p: [{name: "user", required: true}], h: (q) => scrap.instagram.stalk(q.user) },
    { name: "GitHub Stalker", path: "/api/discovery/st-github", p: [{name: "user", required: true}], h: (q) => scrap.github.stalk(q.user) },
    { name: "Pinterest Search", path: "/api/discovery/pinterest", p: [{name: "query", required: true}, {name: "limit", required: false}], h: (q) => scrap.pinterest.search(q.query, q.limit) }
];
discov.forEach(d => list.push({ category: "Discovery", name: d.name, path: d.path, method: "GET", params: d.p, handler: async (req, res) => { try { const r = await d.h(req.query); res.json({ status: 200, creator: "elaina", data: r }); } catch (e) { res.status(500).json({ status: 500 }); } } }));
list.push({
    category: "Downloader", name: "TikTok Downloader", path: "/api/downloader/tiktok", method: "GET",
    params: [{ name: "url", required: true }],
    handler: async (req, res) => {
      const { url } = req.query;
      if (!url) return res.status(400).json({ status: 400 });
      try { const r = await scrap.ttdl.download(url); res.json({ status: 200, creator: "elaina", data: r }); }
      catch (e) { res.status(500).json({ status: 500 }); }
    }
});
list.forEach(api => router[api.method.toLowerCase()](api.path, api.handler));
module.exports = { router, list };
