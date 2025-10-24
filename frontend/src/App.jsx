import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ResumeProvider } from './contexts/ResumeContext';
import { AppProvider } from './contexts/AppContext';
import TemplateSelector from './components/TemplateSelector';
import ResumeBuilder from './components/ResumeBuilder';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ResumeProvider>
          <div className="app">
            <Routes>
              <Route path="/" element={<TemplateSelector />} />
              <Route path="/builder" element={<ResumeBuilder />} />
            </Routes>
            <Notifications />
          </div>
        </ResumeProvider>
      </AppProvider>
    </BrowserRouter>
  );
}

// Notifications component
function Notifications() {
  const { useApp } = require('./contexts/AppContext');
  const { notifications, dismissNotification } = useApp();

  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <div className="notifications-container">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
        >
          <span>{notification.message}</span>
          <button
            className="notification-close"
            onClick={() => dismissNotification(notification.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
