const { GoogleGenAI } = require('@google/genai');

// Using the provided API key
const GEMINI_API_KEY = "AIzaSyCeKTw5Fm6SJDZlG69OSVKt3HXwdwYgWP4";
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
2. Identify the most relevant domain and subdomain
3. Extract key skills
4. Handle completely new or unseen courses intelligently

---

INPUT:
Certificate Text:
"${cleanedText}"

---

INSTRUCTIONS:

- Do NOT rely only on exact keyword matches
- Use semantic understanding
- Even if the course is new, infer its closest real-world domain
- Be precise and professional
- Avoid vague answers

---

OUTPUT FORMAT (STRICT JSON):

{
  "domain": "Main domain (e.g., Data Science, Healthcare, Finance, Engineering, Law, Design, etc.)",
  "subdomain": "More specific area (e.g., Machine Learning, Cardiology, Investment Banking, UI/UX, etc.)",
  "skills": ["skill1", "skill2", "skill3", "skill4"],
  "level": "Beginner | Intermediate | Advanced (infer from words like 'Advanced', 'Professional', etc.)",
  "confidence": "0-100%",
  "reasoning": "Short explanation of why this classification was chosen"
}
`;

            console.log('[AI Service] Prompting Gemini...');

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
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
                    domain: "General",
                    subdomain: "Professional",
                    skills: ["Communication"],
                    level: "Beginner",
                    confidence: "50%",
                    reasoning: "Failed to parse API response."
                };
            }

        } catch (err) {
            console.error('AI Service Error:', err);
            return {
                domain: "General",
                subdomain: "Professional",
                skills: ["Technical Professional"],
                level: "Beginner",
                confidence: "50%",
                reasoning: "Error connecting to AI service."
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
2. Identify the domain and subdomain of the skill/course
3. Extract key skills learned
4. Determine the level (Beginner / Intermediate / Advanced)
5. Output a confidence score

Be precise. Even if the certificate is for a new or uncommon course, use semantic understanding to infer the closest real-world domain.

Respond ONLY in this strict JSON format:
{
  "domain": "Main domain (e.g., Cloud Computing, Data Science, Cybersecurity, etc.)",
  "subdomain": "More specific area (e.g., AWS, Machine Learning, Network Security, etc.)",
  "skills": ["skill1", "skill2", "skill3", "skill4"],
  "level": "Beginner | Intermediate | Advanced",
  "confidence": "0-100%",
  "reasoning": "Short explanation of why this classification was chosen"
}`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
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
                    domain: "General",
                    subdomain: "Professional",
                    skills: ["Communication"],
                    level: "Beginner",
                    confidence: "50%",
                    reasoning: "Failed to parse Vision API response."
                };
            }

        } catch (err) {
            console.error('[AI Vision] Error:', err);
            return {
                domain: "General",
                subdomain: "Professional",
                skills: ["Technical Professional"],
                level: "Beginner",
                confidence: "50%",
                reasoning: "Error calling Gemini Vision API."
            };
        }
    }
};

module.exports = aiService;
