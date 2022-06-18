import React from 'react';
import { Express } from 'express';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';

import App from './App';

export function registerUI(app: Express) {
  app.use('/*', (req, res) => {
    const html = ReactDOMServer.renderToString(
      <StaticRouter location={req.originalUrl}>
        <App />
      </StaticRouter>
    );
    res.send('<!DOCTYPE html>' + html);
  });
}
