import React, { FormEventHandler, useState } from 'react';
import Input from '../components/Input';
import EmailIcon from '../assets/email.svg';
import PersonIcon from '../assets/person.svg';
import Button from '../components/Button';
import Password from '../components/Password';
import { signup } from '../shared/api';
import { setAccessToken } from '../shared/session';
import { useClientParams } from '../shared/hooks';
import AuthForm from '../components/AuthForm';

const Signup = () => {
  const { authorize } = useClientParams();

  const [isSigningUp, setIsSigningUp] = useState(false);

  const [name, setName] = useState({
    value: '',
    error: '',
  });

  const [email, setEmail] = useState({
    value: '',
    error: '',
  });

  const [password, setPassword] = useState({
    value: '',
    error: '',
  });

  const handleSubmit: FormEventHandler = async e => {
    e.preventDefault();

    let hasError = false;

    if (!name.value) {
      setName(state => ({ ...state, error: 'This field is required' }));
      hasError = true;
    }

    if (!email.value) {
      setEmail(state => ({ ...state, error: 'This field is required' }));
      hasError = true;
    }

    if (!password.value) {
      setPassword(state => ({ ...state, error: 'This field is required' }));
      hasError = true;
    }

    if (hasError) return;

    setIsSigningUp(true);

    try {
      const response = await signup({
        name: name.value,
        username: email.value,
        password: password.value,
      });
      setAccessToken(response.accessToken.value);
      setIsSigningUp(false);
      authorize();
    } catch (error) {
      console.error(error);
      setIsSigningUp(false);
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
    <AuthForm title="Create account" onSubmit={handleSubmit}>
      <Input
        type="text"
        autoComplete="name"
        leftIcon={<PersonIcon />}
        value={name.value}
        error={name.error}
        placeholder="Name"
        onChange={e => setName({ value: e.target.value, error: '' })}
      />
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
        autoComplete="new-password"
        value={password.value}
        error={password.error}
        placeholder="Password"
        onChange={e => setPassword({ value: e.target.value, error: '' })}
      />
      <Button type="submit" isLoading={isSigningUp}>
        Sign up
      </Button>
    </AuthForm>
  );
};

export default Signup;
