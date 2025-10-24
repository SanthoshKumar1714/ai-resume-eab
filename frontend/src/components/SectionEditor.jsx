import React, { useState } from 'react';
import { useResume } from '../contexts/ResumeContext';
import { useApp } from '../contexts/AppContext';
import AIEnhancerPanel from './AIEnhancerPanel';
import { v4 as uuidv4 } from 'uuid';
import './SectionEditor.css';

export default function SectionEditor({ section }) {
  const { updateSection, deleteSection, addItem, updateItem, deleteItem } = useResume();
  const { isSectionExpanded, toggleSection } = useApp();
  const [enhancingBullet, setEnhancingBullet] = useState(null);
  const isExpanded = isSectionExpanded(section.id);

  const handleAddItem = () => {
    const newItemData = getEmptyItemData(section.type);
    addItem(section.id, newItemData);
  };

  const handleDeleteSection = () => {
    if (confirm(`Delete ${section.title} section?`)) {
      deleteSection(section.id);
    }
  };

  const handleDeleteItem = (itemId) => {
    if (confirm('Delete this item?')) {
      deleteItem(section.id, itemId);
    }
  };

  return (
    <div className="section-editor">
      <div className="section-header" onClick={() => toggleSection(section.id)}>
        <div className="section-header-left">
          <span className="drag-handle">⋮⋮</span>
          <h3 className="section-title-edit">{section.title}</h3>
          <span className="item-count">{section.items?.length || 0} items</span>
        </div>
        <div className="section-header-right">
          <button
            className="icon-button delete-section-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteSection();
            }}
          >
            🗑️
          </button>
          <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
        </div>
      </div>

      {isExpanded && (
        <div className="section-body">
          {section.items && section.items.length > 0 ? (
            section.items.sort((a, b) => a.order - b.order).map((item) => (
              <div key={item.id} className="section-item-editor">
                {renderItemEditor(section.type, item, section.id, updateItem, handleDeleteItem, setEnhancingBullet)}
              </div>
            ))
          ) : (
            <div className="empty-section">
              <p>No items yet. Click "Add {getSectionItemLabel(section.type)}" to begin.</p>
            </div>
          )}
          <button className="button button-outline button-sm add-item-btn" onClick={handleAddItem}>
            + Add {getSectionItemLabel(section.type)}
          </button>
        </div>
      )}

      {enhancingBullet && (
        <AIEnhancerPanel
          content={enhancingBullet.text}
          onApply={(enhanced) => {
            const item = section.items.find(i => i.id === enhancingBullet.itemId);
            if (!item) return;

            if (section.type === 'work' || section.type === 'projects') {
              const updatedBullets = item.bullets.map(b =>
                b.id === enhancingBullet.bulletId ? { ...b, text: enhanced } : b
              );
              updateItem(section.id, item.id, { bullets: updatedBullets });
            } else if (section.type === 'education') {
              const updatedAchievements = item.achievements.map(a =>
                a.id === enhancingBullet.bulletId ? { ...a, text: enhanced } : a
              );
              updateItem(section.id, item.id, { achievements: updatedAchievements });
            }
          }}
          onClose={() => setEnhancingBullet(null)}
        />
      )}
    </div>
  );
}

function renderItemEditor(type, item, sectionId, updateItem, deleteItem, setEnhancingBullet) {
  switch (type) {
    case 'work':
      return <WorkItemEditor item={item} sectionId={sectionId} updateItem={updateItem} deleteItem={deleteItem} setEnhancingBullet={setEnhancingBullet} />;
    case 'education':
      return <EducationItemEditor item={item} sectionId={sectionId} updateItem={updateItem} deleteItem={deleteItem} setEnhancingBullet={setEnhancingBullet} />;
    case 'projects':
      return <ProjectItemEditor item={item} sectionId={sectionId} updateItem={updateItem} deleteItem={deleteItem} setEnhancingBullet={setEnhancingBullet} />;
    case 'skills':
      return <SkillItemEditor item={item} sectionId={sectionId} updateItem={updateItem} deleteItem={deleteItem} />;
    default:
      return null;
  }
}

