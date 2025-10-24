import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Get Gemini model instance
 * Model: gemini-1.5-flash-latest (Free tier)
 */
export function getGeminiModel() {
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
}

/**
 * Generate content using Gemini AI
 * @param {string} prompt - The prompt to send to Gemini
 * @param {number} temperature - Temperature setting (0.0-1.0)
 * @returns {Promise<string>} - Generated text response
 */
export async function generateContent(prompt, temperature = 0.7) {
  try {
    const model = getGeminiModel();

    const generationConfig = {
      temperature,
      maxOutputTokens: 500,
    };

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate content from Gemini AI');
  }
}

/**
 * Middleware to attach Gemini client to request object
 */
export function attachGeminiClient(req, res, next) {
  req.gemini = {
    generate: generateContent,
    getModel: getGeminiModel
  };
  next();
}
