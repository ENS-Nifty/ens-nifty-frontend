import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { colors, fonts, transitions } from '../styles';

const StyledButton = styled.button`
  transition: ${transitions.base};
  border: none;
  border-style: none;
  box-sizing: border-box;
  border: ${({ outline }) => (outline) ? `1px solid rgb(${colors.blue})` : 'none'};
  background-color: ${({ outline, white }) => (outline || white) ? `rgb(${colors.white})` : `rgb(${colors.blue})`};
  color: ${({ outline, white }) => (outline || white) ? `rgb(${colors.blue})` : `rgb(${colors.white})`};
  border-radius: ${({ round }) => round ? '24px' : '2px'};
  font-size: ${fonts.medium};
  font-weight: 400;
  padding: 10px;
  margin: 5px auto;
  width: 150px;
  height: 36px;
  cursor: pointer;
  will-change: transform;

  @media (hover: hover) {
    &:hover {
      opacity: 0.6;
    }
  }
`;

const Button = ({ text, outline, white, round, ...otherProps }) => (
  <StyledButton outline={outline} white={white} round={round} {...otherProps}>
    {text}
  </StyledButton>
);

Button.propTypes = {
  text: PropTypes.string,
  outline: PropTypes.bool,
  white: PropTypes.bool,
  round: PropTypes.bool
};

Button.defaultProps = {
  text: '',
  outline: false,
  white: false,
  round: false
};

export default Button;
