const Certificate = require('../models/Certificate');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');
const aiService = require('../services/aiService');

// Minimum meaningful characters for OCR to be considered successful.
// If Tesseract extracts fewer than this, we fall back to Gemini Vision.
const OCR_MIN_LENGTH = 80;

exports.uploadCertificate = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        const filePath = req.file.path;
        const fileType = req.file.mimetype;
        let extractedText = '';
        let usedVision = false;

        // Extract text based on file type
        if (fileType === 'application/pdf') {
            // PDF extraction
            const dataBuffer = fs.readFileSync(filePath);
            const pdfData = await pdfParse(dataBuffer);
            extractedText = pdfData.text;
        } else if (fileType.startsWith('image/')) {
            // --- Step 1: Try Tesseract OCR with improved settings ---
            console.log('Starting OCR for image:', req.file.originalname);
            try {
                const { data: { text } } = await Tesseract.recognize(
                    filePath,
                    'eng',
                    {
                        // PSM 1 = auto page segmentation with OSD
                        // OEM 1 = LSTM neural net only (most accurate)
                        tessedit_pageseg_mode: '1',
                        tessedit_ocr_engine_mode: '1',
                        logger: m => {
                            if (m.status === 'recognizing text') {
                                process.stdout.write(`\rOCR Progress: ${Math.round(m.progress * 100)}%`);
                            }
                        }
                    }
                );
                extractedText = text ? text.trim() : '';
                console.log('\nOCR completed. Extracted text length:', extractedText.length);
            } catch (ocrErr) {
                console.warn('Tesseract OCR failed, falling back to Gemini Vision:', ocrErr.message);
                extractedText = '';
            }

            // --- Step 2: If OCR result is too short/garbage, use Gemini Vision ---
            if (extractedText.replace(/\s/g, '').length < OCR_MIN_LENGTH) {
                console.log(`\n[Fallback] OCR text too short (${extractedText.length} chars). Using Gemini Vision directly...`);
                usedVision = true;
                const imageBuffer = fs.readFileSync(filePath);
                const base64Image = imageBuffer.toString('base64');
                const skillData = await aiService.extractSkillsFromImage(base64Image, fileType);

                console.log('\n=== GEMINI VISION OUTPUT ===');
                console.log('Domain:', skillData.domain);
                console.log('============================\n');

                const certificate = new Certificate({
                    userId: req.user.id,
                    name: req.body.name || req.file.originalname,
                    filePath: req.file.path,
                    demoSkillData: skillData
                });
                await certificate.save();
                return res.json(certificate);
            }
        } else {
            return res.status(400).json({ msg: 'Unsupported file type' });
        }

        console.log('\n=== EXTRACTED TEXT ===');
        console.log('Text length:', extractedText.length);
        console.log('First 500 characters:', extractedText.substring(0, 500));
        console.log('=====================\n');

        // Extract skills using AI service (text-based path)
        console.log('Sending text to AI model for skill extraction...');
        const skillData = await aiService.extractSkillsFromText(extractedText);

        console.log('\n=== AI MODEL OUTPUT ===');
        console.log('Domain:', skillData.domain);
        console.log('======================\n');

        const certificate = new Certificate({
            userId: req.user.id,
            name: req.body.name || req.file.originalname,
            filePath: req.file.path,
            demoSkillData: skillData
        });

        await certificate.save();
        res.json(certificate);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find({ userId: req.user.id });
        res.json(certificates);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteCertificate = async (req, res) => {
    try {
        await Certificate.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Certificate removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
