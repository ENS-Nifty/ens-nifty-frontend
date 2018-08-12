import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import BaseLayout from '../layouts/base';
import TransactionStatus from '../components/TransactionStatus';
import Button from '../components/Button';
import { untokenizeSubmitTransaction } from '../reducers/_tokenize';

const StyledSubHeader = styled.div`
  display: flex;
  margin: 30px auto;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  max-width: 600px;
  height: 125px;
`;

const StyledWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  text-align: center;
  height: 100%;
`;

const StyledTransactionList = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const StyledTransaction = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 60px auto;
  font-size: 28px;
  & p {
    width: 100%;
    text-align: center;
  }
`;

class TokenizeENS extends Component {
  render = () => {
    const { input, labelHash } = this.props;
    return (
      <BaseLayout>
        <StyledWrapper>
          <h3>{'Untokenize ENS Domain'}</h3>
          <StyledSubHeader>
            <h1>{input || labelHash}</h1>
            <Button onClick={this.props.untokenizeSubmitTransaction}>
              Untokenize
            </Button>
          </StyledSubHeader>
          <StyledTransactionList>
            <StyledTransaction>
              <TransactionStatus status={this.props.burnTokenStatus} />
              <p>Redeem domain ownership</p>
            </StyledTransaction>
          </StyledTransactionList>
        </StyledWrapper>
      </BaseLayout>
    );
  };
}

const reduxProps = ({ tokenize }) => ({
  labelHash: tokenize.labelHash,
  input: tokenize.input,
  burnTokenStatus: tokenize.burnTokenStatus
});

export default connect(
  reduxProps,
  { untokenizeSubmitTransaction }
)(TokenizeENS);
