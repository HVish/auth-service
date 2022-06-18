import React from 'react';
import styled, { keyframes } from 'styled-components';

interface Props {
  className?: string;
}

const loader1 = keyframes`
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
`;

const loader2 = keyframes`
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
`;

const loader3 = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
`;

const Root = styled.div`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;

  div {
    position: absolute;
    top: 33px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #fff;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }

  div:nth-child(1) {
    left: 8px;
    animation: ${loader1} 0.6s infinite;
  }

  div:nth-child(2) {
    left: 8px;
    animation: ${loader2} 0.6s infinite;
  }

  div:nth-child(3) {
    left: 32px;
    animation: ${loader2} 0.6s infinite;
  }

  div:nth-child(4) {
    left: 56px;
    animation: ${loader3} 0.6s infinite;
  }
`;

const Loader = ({ className }: Props) => {
  return (
    <Root className={className}>
      <div />
      <div />
      <div />
      <div />
    </Root>
  );
};

export default Loader;
