import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

window.addEventListener('load', () => {
  ReactDOM.hydrateRoot(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    document.getElementById('app')!,
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
});
