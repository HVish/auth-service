import React from 'react';
import styled from 'styled-components';
import { Client, Client as ClientSummary } from '../shared/types';
import Ellipsize from './Ellipsize';

const Root = styled.div`
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #eee;
  box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.1);
  width: 300px;
  overflow: hidden;
  padding: 0.75rem 1rem;
  cursor: pointer;
  background-color: #fff;

  .label {
    font-weight: bold;
    margin-right: 4px;
  }

  .ellipsize {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const Header = styled.div`
  display: grid;
  grid-template-areas: 'client-logo client-name' 'client-logo client-id';
  grid-template-columns: min-content 1fr;
  gap: 8px;
  margin-bottom: 8px;
  grid-template-rows: 1fr 1fr;
  align-items: center;
`;

const Body = styled.div`
  display: grid;
  gap: 8px;
  background-color: #fff;
`;

const ClientLogoLetter = styled.div`
  grid-area: client-logo;
  margin-right: 8px;
  border-radius: 4px;
  font-size: 24px;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #eee;
`;

const ClientName = styled.div`
  grid-area: client-name;
  font-size: 20px;
  font-weight: bold;
`;

const ClientId = styled(Ellipsize)`
  grid-area: client-id;
  font-size: 12px;
`;

interface Props extends Client {
  className?: string;
}

const ClientSummary = ({
  className,
  clientId,
  createdOn,
  name,
  redirectURIs,
  status,
}: Props) => {
  const getInitialLetter = () => name[0].toLocaleUpperCase();
  return (
    <Root className={className}>
      <Header>
        <ClientLogoLetter>{getInitialLetter()}</ClientLogoLetter>
        <ClientName className="ellipsize">{name}</ClientName>
        <ClientId className="ellipsize" contentToCopy={clientId}>
          <span className="label">ID:</span>
          {clientId}
        </ClientId>
      </Header>
      <Body>
        <div className="label">Redirect URL(s):</div>
        {redirectURIs.map((url, index) => (
          <Ellipsize key={index}>{url}</Ellipsize>
        ))}
        <div>
          <span className="label">Created On:</span>
          {createdOn}
        </div>
        <div>
          <span className="label">Status:</span>
          {status}
        </div>
      </Body>
    </Root>
  );
};

export default ClientSummary;
