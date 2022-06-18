import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <html>
      <head>
        <title>Auth</title>
      </head>
      <body>
        <Routes>
          <Route
            path="/about"
            element={
              <div>
                About
                <Link to="/">Go Home</Link>
              </div>
            }
          />
          <Route
            path="/"
            element={
              <div>
                Home<Link to="/about">About us</Link>
              </div>
            }
          />
        </Routes>
        <script src="/main.js" />
      </body>
    </html>
  );
}
