const { GoogleGenAI } = require('@google/genai');

// Initialize with the package standard
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

/**
 * Helper to retry AI calls on 503 (Service Unavailable) or 429 (Rate Limit)
 * This is CRITICAL for managing free-tier quotas and temporary server spikes.
 */
async function withRetry(fn, retries = 3, delay = 2000) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            // Log the raw error for debugging 503s
            const status = error.status || (error.response && error.response.status);
            const isRetryable = status === 503 || status === 429 || error.message?.includes('503');
            
            if (isRetryable && i < retries - 1) {
                console.log(`[AI Retry] Google is busy (Attempt ${i + 1}/${retries}). Retrying in ${delay / 1000}s...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; 
                continue;
            }
            throw error;
        }
    }
}

const aiService = {
    /**
     * Extracts skills and metadata from certificate text
     */
    async extractSkillsFromText(text) {
        try {
            if (!text || text.trim().length < 10) {
                return { domain: 'General', skills: [] };
            }

            // Clean text
            const cleanedText = text.replace(/\0/g, '').replace(/\s+/g, ' ').trim().substring(0, 3000);

            const prompt = `Analyze this certificate text and extract the professional domain. 
            Return ONLY a JSON object in this format: {"domain": "Domain Name", "skills": ["Skill1", "Skill2"]}.
            Text: ${cleanedText}`;

            console.log('[AI Service] Prompting Gemini...');

            const response = await withRetry(() => ai.models.generateContent({
                model: 'gemini-flash-latest',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                }
            }));

            // The @google/genai package returns response directly as text in some versions
            const responseText = response.text || response;
            const result = JSON.parse(responseText);
            
            return {
                domain: result.domain || 'General',
                skills: result.skills || []
            };
        } catch (error) {
            console.error('AI Service Error:', error.message);
            return { domain: 'General', skills: [] };
        }
    },

    /**
     * Full Multi-modal extraction (Image directly to Gemini)
     */
    async extractSkillsFromImage(base64Image, mimeType) {
        try {
            const prompt = `This is a certificate image. Please identify:
            1. The main professional domain (e.g., Web Development, Cloud, Marketing).
            2. Top 5 specific technical skills validated by this certificate.
            
            Return ONLY valid JSON: {"domain": "Text", "skills": ["Skill1", "Skill2"]}`;

            console.log('[AI Vision] Sending image directly to Gemini Vision...');

            const response = await withRetry(() => ai.models.generateContent({
                model: 'gemini-flash-latest',
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: prompt },
                            {
                                inlineData: {
                                    mimeType: mimeType,
                                    data: base64Image
                                }
                            }
                        ]
                    }
                ],
                config: {
                    responseMimeType: "application/json",
                }
            }));

            const responseText = response.text || response;
            const result = JSON.parse(responseText);
            console.log('[AI Vision] Gemini Vision Raw Response:', JSON.stringify(result, null, 2));
            
            return {
                domain: result.domain || 'General',
                skills: result.skills || []
            };
        } catch (error) {
            console.error('[AI Vision] Error:', error.message);
            return { domain: 'General', skills: [] };
        }
    }
};

module.exports = aiService;
