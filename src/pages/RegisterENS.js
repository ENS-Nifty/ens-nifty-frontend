import React from 'react';
import styled from 'styled-components';
import BaseLayout from '../layouts/base';

const StyledWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  text-align: center;
  height: 360px;
`;

const RegisterENS = () => (
  <BaseLayout>
    <StyledWrapper>
      <h3>{'Register ENS'}</h3>
    </StyledWrapper>
  </BaseLayout>
);
export default RegisterENS;
