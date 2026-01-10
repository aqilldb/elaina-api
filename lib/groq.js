class GroqClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = "https://api.groq.com/openai/v1/chat/completions";
    }
    async chat(model, prompt, system_instructions = "") {
        const messages = [];
        if (system_instructions) messages.push({ role: "system", content: system_instructions });
        messages.push({ role: "user", content: prompt });
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: model, messages: messages })
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || response.statusText);
        }
        const data = await response.json();
        return { text: data.choices[0].message.content, model: data.model };
    }
}
module.exports = GroqClient;
