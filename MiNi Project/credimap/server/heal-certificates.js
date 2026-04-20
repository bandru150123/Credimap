const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

const Certificate = require('./models/Certificate');
const aiService = require('./services/aiService');

async function heal() {
    console.log('--- Starting Certificate Healing Process ---');
    
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find certificates with "General" domain
        const certs = await Certificate.find({ 'demoSkillData.domain': 'General' });
        console.log(`Found ${certs.length} certificates to heal.`);

        for (const cert of certs) {
            console.log(`\nHealing certificate: ${cert.name} (${cert._id})`);
            
            const absolutePath = path.join(__dirname, cert.filePath);
            if (!fs.existsSync(absolutePath)) {
                console.warn(`Warning: File missing at ${absolutePath}. Skipping AI re-scan.`);
                continue;
            }

            try {
                const fileBuffer = fs.readFileSync(absolutePath);
                const base64Image = fileBuffer.toString('base64');
                const mimeType = cert.filePath.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

                console.log(`Re-scanning with Gemini Vision...`);
                const result = await aiService.extractSkillsFromImage(base64Image, mimeType);
                
                if (result && result.domain && result.domain !== 'General') {
                    cert.demoSkillData = result;
                    await cert.save();
                    console.log(`Successfully healed! New domain: ${result.domain}`);
                } else {
                    console.log(`AI still returned General or failed for this certificate.`);
                }
            } catch (err) {
                console.error(`Failed to heal certificate ${cert._id}:`, err.message);
            }
        }

        console.log('\n--- Healing Process Completed ---');

    } catch (err) {
        console.error('Error during healing:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

heal().catch(console.error);
