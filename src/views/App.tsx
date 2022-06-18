import React from 'react';
import { Route, Routes } from 'react-router-dom';
import GlobalStyle from './components/GlobalStyle';
import Layout from './components/Layout';
import Authorize from './pages/Authorize';
import Login from './pages/Login';
import RegisterClient from './pages/RegisterClient';
import Signup from './pages/Signup';

export default function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="register-client" element={<RegisterClient />} />
          <Route path="authorize" element={<Authorize />} />
        </Route>
      </Routes>
    </>
  );
}
