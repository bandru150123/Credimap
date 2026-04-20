const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

async function findFlash() {
    try {
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });
        
        const response = await ai.models.list();
        console.log('Flash Models available:');
        for (const m of response.models) {
            if (m.name.toLowerCase().includes('flash')) {
                console.log(`- ${m.name}`);
            }
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
}

findFlash();
