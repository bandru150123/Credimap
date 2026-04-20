const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const aiService = require('./services/aiService');

async function testImage(imagePath) {
    console.log(`\n--- Testing Image: ${path.basename(imagePath)} ---`);
    
    if (!fs.existsSync(imagePath)) {
        console.error(`Error: File not found at ${imagePath}`);
        return;
    }

    try {
        const fileBuffer = fs.readFileSync(imagePath);
        const base64Image = fileBuffer.toString('base64');
        const mimeType = imagePath.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

        console.log(`File size: ${(fileBuffer.length / 1024).toFixed(2)} KB`);
        console.log('Sending to Gemini Vision for extraction...');

        const result = await aiService.extractSkillsFromImage(base64Image, mimeType);
        
        console.log('\n=== RESULT ===');
        console.log(JSON.stringify(result, null, 2));
        console.log('==============\n');

    } catch (error) {
        console.error('Error during testing:', error.message);
    }
}

async function runTests() {
    const images = [
        'C:\\Users\\rehan\\Downloads\\MiNi Project-1\\TechCoders_Darshan_Laxman_Talekar.png',
        'C:\\Users\\rehan\\Downloads\\MiNi Project-1\\WhatsApp Image 2026-04-21 at 2.47.49 AM.jpeg'
    ];

    for (const image of images) {
        await testImage(image);
    }
}

runTests().then(() => {
    console.log('Tests completed.');
}).catch(console.error);
