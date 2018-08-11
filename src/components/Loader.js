import React from 'react';
import styled, { keyframes } from 'styled-components';
import { colors } from '../styles';

const load = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const StyledLoader = styled.div`
  position: relative;
  font-size: 10px;
  margin: 0 auto;
  text-indent: -9999em;
  width: 8em;
  height: 8em;
  border-radius: 50%;
  background: rgb(${colors.blue});
  background: linear-gradient(to right, rgb(${colors.blue}) 10%, rgba(${colors.dark}, 0) 42%);
  animation: ${load} 1.4s infinite linear;
  transform: translateZ(0);

  &:before {
    width: 50%;
    height: 50%;
    background: rgb(${colors.blue});
    border-radius: 100% 0 0 0;
    position: absolute;
    top: 0;
    left: 0;
    content: '';
  }

  &:after {
    background: rgb(${colors.dark});
    width: 75%;
    height: 75%;
    border-radius: 50%;
    content: '';
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
`;

const Loader = () => <StyledLoader />;

export default Loader;
