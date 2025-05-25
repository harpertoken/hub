// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './theme.css';
import './animations.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Simulate loading time
setTimeout(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}, 2000);