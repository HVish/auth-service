import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

window.addEventListener('load', () => {
  ReactDOM.hydrateRoot(
    document,
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
});
