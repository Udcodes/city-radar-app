import React from 'react';
import styled, { css } from 'styled-components';

export const StyledButton = styled.button.attrs((props) => ({
  ...props,
}))`
  outline: none !important;
  border: none !important;
  background: #0052cc;
  font-size: 16px;
  font-weight: 600;
  border-radius: 4px;
  padding: 14px 18px;
  padding-top: 12px;
  padding-bottom: 12px;
  /* width: 132px; */
  width: fit-content;
  color: #ffffff;
  transition: all 300ms ease-in-out;
  width: fit-content;
  height: fit-content;
  cursor: pointer;

  &:last-child {
    margin-right: 0;
  }

  &:disabled {
    width: 132px;
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:hover {
    box-shadow: 0px 8px 26px rgba(0, 0, 0, 0.23);
  }

  ${(props) =>
    props.fullWidth &&
    css`
      width: 100%;
    `}

  ${(props) =>
    props.sm &&
    css`
      padding: 10px 12px;
    `}

  ${(props) =>
    props.bgColor &&
    css`
      background: ${props.bgColor};
    `}

  ${(props) =>
    props.textColor &&
    css`
      color: ${props.textColor};
    `}
`;

export const Button = (props) => <StyledButton {...props} />;
