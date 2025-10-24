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
    if (!type) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Type is required'
      });
    }

    // Validate type
    const validTypes = [
      'grammar_check', 'action_verbs', 'bullet_rewrite', 
      'professional_summary', 'section_enhancement',
      'generate_work_bullets', 'generate_project_bullets',
      'enhance_section_custom', 'generate_section_content'
    ];
    
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        error: 'Invalid type',
        message: `Type must be one of: ${validTypes.join(', ')}`
      });
    }

    // Validate content length for types that require content
    const requiresContent = !['generate_section_content', 'generate_work_bullets', 'generate_project_bullets'].includes(type);
    
    if (requiresContent) {
      if (!content) {
        return res.status(400).json({
          error: 'Invalid request',
          message: 'Content is required'
        });
      }
      
      if (content.length < 5) {
        return res.status(400).json({
          error: 'Content too short',
          message: 'Text too short to enhance (minimum 5 characters)'
        });
      }

      if (content.length > 2000) {
        return res.status(400).json({
          error: 'Content too long',
          message: 'Text too long (maximum 2000 characters)'
        });
      }
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
      case 'generate_work_bullets':
        if (!context?.jobInfo || !context?.userDemand) {
          return res.status(400).json({
            error: 'Invalid request',
            message: 'Job info and user demand are required'
          });
        }
        prompt = promptTemplates.generate_work_bullets(context.jobInfo, context.userDemand);
        break;
      case 'generate_project_bullets':
        if (!context?.projectInfo || !context?.userDemand) {
          return res.status(400).json({
            error: 'Invalid request',
            message: 'Project info and user demand are required'
          });
        }
        prompt = promptTemplates.generate_project_bullets(context.projectInfo, context.userDemand);
        break;
      case 'enhance_section_custom':
        if (!context?.sectionType || !context?.userDemand) {
          return res.status(400).json({
            error: 'Invalid request',
            message: 'Section type and user demand are required'
          });
        }
        prompt = promptTemplates.enhance_section_custom(context.sectionType, content, context.userDemand);
        break;
      case 'generate_section_content':
        if (!context?.sectionType || !context?.userDescription) {
          return res.status(400).json({
            error: 'Invalid request',
            message: 'Section type and description are required'
          });
        }
        prompt = promptTemplates.generate_section_content(context.sectionType, context.userDescription);
        break;
      default:
        prompt = promptTemplates.grammar_check(content);
    }

    // Get temperature setting for this type
    const temperature = temperatureSettings[type] || 0.7;

    // Call Gemini AI
    const enhanced = await generateContent(prompt, temperature);

    // Parse JSON response for types that return JSON arrays
    if (type === 'generate_work_bullets' || type === 'generate_project_bullets') {
      try {
        const jsonMatch = enhanced.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const bullets = JSON.parse(jsonMatch[0]);
          return res.json({
            bullets,
            requestsRemaining: req.rateLimit?.remaining || 15
          });
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
      }
    }

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
