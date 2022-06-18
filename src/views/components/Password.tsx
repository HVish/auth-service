import React, { useState } from 'react';

import EyeIcon from '../assets/eye.svg';
import EyeCloseIcon from '../assets/eye-close.svg';
import LockIcon from '../assets/lock.svg';
import Input, { inputIconSize } from './Input';
import styled from 'styled-components';

interface Props {
  autoComplete?: 'new-password' | 'current-password';
  error?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  value: string;
}

const RightIcon = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  width: ${inputIconSize};
  height: ${inputIconSize};
`;

const Password = ({
  autoComplete,
  error,
  onChange,
  placeholder,
  value,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Input
      autoComplete={autoComplete}
      type={showPassword ? 'text' : 'password'}
      error={error}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      leftIcon={<LockIcon />}
      rightIcon={
        <RightIcon
          type="button"
          onClick={e => {
            e.stopPropagation();
            setShowPassword(show => !show);
          }}
        >
          {showPassword ? <EyeCloseIcon /> : <EyeIcon />}
        </RightIcon>
      }
    />
  );
};

export default Password;
