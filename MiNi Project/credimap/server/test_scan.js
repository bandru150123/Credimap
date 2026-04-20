const fs = require('fs');
const path = require('path');
require('dotenv').config();
const aiService = require('./services/aiService');

async function testExtraction() {
    const filePath = 'C:/Users/rehan/Downloads/MiNi Project-1/cc.jpg';
    
    if (!fs.existsSync(filePath)) {
        console.error('File not found:', filePath);
        return;
    }

    console.log('--- Scanning Image:', path.basename(filePath), '---');
    
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        try {
            attempts++;
            console.log(`Attempt ${attempts}/${maxAttempts}...`);
            
            const imageBuffer = fs.readFileSync(filePath);
            const base64Image = imageBuffer.toString('base64');
            const mimeType = 'image/jpeg';

            const result = await aiService.extractSkillsFromImage(base64Image, mimeType);

            if (result.domain === "General" && result.reasoning.includes("Error")) {
                throw new Error(result.reasoning);
            }

            console.log('\n=== SUCCESSFUL AI OUTPUT ===');
            console.log('Domain:', result.domain);
            console.log('Skills:', result.skills);
            console.log('Level:', result.level);
            console.log('Confidence:', result.confidence);
            console.log('Reasoning:', result.reasoning);
            console.log('============================\n');
            return;

        } catch (err) {
            console.error(`Attempt ${attempts} failed:`, err.message);
            if (attempts < maxAttempts) {
                console.log('Waiting 5s before retry...');
                await new Promise(r => setTimeout(r, 5000));
            }
        }
    }
    console.error('All attempts failed.');
}

testExtraction();
