import React from 'react';
import { Express } from 'express';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

import App from './App';
import html from './html.template';

export function registerUI(app: Express) {
  app.use('/*', (req, res, next) => {
    const sheet = new ServerStyleSheet();
    try {
      const body = ReactDOMServer.renderToString(
        <StyleSheetManager sheet={sheet.instance}>
          <StaticRouter location={req.originalUrl}>
            <App />
          </StaticRouter>
        </StyleSheetManager>
      );
      const styles = sheet.getStyleTags();
      res.send(
        html({
          title: 'Auth',
          body,
          styles,
        })
      );
    } catch (error) {
      next(error);
    } finally {
      sheet.seal();
    }
  });
}
