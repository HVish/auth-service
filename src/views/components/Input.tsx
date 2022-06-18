import React, { ReactNode } from 'react';
import clsx from 'clsx';
import styled from 'styled-components';

interface Props {
  autoComplete?: 'off' | 'name' | 'email' | 'new-password' | 'current-password';
  className?: string;
  error?: string;
  leftIcon?: ReactNode;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  rightIcon?: ReactNode;
  type: 'text' | 'password';
  value: string;
}

export const inputIconSize = `48px`;

const Root = styled.div`
  min-height: 74px;

  &.has-error {
    color: #f44336;
  }
`;

const InputIcon = styled.div`
  min-width: ${inputIconSize};
  text-align: center;
`;

const InputField = styled.input`
  flex: 1;
  min-width: 0;
  color: inherit;
  border: none;
  outline: none;
  padding: 1rem 0.25rem;
  font-size: 1rem;
  letter-spacing: 1px;
  background-color: transparent;
`;

const InputError = styled.div`
  line-height: 1.5;
`;

const InputHighlighter = styled.div`
  width: 100%;

  &::after,
  &::before {
    content: ' ';
    display: inline-block;
    height: 2px;
    position: absolute;
    bottom: 0;
  }

  &::before {
    background-color: #eee;
    width: 100%;
  }

  &::after {
    transform: scaleX(0);
    transform-origin: left;
    transition: transform ease 350ms;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  background-color: rgb(238 238 238 / 25%);

  ${InputField}:focus + ${InputHighlighter}::after {
    width: 100%;
    transform: scaleX(1);
    background-color: #2196f3;
  }
`;

const Input = ({
  autoComplete,
  className,
  error,
  leftIcon,
  onChange,
  placeholder,
  rightIcon,
  type,
  value,
}: Props) => {
  return (
    <Root
      className={clsx(className, {
        'has-error': Boolean(error),
      })}
    >
      <InputWrapper>
        {leftIcon && <InputIcon>{leftIcon}</InputIcon>}
        <InputField
          autoComplete={autoComplete}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        {rightIcon && <InputIcon>{rightIcon}</InputIcon>}
        <InputHighlighter />
      </InputWrapper>
      {error && <InputError>{error}</InputError>}
    </Root>
  );
};

export default Input;
