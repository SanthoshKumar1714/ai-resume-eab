import express from 'express';
import { generateContent } from '../middleware/geminiClient.js';
import { promptTemplates, temperatureSettings } from '../utils/promptTemplates.js';

const router = express.Router();

/**
 * POST /api/enhance
 * Send text to Gemini for AI enhancement
 */
router.post('/enhance', async (req, res) => {
  try {
    const { type, content, context } = req.body;

    // Validation
    if (!type || !content) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Type and content are required'
      });
    }

    // Validate type
    const validTypes = ['grammar_check', 'action_verbs', 'bullet_rewrite', 'professional_summary', 'section_enhancement'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        error: 'Invalid type',
        message: `Type must be one of: ${validTypes.join(', ')}`
      });
    }

    // Validate content length
    if (content.length < 5) {
      return res.status(400).json({
        error: 'Content too short',
        message: 'Text too short to enhance (minimum 5 characters)'
      });
    }

    if (content.length > 1000) {
      return res.status(400).json({
        error: 'Content too long',
        message: 'Text too long (maximum 1000 characters)'
      });
    }

    // Build prompt based on type
    let prompt;
    switch (type) {
      case 'grammar_check':
        prompt = promptTemplates.grammar_check(content);
        break;
      case 'action_verbs':
        prompt = promptTemplates.action_verbs(content);
        break;
      case 'bullet_rewrite':
        prompt = promptTemplates.bullet_rewrite(content);
        break;
      case 'professional_summary':
        prompt = promptTemplates.professional_summary(context?.role || 'Professional', content);
        break;
      case 'section_enhancement':
        prompt = promptTemplates.section_enhancement(context?.sectionType || 'content', content);
        break;
      default:
        prompt = promptTemplates.grammar_check(content);
    }

    // Get temperature setting for this type
    const temperature = temperatureSettings[type] || 0.7;

    // Call Gemini AI
    const enhanced = await generateContent(prompt, temperature);

    // Parse JSON response for bullet_rewrite
    if (type === 'bullet_rewrite') {
      try {
        // Try to extract JSON from the response
        const jsonMatch = enhanced.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.json({
            original: content,
            enhanced: parsed.version1 || enhanced,
            alternatives: [parsed.version1, parsed.version2].filter(Boolean),
            requestsRemaining: req.rateLimit?.remaining || 15
          });
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        // Fall through to regular response
      }
    }

    // Regular response
    res.json({
      original: content,
      enhanced: enhanced.trim(),
      requestsRemaining: req.rateLimit?.remaining || 15
    });

  } catch (error) {
    console.error('Enhancement error:', error);
    res.status(500).json({
      error: 'Enhancement failed',
      message: 'Unable to process request. Please try again.'
    });
  }
});

export default router;
