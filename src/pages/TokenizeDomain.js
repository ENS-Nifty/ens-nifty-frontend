import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import BaseLayout from '../layouts/base';
import TransactionStatus from '../components/TransactionStatus';
import LineBreak from '../components/LineBreak';
import Form from '../components/Form';
import Button from '../components/Button';
import Input from '../components/Input';
import { isValidENSDomain } from '../helpers/validators';
import {
  tokenizeUpdateDomain,
  tokenizeSubmitTransaction
} from '../reducers/_tokenize';

const StyledWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  text-align: center;
  height: 100%;
`;

const StyledForm = styled(Form)`
  width: 100%;
  max-width: 600px;
  display: flex;
  margin: 30px auto;
`;

const StyledButton = styled(Button)`
  width: 100px;
  height: 44px;
  margin-top: 8px;
  margin-left: 8px;
`;

const StyledTransactionList = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  opacity: ${({ valid }) => (valid ? '1' : '0.5')};
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
    const validDomain = isValidENSDomain(this.props.domain);
    return (
      <BaseLayout>
        <StyledWrapper>
          <h3>{'Tokenize ENS Domain'}</h3>
          <StyledForm
            onSubmit={() =>
              this.props.tokenizeSubmitTransaction(this.props.domain)
            }
          >
            <Input
              label=""
              placeholder="ensdomain.eth"
              type="text"
              value={this.props.domain}
              onChange={({ target }) =>
                this.props.tokenizeUpdateDomain(target.value)
              }
            />
            <StyledButton type="submit">Submit</StyledButton>
          </StyledForm>
          <StyledTransactionList valid={validDomain}>
            <StyledTransaction>
              <TransactionStatus status={this.props.transferNameStatus} />
              <p>1. Transfer Domain Ownership</p>
            </StyledTransaction>
            <LineBreak />
            <StyledTransaction>
              <TransactionStatus status={this.props.mintTokenStatus} />
              <p>2. Mint ENS wrapper NFT token</p>
            </StyledTransaction>
          </StyledTransactionList>
        </StyledWrapper>
      </BaseLayout>
    );
  };
}

const reduxProps = ({ tokenize }) => ({
  domain: tokenize.domain,
  transferNameStatus: tokenize.transferNameStatus,
  mintTokenStatus: tokenize.mintTokenStatus
});

export default connect(
  reduxProps,
  { tokenizeUpdateDomain, tokenizeSubmitTransaction }
)(TokenizeENS);
