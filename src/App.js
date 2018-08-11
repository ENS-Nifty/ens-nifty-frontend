import React from 'react';
import styled, { keyframes } from 'styled-components';
import logo from './logo.svg';
import { colors, fonts } from './styles';

const spin = keyframes`
  0% {
    transform: rotate(0deg)
  }
  100% {
    transform: rotate(360deg)
  }
`;

const StyledApp = styled.div`
  text-align: center;
`;

const StyledLogo = styled.img`
  height: 80px;
  animation: ${spin} infinite 20s linear;
`;

const StyledHeader = styled.header`
  background-color: #222;
  height: 150px;
  padding: 20px;
  color: rgb(${colors.white});
`;

const StyledTitle = styled.h1`
  font-size: ${fonts.size.h3};
`;

const StyledParagraph = styled.p`
  font-size: ${fonts.size.large};
  margin: 20px auto;
`;

const App = () => (
  <StyledApp>
    <StyledHeader>
      <StyledLogo src={logo} alt="logo" />
      <StyledTitle>Welcome to React</StyledTitle>
    </StyledHeader>
    <StyledParagraph>
      To get started, edit <code>src/App.js</code> and save to reload.
    </StyledParagraph>
  </StyledApp>
);

export default App;
