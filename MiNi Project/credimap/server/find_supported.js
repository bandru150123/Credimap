const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

async function listModels() {
    try {
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });
        
        const response = await ai.models.list();
        const supported = response.filter(m => m.supportedActions.includes('generateContent'));
        console.log('Supported Models for generateContent:');
        supported.forEach(m => {
            console.log(`- ${m.name}`);
        });
    } catch (err) {
        console.error('Error:', err.message);
    }
}

listModels();