function WorkItemEditor({ item, sectionId, updateItem, deleteItem, setEnhancingBullet }) {
  return (
    <div className="item-form">
      <div className="item-header-controls">
        <span className="drag-handle-small">⋮⋮</span>
        <button className="icon-button" onClick={() => deleteItem(item.id)}>🗑️</button>
      </div>

      <div className="form-row">
        <div className="input-group">
          <label>Company *</label>
          <input
            type="text"
            value={item.company || ''}
            onChange={(e) => updateItem(sectionId, item.id, { company: e.target.value })}
            placeholder="Company Name"
          />
        </div>
        <div className="input-group">
          <label>Position *</label>
          <input
            type="text"
            value={item.position || ''}
            onChange={(e) => updateItem(sectionId, item.id, { position: e.target.value })}
            placeholder="Job Title"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="input-group">
          <label>Location</label>
          <input
            type="text"
            value={item.location || ''}
            onChange={(e) => updateItem(sectionId, item.id, { location: e.target.value })}
            placeholder="City, State"
          />
        </div>
        <div className="input-group">
          <label>Start Date</label>
          <input
            type="text"
            value={item.startDate || ''}
            onChange={(e) => updateItem(sectionId, item.id, { startDate: e.target.value })}
            placeholder="MM/YYYY"
          />
        </div>
        <div className="input-group">
          <label>End Date</label>
          <div className="date-with-current">
            <input
              type="text"
              value={item.current ? 'Present' : item.endDate || ''}
              onChange={(e) => updateItem(sectionId, item.id, { endDate: e.target.value, current: false })}
              placeholder="MM/YYYY"
              disabled={item.current}
            />
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={item.current || false}
                onChange={(e) => updateItem(sectionId, item.id, { current: e.target.checked, endDate: 'Present' })}
              />
              Current
            </label>
          </div>
        </div>
      </div>

      <BulletsEditor
        bullets={item.bullets || []}
        itemId={item.id}
        sectionId={sectionId}
        updateItem={updateItem}
        setEnhancingBullet={setEnhancingBullet}
      />
    </div>
  );
}

function EducationItemEditor({ item, sectionId, updateItem, deleteItem, setEnhancingBullet }) {
  return (
    <div className="item-form">
      <div className="item-header-controls">
        <span className="drag-handle-small">⋮⋮</span>
        <button className="icon-button" onClick={() => deleteItem(item.id)}>🗑️</button>
      </div>

      <div className="form-row">
        <div className="input-group">
          <label>School *</label>
          <input
            type="text"
            value={item.school || ''}
            onChange={(e) => updateItem(sectionId, item.id, { school: e.target.value })}
            placeholder="University Name"
          />
        </div>
        <div className="input-group">
          <label>Degree *</label>
          <input
            type="text"
            value={item.degree || ''}
            onChange={(e) => updateItem(sectionId, item.id, { degree: e.target.value })}
            placeholder="Bachelor of Science"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="input-group">
          <label>Field of Study</label>
          <input
            type="text"
            value={item.field || ''}
            onChange={(e) => updateItem(sectionId, item.id, { field: e.target.value })}
            placeholder="Computer Science"
          />
        </div>
        <div className="input-group">
          <label>GPA</label>
          <input
            type="text"
            value={item.gpa || ''}
            onChange={(e) => updateItem(sectionId, item.id, { gpa: e.target.value })}
            placeholder="3.8"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="input-group">
          <label>Start Date</label>
          <input
            type="text"
            value={item.startDate || ''}
            onChange={(e) => updateItem(sectionId, item.id, { startDate: e.target.value })}
            placeholder="MM/YYYY"
          />
        </div>
        <div className="input-group">
          <label>End Date</label>
          <input
            type="text"
            value={item.endDate || ''}
            onChange={(e) => updateItem(sectionId, item.id, { endDate: e.target.value })}
            placeholder="Expected YYYY"
          />
        </div>
      </div>

      <div className="input-group">
        <label>Achievements</label>
        {(item.achievements || []).sort((a, b) => a.order - b.order).map((ach) => (
          <div key={ach.id} className="bullet-item">
            <textarea
              value={ach.text}
              onChange={(e) => {
                const updated = item.achievements.map(a =>
                  a.id === ach.id ? { ...a, text: e.target.value } : a
                );
                updateItem(sectionId, item.id, { achievements: updated });
              }}
              placeholder="Achievement or honor"
              rows={2}
            />
            <button
              className="icon-button ai-button"
              onClick={() => setEnhancingBullet({ itemId: item.id, bulletId: ach.id, text: ach.text })}
              title="Enhance with AI"
            >
              ✨
            </button>
            <button
              className="icon-button"
              onClick={() => {
                const updated = item.achievements.filter(a => a.id !== ach.id);
                updateItem(sectionId, item.id, { achievements: updated });
              }}
            >
              ×
            </button>
          </div>
        ))}
        <button
          className="button button-sm button-outline"
          onClick={() => {
            const newAch = { id: uuidv4(), text: '', order: (item.achievements || []).length };
            updateItem(sectionId, item.id, { achievements: [...(item.achievements || []), newAch] });
          }}
        >
          + Add Achievement
        </button>
      </div>
    </div>
  );
}

