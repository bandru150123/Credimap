const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

async function listModels() {
    try {
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });
        
        // Listing models in @google/genai SDK
        const response = await ai.models.list(); // Usually .list() or .listModels()
        console.log('Available Models:');
        console.log(JSON.stringify(response, null, 2));
    } catch (err) {
        console.error('Error listing models:', err.message);
        // Try another way if .list() fails
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            const response = await ai.models.listModels();
            console.log('Available Models (listModels):');
            console.log(JSON.stringify(response, null, 2));
        } catch (err2) {
             console.error('Error listing models (listModels):', err2.message);
        }
    }
}

listModels();
