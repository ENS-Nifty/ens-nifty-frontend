import React, {Component} from 'react';
import styled from 'styled-components';
import BaseLayout from '../layouts/base';
import {beth, getTokensOwned} from '../helpers/eth';

import {connect} from 'react-redux';

const StyledWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px;
  text-align: center;
  height: 360px;
`;

class Domains extends Component {
  
  componentDidMount() {
    if (this.props.address) {
      getTokensOwned().then(console.log);
    }
  }

  render() {
    return (
      <BaseLayout>
        <StyledWrapper>
          <h3>{'Your Registered Domains'}</h3>
        </StyledWrapper>
      </BaseLayout>
    );
  }
}

const reduxProps = ({account}) => ({
  address: account.accountAddress,
});

export default connect(
  reduxProps,
  null,
)(Domains);
