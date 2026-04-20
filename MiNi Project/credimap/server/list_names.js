const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

async function listModels() {
    try {
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });
        
        const response = await ai.models.list();
        // Looking at the structure from previous fail: it seems to be an object with data somewhere
        // Or it might be an iterator
        console.log('Model names:');
        for (const m of response) {
            console.log(m.name);
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
}

listModels();
