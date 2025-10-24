// Prompt templates for Gemini AI enhancements
// Based on planning.md specifications

export const promptTemplates = {
  grammar_check: (content) => `You are a professional resume editor. Fix any grammar, spelling, or punctuation errors in the following text. Return only the corrected version without explanations:

${content}`,

  action_verbs: (content) => `You are a resume writing expert. Rewrite this resume bullet point to start with a strong action verb and make it more impactful. Keep it concise (under 150 characters). Return only the rewritten version:

${content}`,

  bullet_rewrite: (content) => `You are a professional resume writer. Improve this resume bullet point to be more achievement-oriented and quantifiable if possible. Provide 2 alternative versions that are different approaches. Return as JSON with keys 'original', 'version1', 'version2':

${content}`,

  professional_summary: (role, context) => `You are a career coach. Write a compelling 2-3 line professional summary for a resume based on this role and context. Focus on key achievements and skills. Return only the summary:

Role: ${role}
Context: ${context}`,

  section_enhancement: (sectionType, content) => `You are a resume expert. Review this ${sectionType} section and suggest specific improvements for clarity and impact. Return 3-5 actionable suggestions as a bullet list:

${content}`
};

// Temperature settings per enhancement type
export const temperatureSettings = {
  grammar_check: 0.3,      // Low for accuracy
  action_verbs: 0.7,       // Higher for creativity
  bullet_rewrite: 0.7,     // Higher for alternatives
  professional_summary: 0.7,
  section_enhancement: 0.5
};

// Max tokens per request
export const maxTokens = 500;

// Context for all requests
export const systemContext = "You are a professional resume writer and career coach with 10+ years of experience helping college students and professionals land their dream jobs. Your responses are professional, concise, achievement-oriented, and modern.";
