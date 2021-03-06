import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgb(183, 233, 225);
  min-height: 100vh;
  padding: 80px 0;
  background: linear-gradient(
    45deg,
    #b7e9e1 0%,
    #b7e9e1 50%,
    #db592f 50%,
    #db592f 55%,
    #eb6333 55%,
    #eb6333 100%
  );

  @media (max-width: 481px) {
    background: linear-gradient(
        210deg,
        rgba(235, 99, 51, 0) 0%,
        rgba(235, 99, 51, 0) 65%,
        #db592f 65%,
        #db592f 70%,
        #eb6333 70%,
        #e57247 70%,
        #b7e9e1 70%,
        #b7e9e1 100%
      ),
      linear-gradient(
        145deg,
        rgba(235, 99, 51, 0) 70%,
        #eb6333 70%,
        #eb6333 85%
      ),
      linear-gradient(
        145deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0) 50%,
        #76c6cd 50%,
        #76c6cd 60%,
        #7cd0d7 60%,
        #7cd0d7 70%,
        rgba(0, 0, 0, 0) 70%,
        rgba(0, 0, 0, 0) 85%
      ),
      linear-gradient(
        210deg,
        rgba(72, 161, 171, 0) 50%,
        #48a1ab 50%,
        #48a1ab 65%,
        rgba(73, 162, 173, 0) 65%
      ),
      linear-gradient(
        145deg,
        #1b3d4f 0%,
        #1b3d4f 40%,
        #1f4558 40%,
        #1f4558 50%,
        rgba(0, 0, 0, 0) 50%,
        rgba(0, 0, 0, 0) 85%
      );
  }
`;

const Layout = () => {
  return (
    <Root>
      <Outlet />
    </Root>
  );
};

export default Layout;
