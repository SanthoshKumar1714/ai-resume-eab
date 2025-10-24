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

${content}`,

  generate_work_bullets: (jobInfo, userDemand) => `You are a professional resume writer. Based on this job information and user requirements, generate 3-5 powerful, achievement-oriented bullet points for a resume. Each bullet should start with a strong action verb, be quantifiable where possible, and demonstrate impact.

Job Title: ${jobInfo.position}
Company: ${jobInfo.company}
User Requirements: ${userDemand}

Return ONLY a JSON array of bullet points like this:
["Bullet point 1", "Bullet point 2", "Bullet point 3"]`,

  generate_project_bullets: (projectInfo, userDemand) => `You are a technical resume writer. Based on this project information and user requirements, generate 3-5 technical, achievement-focused bullet points for a resume project section. Focus on technical skills, impact, and results.

Project Name: ${projectInfo.name}
Technologies: ${projectInfo.technologies}
User Requirements: ${userDemand}

Return ONLY a JSON array of bullet points like this:
["Bullet point 1", "Bullet point 2", "Bullet point 3"]`,

  enhance_section_custom: (sectionType, content, userDemand) => `You are a professional resume writer. The user wants to improve their ${sectionType} section with this specific goal:

USER GOAL: ${userDemand}

Current section content:
${content}

Provide specific, actionable improvements to achieve the user's goal. Return your response as a structured suggestion with clear recommendations.`,

  generate_section_content: (sectionType, userDescription) => `You are an expert resume writer. Generate complete content for a ${sectionType} section based on this description:

${userDescription}

For work experience: Include job titles, companies, dates, and 3-5 bullet points per position
For education: Include school, degree, field, dates, GPA if relevant, and key achievements  
For projects: Include project names, technologies, descriptions, and 3-4 bullet points per project
For skills: Organize into logical categories with relevant skills

Return the content in a structured, resume-ready format that can be directly used.`
};

// Temperature settings per enhancement type
export const temperatureSettings = {
  grammar_check: 0.3,
  action_verbs: 0.7,
  bullet_rewrite: 0.7,
  professional_summary: 0.7,
  section_enhancement: 0.5,
  generate_work_bullets: 0.8,
  generate_project_bullets: 0.8,
  enhance_section_custom: 0.7,
  generate_section_content: 0.8
};

// Max tokens per request
export const maxTokens = 500;

// Context for all requests
export const systemContext = "You are a professional resume writer and career coach with 10+ years of experience helping college students and professionals land their dream jobs. Your responses are professional, concise, achievement-oriented, and modern.";
