import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#131720',
            color: '#e8eaf0',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '999px',
            fontSize: '13px',
            fontFamily: "'DM Sans', sans-serif",
          },
          success: { iconTheme: { primary: '#00d4aa', secondary: '#131720' } },
          error:   { iconTheme: { primary: '#e53e3e', secondary: '#131720' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
