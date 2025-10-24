import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to resume data directory
const RESUME_DATA_DIR = path.join(__dirname, '../data/resumes');

/**
 * Ensure data directory exists
 */
async function ensureDataDir() {
  try {
    await fs.access(RESUME_DATA_DIR);
  } catch {
    await fs.mkdir(RESUME_DATA_DIR, { recursive: true });
  }
}

/**
 * POST /api/save-resume
 * Save resume data to JSON file
 */
router.post('/save-resume', async (req, res) => {
  try {
    const { resume } = req.body;

    // Validation
    if (!resume) {
      return res.status(400).json({
        error: 'Invalid resume data',
        message: 'Resume object is required'
      });
    }

    // Validate required fields
    if (!resume.id || !resume.template || !resume.personalInfo) {
      return res.status(400).json({
        error: 'Invalid resume data',
        message: 'Missing required fields: id, template, personalInfo'
      });
    }

    // Validate personalInfo
    if (!resume.personalInfo.fullName || !resume.personalInfo.email) {
      return res.status(400).json({
        error: 'Invalid resume data',
        message: 'Personal info must include fullName and email'
      });
    }

    // Ensure data directory exists
    await ensureDataDir();

    // Update metadata
    const savedResume = {
      ...resume,
      metadata: {
        ...resume.metadata,
        lastSaved: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    // Save to file
    const filePath = path.join(RESUME_DATA_DIR, `${resume.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(savedResume, null, 2), 'utf8');

    res.json({
      success: true,
      resumeId: resume.id,
      savedAt: savedResume.metadata.lastSaved
    });

  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({
      error: 'Save failed',
      message: 'Unable to save resume. Please try again.'
    });
  }
});

/**
 * GET /api/resume/:id
 * Load resume data by ID
 */
router.get('/resume/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const filePath = path.join(RESUME_DATA_DIR, `${id}.json`);

    try {
      const data = await fs.readFile(filePath, 'utf8');
      const resume = JSON.parse(data);
      res.json({ resume });
    } catch (error) {
      res.status(404).json({
        error: 'Resume not found',
        message: 'The requested resume does not exist'
      });
    }

  } catch (error) {
    console.error('Load error:', error);
    res.status(500).json({
      error: 'Load failed',
      message: 'Unable to load resume. Please try again.'
    });
  }
});

export default router;
