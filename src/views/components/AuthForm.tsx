import React from 'react';
import styled from 'styled-components';
import _AccountIcon from '../assets/account.svg';

interface Props {
  children: React.ReactNode;
  isSubmitted?: boolean;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  title: string;
}

const Root = styled.div`
  width: 360px;
  min-height: 400px;
  border-radius: 6px;
  box-shadow: rgb(0 0 0 / 30%) 0px 15px 20px 0px;
  padding: 2rem;
  padding-top: 60px;
  max-width: 90%;
  position: relative;
  background: radial-gradient(
    circle at 50% 0%,
    rgba(255, 255, 255, 0) 64px,
    rgb(255 255 255) 0
  );
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2rem;
`;

const AccountIcon = styled(_AccountIcon)`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 110px;
  height: 110px;
  color: #fff;
`;

const AuthForm = ({
  children,
  isSubmitted = false,
  onSubmit,
  title,
}: Props) => {
  return (
    <Root>
      <Title>{title}</Title>
      <AccountIcon />
      {isSubmitted ? children : <form onSubmit={onSubmit}>{children}</form>}
    </Root>
  );
};

export default AuthForm;
