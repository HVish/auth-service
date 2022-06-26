import React, { FormEventHandler, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Input from '../components/Input';
import LinkIcon from '../assets/link.svg';
import PersonIcon from '../assets/person.svg';
import VerifiedIcon from '../assets/verified.svg';
import Button from '../components/Button';
import Password from '../components/Password';
import { registerClient } from '../shared/api';
import AuthForm from '../components/AuthForm';

const CreatedRoot = styled.div`
  text-align: center;
  margin-top: 2.5rem;
`;

const DashboardLink = styled(Link)`
  position: absolute;
  display: block;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 2rem;
`;

const RegisterClient = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCreated, setIsCreated] = useState(true);

  const [name, setName] = useState({
    value: '',
    error: '',
  });

  const [secret, setSecret] = useState({
    value: '',
    error: '',
  });

  const [redirect, setRedirect] = useState({
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

    if (!secret.value) {
      setSecret(state => ({ ...state, error: 'This field is required' }));
      hasError = true;
    }

    if (!redirect.value) {
      setRedirect(state => ({ ...state, error: 'This field is required' }));
      hasError = true;
    }

    if (hasError) return;

    setIsRegistering(true);

    try {
      await registerClient({
        name: name.value,
        secret: secret.value,
        logo: 'https://s3.ap-south-1.amazonaws.com/missioneasyclasses.com/public/images/thumbnail.png',
        redirectURIs: [redirect.value],
      });
      setIsRegistering(false);
      setIsCreated(true);
    } catch (error) {
      console.error(error);
      setIsRegistering(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any).response?.data.message) {
        setSecret(state => ({
          ...state,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          error: (error as any).response.data.message,
        }));
      }
    }
  };

  return (
    <AuthForm
      isSubmitted={isCreated}
      title="Register Client"
      onSubmit={handleSubmit}
    >
      {isCreated ? (
        <CreatedRoot>
          <VerifiedIcon width={48} height={48} color="#43a047" />
          <p>
            An account for <strong>{name.value}</strong> has been created.
          </p>
          <DashboardLink to="/dashboard">
            <Button type="button">Go to Dashboard</Button>
          </DashboardLink>
        </CreatedRoot>
      ) : (
        <>
          <Input
            type="text"
            autoComplete="name"
            leftIcon={<PersonIcon />}
            value={name.value}
            error={name.error}
            placeholder="Client name"
            onChange={e => setName({ value: e.target.value, error: '' })}
          />
          <Password
            autoComplete="new-password"
            value={secret.value}
            error={secret.error}
            placeholder="Password"
            onChange={e => setSecret({ value: e.target.value, error: '' })}
          />
          <Input
            type="text"
            leftIcon={<LinkIcon />}
            value={redirect.value}
            error={redirect.error}
            placeholder="Redirect URL"
            onChange={e => setRedirect({ value: e.target.value, error: '' })}
          />
          <Button type="submit" isLoading={isRegistering}>
            Register
          </Button>
        </>
      )}
    </AuthForm>
  );
};

export default RegisterClient;
