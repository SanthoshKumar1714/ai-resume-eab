import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../contexts/ResumeContext';
import { useApp } from '../contexts/AppContext';
import SectionEditor from './SectionEditor';
import PreviewPane from './PreviewPane';
import ExportButton from './ExportButton';
import WelcomeGuide from './WelcomeGuide';
import templatesData from '../data/templates.json';
import './ResumeBuilder.css';

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const { resume, updatePersonalInfo, addSection, saveResume, isSaving, setTemplate } = useResume();
  const { showNotification, expandAllSections } = useApp();
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  useEffect(() => {
    if (!resume) {
      navigate('/');
    } else if (resume.sections) {
      // Auto-expand all sections on load
      expandAllSections(resume.sections.map(s => s.id));
    }
  }, [resume, navigate]);

  if (!resume) {
    return null;
  }

  const handleSave = async () => {
    try {
      await saveResume();
      showNotification('Resume saved successfully!', 'success');
    } catch (error) {
      showNotification('Failed to save resume', 'error');
    }
  };

  const handleAddSection = (type) => {
    addSection(type);
  };

  const handleTemplateChange = (e) => {
    setTemplate(e.target.value);
  };

  return (
    <div className="resume-builder">
      <WelcomeGuide />
      
      {/* Top Bar */}
      <div className="builder-topbar">
        <div className="topbar-left">
          <button className="button button-sm button-outline" onClick={() => navigate('/')}>
            ← Back
          </button>
          <h2 className="builder-title">Resume Builder</h2>
        </div>
        <div className="topbar-right">
          <select
            value={resume.template}
            onChange={handleTemplateChange}
            className="template-selector-dropdown"
          >
            {templatesData.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <button
            className="button button-sm button-outline"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : '💾 Save'}
          </button>
          <ExportButton />
        </div>
      </div>

      {/* Main Content - Split Pane */}
      <div className="builder-content">
        {/* Left Pane - Editor */}
        <div className={`editor-pane ${showMobilePreview ? 'hidden-mobile' : ''}`}>
          <div className="editor-scroll">
            {/* Personal Info Section */}
            <div className="personal-info-section">
              <h3 className="section-heading">Personal Information</h3>
              <div className="personal-info-form">
                <div className="form-row">
                  <div className="input-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      value={resume.personalInfo.fullName || ''}
                      onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="input-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={resume.personalInfo.email || ''}
                      onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={resume.personalInfo.phone || ''}
                      onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="input-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={resume.personalInfo.location || ''}
                      onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                      placeholder="City, State"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label>LinkedIn</label>
                    <input
                      type="text"
                      value={resume.personalInfo.linkedin || ''}
                      onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
                      placeholder="linkedin.com/in/username"
                    />
                  </div>
                  <div className="input-group">
                    <label>GitHub</label>
                    <input
                      type="text"
                      value={resume.personalInfo.github || ''}
                      onChange={(e) => updatePersonalInfo({ github: e.target.value })}
                      placeholder="github.com/username"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Portfolio</label>
                  <input
                    type="text"
                    value={resume.personalInfo.portfolio || ''}
                    onChange={(e) => updatePersonalInfo({ portfolio: e.target.value })}
                    placeholder="yourportfolio.com"
                  />
                </div>
              </div>
            </div>

            {/* Sections */}
            <div className="sections-container">
              <h3 className="section-heading">Sections</h3>
              {resume.sections && resume.sections.length > 0 ? (
                resume.sections
                  .sort((a, b) => a.order - b.order)
                  .map(section => (
                    <SectionEditor key={section.id} section={section} />
                  ))
              ) : (
                <div className="no-sections">
                  <p>No sections yet. Add a section to get started!</p>
                </div>
              )}
            </div>

            {/* Add Section Buttons */}
            <div className="add-section-controls">
              <h4>Add Section</h4>
              <div className="add-section-buttons">
                <button
                  className="button button-sm button-outline"
                  onClick={() => handleAddSection('work')}
                >
                  💼 Work Experience
                </button>
                <button
                  className="button button-sm button-outline"
                  onClick={() => handleAddSection('education')}
                >
                  🎓 Education
                </button>
                <button
                  className="button button-sm button-outline"
                  onClick={() => handleAddSection('projects')}
                >
                  🚀 Projects
                </button>
                <button
                  className="button button-sm button-outline"
                  onClick={() => handleAddSection('skills')}
                >
                  ⚙️ Skills
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane - Preview */}
        <div className={`preview-pane-container ${showMobilePreview ? 'show-mobile' : ''}`}>
          <PreviewPane />
        </div>

        {/* Mobile Toggle */}
        <button
          className="mobile-preview-toggle"
          onClick={() => setShowMobilePreview(!showMobilePreview)}
        >
          {showMobilePreview ? '✏️ Edit' : '👁️ Preview'}
        </button>
      </div>
    </div>
  );
}
