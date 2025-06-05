// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// ▶️ Import the achievements provider:
import { AchievementsProvider } from './Authorization/AchievementsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Wrap App in AchievementsProvider */}
    <AchievementsProvider>
      <App />
    </AchievementsProvider>
  </React.StrictMode>
);

reportWebVitals();
