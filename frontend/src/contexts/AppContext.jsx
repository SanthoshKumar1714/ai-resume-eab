import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

export function AppProvider({ children }) {
  const [currentRoute, setCurrentRoute] = useState('/');
  const [expandedSections, setExpandedSections] = useState([]);
  const [previewZoom, setPreviewZoom] = useState(100);
  const [showPreview, setShowPreview] = useState(true);
  const [aiRequestsRemaining, setAiRequestsRemaining] = useState(15);
  const [aiRateLimitResetTime, setAiRateLimitResetTime] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Reset AI requests counter every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setAiRequestsRemaining(15);
      setAiRateLimitResetTime(null);
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, []);

  // Navigation
  const navigate = (route) => {
    setCurrentRoute(route);
  };

  // Section expansion
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => {
      if (prev.includes(sectionId)) {
        return prev.filter(id => id !== sectionId);
      }
      return [...prev, sectionId];
    });
  };

  const expandAllSections = (sectionIds) => {
    setExpandedSections(sectionIds);
  };

  const collapseAllSections = () => {
    setExpandedSections([]);
  };

  const isSectionExpanded = (sectionId) => {
    return expandedSections.includes(sectionId);
  };

  // Zoom control
  const setZoom = (level) => {
    if ([75, 100, 125].includes(level)) {
      setPreviewZoom(level);
    }
  };

  // Preview toggle (for mobile)
  const togglePreview = () => {
    setShowPreview(prev => !prev);
  };

  // AI request tracking
  const decrementAIRequests = () => {
    setAiRequestsRemaining(prev => Math.max(0, prev - 1));

    // Set reset time if not already set
    if (!aiRateLimitResetTime) {
      setAiRateLimitResetTime(Date.now() + 60000);
    }
  };

  const resetAIRequests = () => {
    setAiRequestsRemaining(15);
    setAiRateLimitResetTime(null);
  };

  // Notifications
  const showNotification = (message, type = 'info') => {
    const id = Date.now();
    const notification = { id, message, type };

    setNotifications(prev => [...prev, notification]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      dismissNotification(id);
    }, 5000);

    return id;
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const value = {
    currentRoute,
    navigate,
    expandedSections,
    toggleSection,
    expandAllSections,
    collapseAllSections,
    isSectionExpanded,
    previewZoom,
    setZoom,
    showPreview,
    togglePreview,
    aiRequestsRemaining,
    aiRateLimitResetTime,
    decrementAIRequests,
    resetAIRequests,
    notifications,
    showNotification,
    dismissNotification
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
