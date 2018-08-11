import React from 'react';
import styled from 'styled-components';
import Loader from './Loader';
import successState from '../assets/success-state.svg';
import defaultState from '../assets/default-state.svg';

const StyledTransactionStatus = styled.div`
  width: 100%;
`;

const StyledAsset = styled.div`
  width: 44px;
  height: 44px;
  background-size: cover;
  background-position: center;
`;

const StyledSuccess = styled(StyledAsset)`
  background: url(${successState}) no-repeat;
`;

const StyledDefault = styled(StyledAsset)`
  background: url(${defaultState}) no-repeat;
`;

const TransactionStatus = ({ status, ...props }) => (
  <StyledTransactionStatus {...props}>
    {() => {
      switch (status) {
        case 'pending':
          return <Loader />;
        case 'success':
          return <StyledSuccess />;
        default:
          return <StyledDefault />;
      }
    }}
  </StyledTransactionStatus>
);

export default TransactionStatus;
