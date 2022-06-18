import React, {
  MouseEvent,
  MouseEventHandler,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components';
import Loader from './Loader';

interface Props {
  className?: string;
  children: ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  onClick?(e: MouseEvent): Promise<unknown>;
  /**
   * @default 'button'
   */
  type?: 'button' | 'submit';
}

const Root = styled.button`
  background-color: #eb6333;
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;
  width: 100%;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  font-weight: bold;
  position: relative;
  min-height: 50px;

  &:disabled {
    cursor: default;
  }
`;

const ButtonLoader = styled(Loader)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Button = ({
  className,
  children,
  disabled,
  isLoading: _isLoading,
  onClick,
  type = 'button',
}: Props) => {
  const [isLoading, setIsLoading] = useState(_isLoading);

  useEffect(() => setIsLoading(_isLoading), [_isLoading]);

  const handleClick: MouseEventHandler = async e => {
    if (!onClick) return;
    setIsLoading(true);
    await onClick(e);
    setIsLoading(false);
  };

  return (
    <Root
      className={className}
      disabled={disabled || isLoading}
      type={type}
      onClick={handleClick}
    >
      {isLoading ? <ButtonLoader /> : children}
    </Root>
  );
};

export default Button;
