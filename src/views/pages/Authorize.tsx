import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import _ErrorIcon from '../assets/error.svg';
import Loader from '../components/Loader';
import { getAuthCode, verifyClient } from '../shared/api';
import { getAccessToken } from '../shared/session';

const Root = styled.div`
  background-color: rgb(0 0 0 / 50%);
  border-radius: 4px;
  width: 400px;
  max-width: 90%;
  min-height: 100px;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &.has-error {
    background-color: #fff;
    color: #f44336;
  }
`;

const ErrorMessage = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1.5;
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center;
`;

const ErrorIcon = styled(_ErrorIcon)`
  width: 50px;
  height: 50px;
  color: #f44336;
  margin-bottom: 1rem;
`;

const Authorize = () => {
  const { search } = useLocation();
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const query = new URLSearchParams(search);
    const clientId = query.get('clientId');
    const redirectURI = query.get('redirectURI');

    if (!clientId) {
      setError('clientId is not provided');
      return;
    }

    if (!redirectURI) {
      setError('redirectURI is not provided');
      return;
    }

    const accessToken = getAccessToken();

    if (!accessToken) {
      navigate('/login', { state: { clientId, redirectURI } });
      return;
    }

    verifyClient({ clientId, redirectURI })
      .then(({ valid }) => {
        if (!valid) throw new Error('Invalid clienId or redirectURI');
        return getAuthCode(clientId);
      })
      .then(({ authCode }) => {
        const search = new URLSearchParams({ authCode, status: 'success' });
        window.location.href = `${redirectURI}?${search.toString()}`;
      })
      .catch(err => {
        console.error(err);
        setError('Unable to verify client');
        setTimeout(() => {
          const search = new URLSearchParams({
            error: err.message,
            status: 'failed',
          });
          window.location.href = `${redirectURI}?${search.toString()}`;
        }, 5000);
      })
      .finally(() => {
        setIsVerifying(false);
      });
  }, [navigate, search]);

  return (
    <Root
      className={clsx({
        'has-error': Boolean(error),
      })}
    >
      {error && (
        <ErrorMessage>
          <ErrorIcon />
          <span>{error}</span>
        </ErrorMessage>
      )}
      {!error && isVerifying && <Loader />}
    </Root>
  );
};

export default Authorize;
