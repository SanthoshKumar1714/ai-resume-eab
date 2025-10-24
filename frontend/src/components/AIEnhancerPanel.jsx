import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import './AIEnhancerPanel.css';

export default function AIEnhancerPanel({ content, onApply, onClose, fieldType = 'bullet' }) {
  const { decrementAIRequests, aiRequestsRemaining, showNotification } = useApp();
  const [loading, setLoading] = useState(false);
  const [enhanced, setEnhanced] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(0);
  const [error, setError] = useState(null);

  const enhancementTypes = [
    { id: 'grammar_check', label: 'Fix Grammar', icon: '✓' },
    { id: 'action_verbs', label: 'Strengthen Action Verbs', icon: '⚡' },
    { id: 'bullet_rewrite', label: 'Rewrite Professionally', icon: '✨' },
  ];

  const handleEnhance = async (type) => {
    if (aiRequestsRemaining <= 0) {
      showNotification('Rate limit reached. Please wait a moment.', 'error');
      return;
    }

    if (!content || content.length < 5) {
      setError('Text too short to enhance (minimum 5 characters)');
      return;
    }

    if (content.length > 1000) {
      setError('Text too long (maximum 1000 characters)');
      return;
    }

    setLoading(true);
    setError(null);
    setEnhanced(null);
    setAlternatives([]);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/enhance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, content, context: { field: fieldType } })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Enhancement failed');
      }

      const data = await response.json();

      setEnhanced(data.enhanced);
      if (data.alternatives && data.alternatives.length > 0) {
        setAlternatives(data.alternatives);
      }

      decrementAIRequests();
      showNotification('Enhanced successfully!', 'success');
    } catch (err) {
      setError(err.message);
      showNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!enhanced) return;

    const textToApply = alternatives.length > 0
      ? alternatives[selectedVersion]
      : enhanced;

    onApply(textToApply);
    onClose();
  };

  return (
    <div className="ai-enhancer-overlay" onClick={onClose}>
      <div className="ai-enhancer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="enhancer-header">
          <h3>AI Enhancement Options</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="enhancer-content">
          <div className="original-text">
            <label>Original Text:</label>
            <p>{content}</p>
          </div>

          {!enhanced && !loading && (
            <div className="enhancement-buttons">
              {enhancementTypes.map(type => (
                <button
                  key={type.id}
                  className="button button-outline button-sm"
                  onClick={() => handleEnhance(type.id)}
                  disabled={aiRequestsRemaining <= 0}
                >
                  <span>{type.icon}</span> {type.label}
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div className="loading-state">
              <div className="spinner spinner-gradient"></div>
              <p>Enhancing with AI...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <p>{error}</p>
              <button className="button button-sm" onClick={() => setError(null)}>
                Try Again
              </button>
            </div>
          )}

          {enhanced && !loading && (
            <div className="enhanced-result">
              <label>Enhanced Text:</label>

              {alternatives.length > 0 ? (
                <div className="alternatives">
                  <div className="alternative-tabs">
                    {alternatives.map((_, idx) => (
                      <button
                        key={idx}
                        className={`alt-tab ${selectedVersion === idx ? 'active' : ''}`}
                        onClick={() => setSelectedVersion(idx)}
                      >
                        Version {idx + 1}
                      </button>
                    ))}
                  </div>
                  <p className="enhanced-text">{alternatives[selectedVersion]}</p>
                </div>
              ) : (
                <p className="enhanced-text">{enhanced}</p>
              )}

              <div className="action-buttons">
                <button className="button button-gradient" onClick={handleApply}>
                  Use This
                </button>
                <button className="button button-outline" onClick={onClose}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="requests-counter">
            <span className={aiRequestsRemaining < 3 ? 'low' : ''}>
              {aiRequestsRemaining} of 15 requests remaining this minute
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
