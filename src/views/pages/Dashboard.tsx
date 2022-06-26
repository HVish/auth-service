import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ClientSummary from '../components/ClientSummary';
import { getMyClients } from '../shared/api';
import { clearSession, getAccessToken } from '../shared/session';
import { Client } from '../shared/types';

const Root = styled.div`
  display: grid;
  background-color: #fff;
  grid-template-areas:
    'title logout'
    'body body';
  grid-template-rows: 90px 1fr;
  grid-template-columns: 1fr auto;
  max-width: 1024px;
  min-height: 100vh;
  margin: auto;
`;

const Title = styled.div`
  grid-area: title;
  padding-left: 2rem;
  align-self: center;
  font-weight: bold;
  font-size: 1.5rem;
  color: #616161;
`;

const Logout = styled.button`
  grid-area: logout;
  width: 100px;
  border: none;
  align-self: center;
  margin-right: 2rem;
  padding: 0.75rem 1rem;
  background: #0b97ff;
  color: #fff;
  font-weight: bold;
  font-size: 1rem;
  border-radius: 4px;
  box-shadow: 0 0 8px 1px rgb(0 0 0 / 25%);
`;

const Body = styled.div`
  grid-area: body;
  padding: 1rem 2rem;
`;

const Dashboard = () => {
  const navigate = useNavigate();

  const [{ isLoading, clients }, setState] = useState({
    isLoading: true,
    clients: [] as Client[],
  });

  const handleLogout = () => {
    clearSession();
    return navigate('/login');
  };

  useEffect(() => {
    const isAuthorized = getAccessToken();

    if (!isAuthorized) return navigate('/login');

    getMyClients()
      .then(clients => {
        setState({ isLoading: false, clients });
      })
      .catch(() => {
        setState({ isLoading: false, clients: [] });
      });
  }, [navigate]);

  return (
    <Root>
      <Title>Your apps</Title>
      <Logout onClick={handleLogout}>Logout</Logout>
      <Body>
        {isLoading
          ? 'Loading...'
          : clients.map(client => (
              <ClientSummary key={client._id} {...client} />
            ))}
        {/* TODO: add client button here */}
      </Body>
    </Root>
  );
};

export default Dashboard;
