import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';

import BaseLayout from '../layouts/base';
import Button from '../components/Button';
import { metamaskConnectInit } from '../reducers/_metamask';
import { fonts } from '../styles';

const ConnectButton = styled(Button)`
  border-radius: 8px;
  font-size: ${fonts.size.medium};
  height: 44px;
  padding: 0 15px 2px 15px;
  position: absolute;
  right: 29px;
  top: 29px;
`;

const MetamaskButton = ConnectButton.extend`
  &:hover {
    background: #ff932e;
  }
  &:active {
    background: #f07f16;
  }
`;

class Home extends Component {
  render = () => (
    <BaseLayout>
      <MetamaskButton
        left
        color="orange"
        onClick={this.props.metamaskConnectInit}
      >
        {'Connect to Metamask'}
      </MetamaskButton>
    </BaseLayout>
  );
}

Home.propTypes = {
  modalOpen: PropTypes.func.isRequired,
  metamaskConnectInit: PropTypes.func.isRequired
};

export default connect(
  null,
  {
    metamaskConnectInit
  }
)(Home);
