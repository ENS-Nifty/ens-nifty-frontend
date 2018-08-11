import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import BaseLayout from '../layouts/base';
import Form from '../components/Form';
import Button from '../components/Button';
import Input from '../components/Input';
import {
  registerUpdateInput,
  registerSubmitTransactions
} from '../reducers/_register';

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
`;

const StyledTransaction = styled.div`
  width: 100%;
  margin: 60px auto;
  font-size: 28px;
`;

class RegisterENS extends Component {
  render = () => {
    return (
      <BaseLayout>
        <StyledWrapper>
          <h3>{'Register ENS Domain'}</h3>
          <StyledForm onSubmit={this.props.registerSubmitTransactions}>
            <Input
              label=""
              placeholder="ensdomain.eth"
              type="text"
              value={this.props.input}
              onChange={({ target }) =>
                this.props.registerUpdateInput(target.value)
              }
            />
            <StyledButton type="submit">Submit</StyledButton>
          </StyledForm>
          <StyledTransactionList>
            <StyledTransaction>1. Transfer Domain Ownership</StyledTransaction>
            <StyledTransaction>2. Mint ENS wrapper NFT token</StyledTransaction>
          </StyledTransactionList>
        </StyledWrapper>
      </BaseLayout>
    );
  };
}

const reduxProps = ({ register }) => ({
  input: register.input
});

export default connect(
  reduxProps,
  { registerUpdateInput, registerSubmitTransactions }
)(RegisterENS);
