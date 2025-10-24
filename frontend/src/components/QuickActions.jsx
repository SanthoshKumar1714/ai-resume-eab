import React, { useState } from 'react';
import './QuickActions.css';

export default function QuickActions({ resume, onAddSection, onSave }) {
  const [showTooltip, setShowTooltip] = useState(null);

  const actions = [
    {
      id: 'save',
      icon: '💾',
      label: 'Save',
      tooltip: 'Save your resume to the server',
      action: onSave,
      condition: true
    },
    {
      id: 'work',
      icon: '💼',
      label: 'Add Work',
      tooltip: 'Add work experience',
      action: () => onAddSection('work'),
      condition: !resume.sections?.some(s => s.type === 'work')
    },
    {
      id: 'education',
      icon: '🎓',
      label: 'Add Education',
      tooltip: 'Add education history',
      action: () => onAddSection('education'),
      condition: !resume.sections?.some(s => s.type === 'education')
    },
    {
      id: 'projects',
      icon: '🚀',
      label: 'Add Projects',
      tooltip: 'Add projects',
      action: () => onAddSection('projects'),
      condition: !resume.sections?.some(s => s.type === 'projects')
    },
    {
      id: 'skills',
      icon: '⚙️',
      label: 'Add Skills',
      tooltip: 'Add technical skills',
      action: () => onAddSection('skills'),
      condition: !resume.sections?.some(s => s.type === 'skills')
    }
  ];

  const visibleActions = actions.filter(a => a.condition);

  if (visibleActions.length === 0) return null;

  return (
    <div className="quick-actions-bar">
      <span className="quick-actions-label">Quick Actions:</span>
      <div className="quick-actions-buttons">
        {visibleActions.map(action => (
          <button
            key={action.id}
            className="quick-action-btn"
            onClick={action.action}
            onMouseEnter={() => setShowTooltip(action.id)}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <span className="action-icon">{action.icon}</span>
            <span className="action-label">{action.label}</span>
            {showTooltip === action.id && (
              <div className="action-tooltip">{action.tooltip}</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
