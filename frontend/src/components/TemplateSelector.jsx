import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../contexts/ResumeContext';
import templatesData from '../data/templates.json';
import sampleResumesData from '../data/sampleResumes.json';
import './TemplateSelector.css';

export default function TemplateSelector() {
  const navigate = useNavigate();
  const { initializeResume } = useResume();
  const [hoveredTemplate, setHoveredTemplate] = useState(null);

  const handleTemplateSelect = (templateId) => {
    initializeResume(templateId);
    navigate('/builder');
  };

  const handleStartWithSample = () => {
    const sampleResume = { ...sampleResumesData.college_student };
    initializeResume(sampleResume.template, sampleResume);
    navigate('/builder');
  };

  return (
    <div className="template-selector-page">
      <div className="template-selector-container">
        <header className="selector-header">
          <h1 className="gradient-text">ResumeCraft</h1>
          <p className="selector-subtitle">
            Build and enhance your resume with AI-powered assistance
          </p>
        </header>

        <div className="templates-grid">
          {templatesData.map((template) => (
            <div
              key={template.id}
              className={`template-card ${hoveredTemplate === template.id ? 'hovered' : ''}`}
              onClick={() => handleTemplateSelect(template.id)}
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
            >
              <div className="template-preview">
                <div className={`template-mock template-${template.id}`}>
                  <div className="mock-header"></div>
                  <div className="mock-line"></div>
                  <div className="mock-line short"></div>
                  <div className="mock-section">
                    <div className="mock-section-title"></div>
                    <div className="mock-line"></div>
                    <div className="mock-line"></div>
                  </div>
                  <div className="mock-section">
                    <div className="mock-section-title"></div>
                    <div className="mock-line"></div>
                  </div>
                </div>
              </div>
              <div className="template-info">
                <h3 className="template-name">{template.name}</h3>
                <p className="template-description">{template.description}</p>
                <button className="button button-sm button-gradient">
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="sample-option">
          <button
            className="button button-outline"
            onClick={handleStartWithSample}
          >
            Start with Example Resume
          </button>
          <p className="sample-hint">
            Load a sample resume to see how it works
          </p>
        </div>
      </div>
    </div>
  );
}
