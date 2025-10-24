import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ResumeContext = createContext();

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within ResumeProvider');
  }
  return context;
}

export function ResumeProvider({ children }) {
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [error, setError] = useState(null);

  // Auto-save to localStorage every 30 seconds
  useEffect(() => {
    if (!resume) return;

    const interval = setInterval(() => {
      const key = `resumecraft_draft_${resume.id}`;
      localStorage.setItem(key, JSON.stringify(resume));
      console.log('Auto-saved to localStorage');
    }, 30000);

    return () => clearInterval(interval);
  }, [resume]);

  // Initialize new resume
  const initializeResume = (templateId, sampleData = null) => {
    const newResume = sampleData || {
      id: uuidv4(),
      template: templateId,
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        github: '',
        portfolio: ''
      },
      sections: [],
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastSaved: null
      }
    };

    setResume(newResume);
    return newResume;
  };

  // Update personal info
  const updatePersonalInfo = (personalInfo) => {
    setResume(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...personalInfo },
      metadata: { ...prev.metadata, updatedAt: new Date().toISOString() }
    }));
  };

  // Add new section
  const addSection = (type) => {
    const newSection = {
      id: uuidv4(),
      type,
      title: getSectionTitle(type),
      order: resume.sections.length,
      items: []
    };

    setResume(prev => ({
      ...prev,
      sections: [...prev.sections, newSection],
      metadata: { ...prev.metadata, updatedAt: new Date().toISOString() }
    }));

    return newSection.id;
  };

  // Update section
  const updateSection = (sectionId, data) => {
    setResume(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...data } : section
      ),
      metadata: { ...prev.metadata, updatedAt: new Date().toISOString() }
    }));
  };

  // Delete section
  const deleteSection = (sectionId) => {
    setResume(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId),
      metadata: { ...prev.metadata, updatedAt: new Date().toISOString() }
    }));
  };

  // Reorder sections
  const reorderSections = (newOrder) => {
    setResume(prev => ({
      ...prev,
      sections: newOrder,
      metadata: { ...prev.metadata, updatedAt: new Date().toISOString() }
    }));
  };

  // Add item to section
  const addItem = (sectionId, itemData) => {
    const section = resume.sections.find(s => s.id === sectionId);
    if (!section) return;

    const newItem = {
      id: uuidv4(),
      order: section.items.length,
      ...itemData
    };

    updateSection(sectionId, {
      items: [...section.items, newItem]
    });

    return newItem.id;
  };

  // Update item in section
  const updateItem = (sectionId, itemId, data) => {
    const section = resume.sections.find(s => s.id === sectionId);
    if (!section) return;

    const updatedItems = section.items.map(item =>
      item.id === itemId ? { ...item, ...data } : item
    );

    updateSection(sectionId, { items: updatedItems });
  };

  // Delete item from section
  const deleteItem = (sectionId, itemId) => {
    const section = resume.sections.find(s => s.id === sectionId);
    if (!section) return;

    const updatedItems = section.items.filter(item => item.id !== itemId);
    updateSection(sectionId, { items: updatedItems });
  };

  // Reorder items within section
  const reorderItems = (sectionId, newOrder) => {
    updateSection(sectionId, { items: newOrder });
  };

  // Set template
  const setTemplate = (templateId) => {
    setResume(prev => ({
      ...prev,
      template: templateId,
      metadata: { ...prev.metadata, updatedAt: new Date().toISOString() }
    }));
  };

  // Save resume to server
  const saveResume = async () => {
    if (!resume) return;

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/save-resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume })
      });

      if (!response.ok) {
        throw new Error('Failed to save resume');
      }

      const data = await response.json();
      setLastSaved(data.savedAt);

      // Clear localStorage draft after successful save
      const key = `resumecraft_draft_${resume.id}`;
      localStorage.removeItem(key);

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // Load resume from server
  const loadResume = async (resumeId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/resume/${resumeId}`);

      if (!response.ok) {
        throw new Error('Failed to load resume');
      }

      const data = await response.json();
      setResume(data.resume);
      return data.resume;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Load from localStorage
  const loadFromLocalStorage = (resumeId) => {
    try {
      const key = `resumecraft_draft_${resumeId}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        setResume(JSON.parse(saved));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to load from localStorage:', err);
      return false;
    }
  };

  // Reset resume
  const resetResume = () => {
    setResume(null);
    setLastSaved(null);
    setError(null);
  };

  // Helper function to get default section title
  function getSectionTitle(type) {
    const titles = {
      work: 'Work Experience',
      education: 'Education',
      projects: 'Projects',
      skills: 'Technical Skills'
    };
    return titles[type] || 'Section';
  }

  const value = {
    resume,
    isLoading,
    isSaving,
    lastSaved,
    error,
    initializeResume,
    updatePersonalInfo,
    addSection,
    updateSection,
    deleteSection,
    reorderSections,
    addItem,
    updateItem,
    deleteItem,
    reorderItems,
    setTemplate,
    saveResume,
    loadResume,
    loadFromLocalStorage,
    resetResume
  };

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
}
