import React, { FormEventHandler, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Input from '../components/Input';
import EmailIcon from '../assets/email.svg';
import Button from '../components/Button';
import Password from '../components/Password';
import { login } from '../shared/api';
import { getAccessToken, setAccessToken } from '../shared/session';
import { useClientParams } from '../shared/hooks';
import AuthForm from '../components/AuthForm';

const Login = () => {
  const navigate = useNavigate();
  const { authorize } = useClientParams();

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [email, setEmail] = useState({
    value: '',
    error: '',
  });

  const [password, setPassword] = useState({
    value: '',
    error: '',
  });

  useEffect(() => {
    const isAuthorized = getAccessToken();
    if (isAuthorized) return navigate('/dashboard');
  }, [navigate]);

  const handleSubmit: FormEventHandler = async e => {
    e.preventDefault();

    let hasError = false;

    if (!email.value) {
      setEmail(state => ({ ...state, error: 'This field is required' }));
      hasError = true;
    }

    if (!password.value) {
      setPassword(state => ({ ...state, error: 'This field is required' }));
      hasError = true;
    }

    if (hasError) return;

    setIsLoggingIn(true);

    try {
      const response = await login({
        username: email.value,
        password: password.value,
      });
      setAccessToken(response.accessToken.value);
      setIsLoggingIn(false);
      authorize();
    } catch (error) {
      console.error(error);
      setIsLoggingIn(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any).response?.data.message) {
        setPassword(state => ({
          ...state,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          error: (error as any).response.data.message,
        }));
      }
    }
  };

  return (
    <AuthForm title="My account" onSubmit={handleSubmit}>
      <Input
        type="text"
        autoComplete="email"
        leftIcon={<EmailIcon />}
        value={email.value}
        error={email.error}
        placeholder="Email"
        onChange={e => setEmail({ value: e.target.value, error: '' })}
      />
      <Password
        autoComplete="current-password"
        value={password.value}
        error={password.error}
        placeholder="Password"
        onChange={e => setPassword({ value: e.target.value, error: '' })}
      />
      <Button type="submit" isLoading={isLoggingIn}>
        Sign in
      </Button>
    </AuthForm>
  );
};

export default Login;
