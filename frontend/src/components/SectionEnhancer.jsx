import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import './SectionEnhancer.css';

export default function SectionEnhancer({ section, item, onApply, onClose }) {
  const { decrementAIRequests, aiRequestsRemaining, showNotification } = useApp();
  const [mode, setMode] = useState('generate'); // 'generate' or 'enhance'
  const [userDemand, setUserDemand] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerateBullets = async () => {
    if (aiRequestsRemaining <= 0) {
      showNotification('Rate limit reached. Please wait a moment.', 'error');
      return;
    }

    if (!userDemand || userDemand.length < 10) {
      setError('Please provide more details (at least 10 characters)');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const enhanceType = section.type === 'work' ? 'generate_work_bullets' : 'generate_project_bullets';

      const contextData = section.type === 'work'
        ? { jobInfo: { position: item.position, company: item.company }, userDemand }
        : { projectInfo: { name: item.name, technologies: item.technologies }, userDemand };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/enhance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: enhanceType,
          context: contextData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Generation failed');
      }

      const data = await response.json();
      setResult(data.bullets);
      decrementAIRequests();
      showNotification('Bullets generated successfully!', 'success');
    } catch (err) {
      setError(err.message);
      showNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEnhanceSection = async () => {
    if (aiRequestsRemaining <= 0) {
      showNotification('Rate limit reached. Please wait a moment.', 'error');
      return;
    }

    if (!userDemand || userDemand.length < 10) {
      setError('Please describe your enhancement goal (at least 10 characters)');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Serialize current section content
      const sectionContent = item ? JSON.stringify(item, null, 2) : 'Empty section';

      const response = await fetch(`${import.meta.env.VITE_API_URL}/enhance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'enhance_section_custom',
          content: sectionContent,
          context: {
            sectionType: section.type,
            userDemand
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Enhancement failed');
      }

      const data = await response.json();
      setResult(data.enhanced);
      decrementAIRequests();
      showNotification('Section enhanced successfully!', 'success');
    } catch (err) {
      setError(err.message);
      showNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyBullets = () => {
    if (!result || !Array.isArray(result)) return;
    onApply(result);
    onClose();
  };

  return (
    <div className="section-enhancer-overlay" onClick={onClose}>
      <div className="section-enhancer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="enhancer-header">
          <h3>✨ AI Section Enhancement</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="enhancer-content">
          {/* Mode Selection */}
          <div className="mode-tabs">
            <button
              className={`mode-tab ${mode === 'generate' ? 'active' : ''}`}
              onClick={() => setMode('generate')}
            >
              🎯 Generate Content
            </button>
            <button
              className={`mode-tab ${mode === 'enhance' ? 'active' : ''}`}
              onClick={() => setMode('enhance')}
            >
              ⚡ Enhance Existing
            </button>
          </div>

          {/* Generate Mode */}
          {mode === 'generate' && (
            <div className="generate-mode">
              <div className="info-box">
                <p><strong>🚀 Generate Bullet Points</strong></p>
                <p>Describe what you want to highlight and AI will generate professional bullet points for you.</p>
              </div>

              <div className="input-group">
                <label>What do you want to emphasize?</label>
                <textarea
                  value={userDemand}
                  onChange={(e) => setUserDemand(e.target.value)}
                  placeholder={getPlaceholder(section.type)}
                  rows={5}
                  className="demand-input"
                />
                <small className="char-count">{userDemand.length} characters</small>
              </div>

              {!loading && !result && (
                <button
                  className="button button-gradient"
                  onClick={handleGenerateBullets}
                  disabled={aiRequestsRemaining <= 0 || userDemand.length < 10}
                >
                  🎨 Generate Bullets
                </button>
              )}
            </div>
          )}

          {/* Enhance Mode */}
          {mode === 'enhance' && (
            <div className="enhance-mode">
              <div className="info-box">
                <p><strong>⚡ Enhance Your Section</strong></p>
                <p>Tell AI what you want to improve and get specific recommendations.</p>
              </div>

              <div className="input-group">
                <label>What's your enhancement goal?</label>
                <textarea
                  value={userDemand}
                  onChange={(e) => setUserDemand(e.target.value)}
                  placeholder="E.g., 'Make it more quantifiable and achievement-focused' or 'Emphasize leadership and team collaboration' or 'Add more technical depth'"
                  rows={4}
                  className="demand-input"
                />
                <small className="char-count">{userDemand.length} characters</small>
              </div>

              {!loading && !result && (
                <button
                  className="button button-gradient"
                  onClick={handleEnhanceSection}
                  disabled={aiRequestsRemaining <= 0 || userDemand.length < 10}
                >
                  ⚡ Get Recommendations
                </button>
              )}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="loading-state">
              <div className="spinner spinner-gradient"></div>
              <p>AI is working on your request...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="error-state">
              <p>{error}</p>
              <button className="button button-sm" onClick={() => setError(null)}>
                Try Again
              </button>
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <div className="results-container">
              <div className="results-header">
                <h4>✨ Generated Results</h4>
              </div>

              {mode === 'generate' && Array.isArray(result) ? (
                <div className="generated-bullets">
                  {result.map((bullet, idx) => (
                    <div key={idx} className="generated-bullet">
                      <span className="bullet-number">{idx + 1}</span>
                      <p>{bullet}</p>
                    </div>
                  ))}
                  <div className="action-buttons">
                    <button className="button button-gradient" onClick={handleApplyBullets}>
                      ✓ Use These Bullets
                    </button>
                    <button className="button button-outline" onClick={() => setResult(null)}>
                      ↻ Try Different Description
                    </button>
                  </div>
                </div>
              ) : (
                <div className="enhancement-suggestions">
                  <div className="suggestion-content">
                    {result}
                  </div>
                  <div className="action-buttons">
                    <button className="button button-outline" onClick={() => setResult(null)}>
                      ↻ Try Different Goal
                    </button>
                    <button className="button button-sm" onClick={onClose}>
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Rate Limit Info */}
          <div className="requests-counter">
            <span className={aiRequestsRemaining < 3 ? 'low' : ''}>
              {aiRequestsRemaining} of 15 AI requests remaining this minute
            </span>
          </div>

          {/* Tips */}
          {!result && !loading && (
            <div className="tips-section">
              <p><strong>💡 Tips for better results:</strong></p>
              <ul>
                <li>Be specific about accomplishments and metrics</li>
                <li>Mention technologies, tools, or methodologies used</li>
                <li>Include the impact or outcome of your work</li>
                <li>Describe your role and responsibilities clearly</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getPlaceholder(sectionType) {
  const placeholders = {
    work: "E.g., 'I led a team of 5 developers to build a customer portal that increased user engagement by 40%. Used React, Node.js, and AWS. Implemented CI/CD pipeline and reduced deployment time by 60%.'",
    projects: "E.g., 'Built a real-time chat application using WebSocket and Redis. Handled 10k+ concurrent users. Implemented end-to-end encryption and user authentication with JWT.'",
    education: "E.g., 'Dean's List all semesters. Led computer science club. Completed capstone project on machine learning. Relevant coursework: Data Structures, Algorithms, AI.'",
    skills: "E.g., 'Frontend: React, Vue, TypeScript. Backend: Node.js, Python, PostgreSQL. DevOps: Docker, Kubernetes, AWS. Tools: Git, VS Code, Postman.'"
  };
  return placeholders[sectionType] || 'Describe what you want to include...';
}
