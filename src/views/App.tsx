import React from 'react';
import { Route, Routes } from 'react-router-dom';
import GlobalStyle from './components/GlobalStyle';
import Layout from './components/Layout';
import Authorize from './pages/Authorize';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import RegisterClient from './pages/RegisterClient';
import Signup from './pages/Signup';

export default function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="register-client" element={<RegisterClient />} />
          <Route path="authorize" element={<Authorize />} />
          <Route index element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
