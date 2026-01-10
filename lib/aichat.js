const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

class AIChat {
    constructor() {
        this.models = {
            'gpt-4o-mini': '25865',
            'gpt-5-nano': '25871',
            'gemini': '25874',
            'deepseek': '25873',
            'claude': '25875',
            'grok': '25872',
            'meta-ai': '25870',
            'qwen': '25869'
        };
    }

    async chat(question, model = 'gpt-5-nano') {
        try {
            const botId = this.models[model];
            if (!botId) throw new Error('Invalid model');

            const { data: html } = await axios.post(`https://api.nekolabs.web.id/px?url=${encodeURIComponent('https://chatgptfree.ai/')}&version=v2`);
            const nonceMatch = html.result.content.match(/&quot;nonce&quot;\s*:\s*&quot;([^&]+)&quot;/);
            if (!nonceMatch) throw new Error('Nonce not found');

            const { data } = await axios.post(`https://api.nekolabs.web.id/px?url=${encodeURIComponent('https://chatgptfree.ai/wp-admin/admin-ajax.php')}&version=v2`, new URLSearchParams({
                action: 'aipkit_frontend_chat_message',
                _ajax_nonce: nonceMatch[1],
                bot_id: botId,
                session_id: uuidv4(),
                conversation_uuid: uuidv4(),
                post_id: '6',
                message: question
            }).toString(), {
                headers: {
                    origin: 'https://chatgptfree.ai',
                    referer: 'https://chatgptfree.ai/',
                    'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958) AppleWebKit/537.36'
                }
            });

            return data.result.content.data.reply;
        } catch (e) {
            throw e;
        }
    }
}
module.exports = new AIChat();
