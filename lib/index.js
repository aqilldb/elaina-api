module.exports = {
    gemini: require('./gemini'),
    cerebras: new (require('./cerebras'))(process.env.CEREBRAS_KEY),
    groq: new (require('./groq'))(process.env.GROQ_KEY),
    waifu: require('./waifu'),
    anilist: require('./anilist'),
    tiktok: require('./tiktok'),
    instagram: require('./instagram'),
    github: require('./github'),
    pinterest: require('./pinterest'),
    ttdl: require('./tiktokdl'),
    ssweb: require('./ssweb'),
    aichat: require('./aichat')
};
