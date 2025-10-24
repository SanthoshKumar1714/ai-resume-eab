import React, { useState, useEffect } from 'react';
import './WelcomeGuide.css';

export default function WelcomeGuide() {
  const [show, setShow] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has seen the guide
    const hasSeenGuide = localStorage.getItem('resumecraft_seen_guide');
    if (!hasSeenGuide) {
      setShow(true);
    }
  }, []);

  const steps = [
    {
      title: "Welcome to ResumeCraft! 🎉",
      content: "Build professional resumes with AI-powered assistance. Let's get you started!",
      icon: "👋"
    },
    {
      title: "Fill Your Information",
      content: "Start by adding your personal details, work experience, education, projects, and skills.",
      icon: "📝"
    },
    {
      title: "AI Enhancement Magic ✨",
      content: "Click the sparkle (✨) button next to any bullet point to enhance it with AI. You can also use the section-level AI enhancement for generating complete bullet points!",
      icon: "🤖"
    },
    {
      title: "Real-time Preview",
      content: "See your resume update instantly in the preview pane. Try switching between templates!",
      icon: "👁️"
    },
    {
      title: "Export & Share",
      content: "When you're done, export your resume as PDF with one click. Your progress is auto-saved!",
      icon: "📄"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  const handleClose = () => {
    localStorage.setItem('resumecraft_seen_guide', 'true');
    setShow(false);
  };

  if (!show) return null;

  const step = steps[currentStep];

  return (
    <div className="welcome-overlay" onClick={handleSkip}>
      <div className="welcome-card" onClick={(e) => e.stopPropagation()}>
        <div className="welcome-icon">{step.icon}</div>
        <h2>{step.title}</h2>
        <p>{step.content}</p>

        <div className="progress-dots">
          {steps.map((_, idx) => (
            <span
              key={idx}
              className={`dot ${idx === currentStep ? 'active' : ''} ${idx < currentStep ? 'completed' : ''}`}
            />
          ))}
        </div>

        <div className="welcome-actions">
          {currentStep > 0 && (
            <button className="button button-outline" onClick={() => setCurrentStep(currentStep - 1)}>
              ← Back
            </button>
          )}
          <button className="button button-gradient" onClick={handleNext}>
            {currentStep < steps.length - 1 ? 'Next →' : 'Get Started! 🚀'}
          </button>
        </div>

        <button className="skip-button" onClick={handleSkip}>
          Skip tutorial
        </button>
      </div>
    </div>
  );
}
