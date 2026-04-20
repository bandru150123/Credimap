const { GoogleGenAI } = require('@google/genai');
// Use environment variable for the API key for security
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const aiService = {
    async extractSkillsFromText(text) {
        try {
            console.log('[AI Service] Received text length:', text.length);

            // Clean text
            let cleanedText = text
                .replace(/\0/g, '')
                .replace(/\s+/g, ' ')
                .trim();
            cleanedText = cleanedText.replace(/[^\x20-\x7E\n\t]/g, '');

            console.log('[AI Service] Cleaned text preview:', cleanedText.substring(0, 200));

            const prompt = `
You are an advanced AI system designed to analyze professional certificates and classify them intelligently.

Your task is to:
1. Understand the meaning of the certificate (not just keywords)
2. Identify the most relevant domain

---

INPUT:
Certificate Text:
"${cleanedText}"

---

INSTRUCTIONS:

- Do NOT rely only on exact keyword matches
- Use semantic understanding
- Infer its closest real-world domain based on the subject matter
- Be precise and professional

---

OUTPUT FORMAT (STRICT JSON):

{
  "domain": "Main domain (e.g., Data Science, Healthcare, Finance, Engineering, Law, Design, etc.)"
}
`;

            console.log('[AI Service] Prompting Gemini...');

            const response = await ai.models.generateContent({
                model: 'gemini-flash-latest',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                }
            });

            const responseText = response.text;
            console.log('[AI Service] Gemini Raw Response:', responseText);

            try {
                const result = JSON.parse(responseText);
                return result;
            } catch (parseErr) {
                console.error('[AI Service] Failed to parse JSON response:', parseErr);
                // Fallback struct
                return {
                    domain: "General"
                };
            }

        } catch (err) {
            console.error('AI Service Error:', err);
            return {
                domain: "General"
            };
        }
    },

    /**
     * Sends the certificate image directly to Gemini Vision for skill extraction.
     * Used as a fallback when Tesseract OCR produces insufficient text.
     * @param {string} base64Image - Base64-encoded image string
     * @param {string} mimeType - MIME type of the image (e.g. 'image/jpeg')
     */
    async extractSkillsFromImage(base64Image, mimeType) {
        try {
            console.log('[AI Vision] Sending image directly to Gemini Vision...');

            const prompt = `You are an advanced AI system designed to analyze professional certificates and classify them intelligently.

Look at this certificate image carefully and:
1. Read ALL visible text in the certificate
2. Identify the domain of the skill/course

Be precise and professional.

Respond ONLY in this strict JSON format:
{
  "domain": "Main domain (e.g., Cloud Computing, Data Science, Cybersecurity, etc.)"
}`;

            const response = await ai.models.generateContent({
                model: 'gemini-flash-latest',
                contents: [
                    {
                        role: 'user',
                        parts: [
                            {
                                inlineData: {
                                    mimeType: mimeType,
                                    data: base64Image
                                }
                            },
                            { text: prompt }
                        ]
                    }
                ],
                config: {
                    responseMimeType: 'application/json'
                }
            });

            const responseText = response.text;
            console.log('[AI Vision] Gemini Vision Raw Response:', responseText);

            try {
                const result = JSON.parse(responseText);
                return result;
            } catch (parseErr) {
                console.error('[AI Vision] Failed to parse JSON response:', parseErr);
                return {
                    domain: "General"
                };
            }

        } catch (err) {
            console.error('[AI Vision] Error:', err);
            return {
                domain: "General"
            };
        }
    }
};

module.exports = aiService;
