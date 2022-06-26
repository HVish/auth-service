import React, { ReactNode, useRef, useState } from 'react';
import styled from 'styled-components';

import CopyIcon from '../assets/copy.svg';
import DoneIcon from '../assets/done.svg';

const Root = styled.div`
  position: relative;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  background-color: #eee;
  min-height: 24px;
  line-height: 24px;
  padding-left: 8px;
  padding-right: 30px;
  border-radius: 4px;
  border: 1px solid rgba(131, 131, 131, 0.25);

  .icon {
    position: absolute;
    right: 0;
    width: 24px;
    height: 24px;
    padding: 2px;

    &.green {
      color: #009688;
    }

    path {
      fill: currentColor;
    }
  }
`;

function fallbackCopyTextToClipboard(text: string) {
  const textArea = document.createElement('textarea');
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  return new Promise<void>((resolve, reject) => {
    try {
      document.execCommand('copy');
      resolve();
    } catch (err) {
      reject(err);
    }
    document.body.removeChild(textArea);
  });
}

function copyTextToClipboard(text: string) {
  if (!navigator.clipboard) return fallbackCopyTextToClipboard(text);
  return navigator.clipboard.writeText(text);
}

interface Props {
  className?: string;
  contentToCopy?: string;
  children: ReactNode;
}

const Ellipsize = ({ className, contentToCopy, children }: Props) => {
  const [isCopied, setIsCopied] = useState(false);

  const contentRef = useRef<HTMLSpanElement>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    const content = contentToCopy || contentRef.current?.innerText;
    if (!content) return;

    copyTextToClipboard(content).then(() => {
      setIsCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <Root className={className} title="click to copy" onClick={handleClick}>
      <span ref={contentRef}>{children}</span>
      {isCopied ? (
        <DoneIcon className="icon green" />
      ) : (
        <CopyIcon className="icon" />
      )}
    </Root>
  );
};

export default Ellipsize;
