import React, { useEffect } from 'react';
import { useResume } from '../contexts/ResumeContext';
import { useApp } from '../contexts/AppContext';
import '../styles/templates/modern-minimal.css';
import '../styles/templates/professional-classic.css';
import '../styles/templates/creative-portfolio.css';
import '../styles/templates/technical-developer.css';
import '../styles/templates/academic-scholar.css';
import './PreviewPane.css';

export default function PreviewPane() {
  const { resume } = useResume();
  const { previewZoom } = useApp();

  if (!resume) {
    return (
      <div className="preview-pane">
        <div className="preview-empty">
          <p>No resume loaded</p>
        </div>
      </div>
    );
  }

  const sortedSections = [...(resume.sections || [])].sort((a, b) => a.order - b.order);

  return (
    <div className="preview-pane">
      <div className="preview-controls">
        <span className="preview-label">Preview</span>
      </div>
      <div
        className="preview-content"
        style={{ transform: `scale(${previewZoom / 100})` }}
        id="resume-preview"
      >
        <div className={`resume-container template-${resume.template}`}>
          {/* Header - Personal Info */}
          <div className="resume-header">
            <h1 className="resume-name">{resume.personalInfo?.fullName || 'Your Name'}</h1>
            <div className="resume-contact">
              {resume.personalInfo?.email && (
                <span className="resume-contact-item">{resume.personalInfo.email}</span>
              )}
              {resume.personalInfo?.phone && (
                <span className="resume-contact-item">{resume.personalInfo.phone}</span>
              )}
              {resume.personalInfo?.location && (
                <span className="resume-contact-item">{resume.personalInfo.location}</span>
              )}
              {resume.personalInfo?.linkedin && (
                <span className="resume-contact-item">{resume.personalInfo.linkedin}</span>
              )}
              {resume.personalInfo?.github && (
                <span className="resume-contact-item">{resume.personalInfo.github}</span>
              )}
              {resume.personalInfo?.portfolio && (
                <span className="resume-contact-item">{resume.personalInfo.portfolio}</span>
              )}
            </div>
          </div>

          {/* Sections */}
          {sortedSections.map(section => (
            <div key={section.id} className="resume-section">
              <h2 className="section-title">{section.title}</h2>
              {renderSectionContent(section, resume.template)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function renderSectionContent(section, template) {
  const sortedItems = [...(section.items || [])].sort((a, b) => a.order - b.order);

  switch (section.type) {
    case 'work':
      return sortedItems.map(item => (
        <div key={item.id} className="section-item">
          <div className="item-header">
            <div>
              <div className="item-title">{item.position || 'Position'}</div>
              <div className="item-subtitle">{item.company || 'Company'}</div>
            </div>
            <div className="item-meta">
              {item.startDate} - {item.current ? 'Present' : item.endDate}
              {item.location && ` • ${item.location}`}
            </div>
          </div>
          {item.bullets && item.bullets.length > 0 && (
            <ul className="item-bullets">
              {item.bullets.sort((a, b) => a.order - b.order).map(bullet => (
                <li key={bullet.id}>{bullet.text}</li>
              ))}
            </ul>
          )}
        </div>
      ));

    case 'education':
      return sortedItems.map(item => (
        <div key={item.id} className="section-item">
          <div className="item-header">
            <div>
              <div className="item-title">{item.school || 'School'}</div>
              <div className="item-subtitle">
                {item.degree} {item.field && `in ${item.field}`}
              </div>
            </div>
            <div className="item-meta">
              {item.startDate} - {item.endDate}
              {item.location && ` • ${item.location}`}
              {item.gpa && <span className="item-gpa"> • GPA: {item.gpa}</span>}
            </div>
          </div>
          {item.achievements && item.achievements.length > 0 && (
            <ul className="item-bullets">
              {item.achievements.sort((a, b) => a.order - b.order).map(ach => (
                <li key={ach.id}>{ach.text}</li>
              ))}
            </ul>
          )}
        </div>
      ));

    case 'projects':
      return sortedItems.map(item => (
        <div key={item.id} className="section-item">
          <div className="item-header">
            <div>
              <div className="item-title">{item.name || 'Project Name'}</div>
              {item.technologies && (
                <div className="item-subtitle">{item.technologies}</div>
              )}
            </div>
            {item.link && (
              <div className="item-meta">{item.link}</div>
            )}
          </div>
          {item.description && <p className="item-description">{item.description}</p>}
          {item.bullets && item.bullets.length > 0 && (
            <ul className="item-bullets">
              {item.bullets.sort((a, b) => a.order - b.order).map(bullet => (
                <li key={bullet.id}>{bullet.text}</li>
              ))}
            </ul>
          )}
        </div>
      ));

    case 'skills':
      return (
        <div className="skills-grid">
          {sortedItems.map(item => (
            <div key={item.id} className="skill-item">
              <span className="skill-category">{item.category}: </span>
              {template === 'technical_developer' ? (
                <div className="skill-list">
                  {item.skills.split(',').map((skill, idx) => (
                    <span key={idx} className="skill-tag">{skill.trim()}</span>
                  ))}
                </div>
              ) : (
                <span className="skill-list">{item.skills}</span>
              )}
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
}
