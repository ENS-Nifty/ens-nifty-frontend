import React from 'react';
import styled from 'styled-components';
import BaseLayout from '../layouts/base';

const StyledWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px;
  text-align: center;
  height: 360px;
`;

const Domains = () => (
  <BaseLayout>
    <StyledWrapper>
      <h3>{'Your Registered Domains'}</h3>
    </StyledWrapper>
  </BaseLayout>
);
export default Domains;
