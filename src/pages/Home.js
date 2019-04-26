import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";
import BaseLayout from "../layouts/base";
import Button from "../components/Button";
import Column from "../components/Column";
import { metamaskConnectInit } from "../reducers/_metamask";
import { portisConnectInit } from "../reducers/_portis";
import { walletconnectConnectInit } from "../reducers/_walletconnect";
import { fonts } from "../styles";

const StyledLanding = styled.div`
  width: 100%;
  height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledButtonContainer = styled(Column)`
  width: 200px;
  margin: 50px 0;
`;

const StyledConnectButton = styled(Button)`
  border-radius: 8px;
  font-size: ${fonts.size.medium};
  height: 44px;
  width: 100%;
  margin: 12px 0;
`;

class Home extends Component {
  render = () => (
    <BaseLayout>
      <StyledLanding>
        <h1>
          Tokenize your ENS domain
          <br />
          and trade it as an NFT
        </h1>
        <StyledButtonContainer>
          <StyledConnectButton
            left
            color="orange"
            onClick={this.props.metamaskConnectInit}
          >
            {"Connect to Metamask"}
          </StyledConnectButton>
          <StyledConnectButton
            left
            color="portis"
            onClick={this.props.portisConnectInit}
          >
            {"Connect to Portis"}
          </StyledConnectButton>
          <StyledConnectButton
            left
            color="walletconnect"
            onClick={this.props.walletconnectConnectInit}
          >
            {"Connect to WalletConnect"}
          </StyledConnectButton>
        </StyledButtonContainer>
      </StyledLanding>
    </BaseLayout>
  );
}

Home.propTypes = {
  metamaskConnectInit: PropTypes.func.isRequired,
  portisConnectInit: PropTypes.func.isRequired,
  walletconnectConnectInit: PropTypes.func.isRequired
};

export default connect(
  null,
  {
    metamaskConnectInit,
    portisConnectInit,
    walletconnectConnectInit
  }
)(Home);