function ProjectItemEditor({ item, sectionId, updateItem, deleteItem, setEnhancingBullet }) {
  return (
    <div className="item-form">
      <div className="item-header-controls">
        <span className="drag-handle-small">⋮⋮</span>
        <button className="icon-button" onClick={() => deleteItem(item.id)}>🗑️</button>
      </div>

      <div className="form-row">
        <div className="input-group">
          <label>Project Name *</label>
          <input
            type="text"
            value={item.name || ''}
            onChange={(e) => updateItem(sectionId, item.id, { name: e.target.value })}
            placeholder="Project Title"
          />
        </div>
        <div className="input-group">
          <label>Technologies</label>
          <input
            type="text"
            value={item.technologies || ''}
            onChange={(e) => updateItem(sectionId, item.id, { technologies: e.target.value })}
            placeholder="React, Node.js, MongoDB"
          />
        </div>
      </div>

      <div className="input-group">
        <label>Description</label>
        <textarea
          value={item.description || ''}
          onChange={(e) => updateItem(sectionId, item.id, { description: e.target.value })}
          placeholder="Brief project description"
          rows={2}
        />
      </div>

      <div className="input-group">
        <label>Link</label>
        <input
          type="url"
          value={item.link || ''}
          onChange={(e) => updateItem(sectionId, item.id, { link: e.target.value })}
          placeholder="https://github.com/username/project"
        />
      </div>

      <BulletsEditor
        bullets={item.bullets || []}
        itemId={item.id}
        sectionId={sectionId}
        updateItem={updateItem}
        setEnhancingBullet={setEnhancingBullet}
      />
    </div>
  );
}

function SkillItemEditor({ item, sectionId, updateItem, deleteItem }) {
  return (
    <div className="item-form">
      <div className="item-header-controls">
        <span className="drag-handle-small">⋮⋮</span>
        <button className="icon-button" onClick={() => deleteItem(item.id)}>🗑️</button>
      </div>

      <div className="form-row">
        <div className="input-group">
          <label>Category</label>
          <input
            type="text"
            value={item.category || ''}
            onChange={(e) => updateItem(sectionId, item.id, { category: e.target.value })}
            placeholder="Programming Languages"
          />
        </div>
      </div>

      <div className="input-group">
        <label>Skills (comma-separated)</label>
        <input
          type="text"
          value={item.skills || ''}
          onChange={(e) => updateItem(sectionId, item.id, { skills: e.target.value })}
          placeholder="JavaScript, Python, Java"
        />
      </div>
    </div>
  );
}

function BulletsEditor({ bullets, itemId, sectionId, updateItem, setEnhancingBullet }) {
  return (
    <div className="input-group">
      <label>Bullet Points</label>
      {bullets.sort((a, b) => a.order - b.order).map((bullet) => (
        <div key={bullet.id} className="bullet-item">
          <textarea
            value={bullet.text}
            onChange={(e) => {
              const updated = bullets.map(b =>
                b.id === bullet.id ? { ...b, text: e.target.value } : b
              );
              updateItem(sectionId, itemId, { bullets: updated });
            }}
            placeholder="Describe your achievement or responsibility"
            rows={2}
          />
          <button
            className="icon-button ai-button"
            onClick={() => setEnhancingBullet({ itemId, bulletId: bullet.id, text: bullet.text })}
            title="Enhance with AI"
          >
            ✨
          </button>
          <button
            className="icon-button"
            onClick={() => {
              const updated = bullets.filter(b => b.id !== bullet.id);
              updateItem(sectionId, itemId, { bullets: updated });
            }}
          >
            ×
          </button>
        </div>
      ))}
      <button
        className="button button-sm button-outline"
        onClick={() => {
          const newBullet = { id: uuidv4(), text: '', order: bullets.length };
          updateItem(sectionId, itemId, { bullets: [...bullets, newBullet] });
        }}
      >
        + Add Bullet
      </button>
    </div>
  );
}

function getEmptyItemData(type) {
  switch (type) {
    case 'work':
      return {
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        bullets: []
      };
    case 'education':
      return {
        school: '',
        degree: '',
        field: '',
        location: '',
        startDate: '',
        endDate: '',
        gpa: '',
        achievements: []
      };
    case 'projects':
      return {
        name: '',
        description: '',
        technologies: '',
        link: '',
        bullets: []
      };
    case 'skills':
      return {
        category: '',
        skills: ''
      };
    default:
      return {};
  }
}

function getSectionItemLabel(type) {
  const labels = {
    work: 'Job',
    education: 'Education',
    projects: 'Project',
    skills: 'Skill Category'
  };
  return labels[type] || 'Item';
}
