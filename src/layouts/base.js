import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Link from '../components/Link';
import Wrapper from '../components/Wrapper';
import Column from '../components/Column';
import Notification from '../components/Notification';
import Warning from '../components/Warning';
import logo from '../assets/logo.png';
import { responsive } from '../styles';

const StyledLayout = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  text-align: center;
`;

const StyledContent = styled(Wrapper)`
  width: 100%;
  padding: 0 16px;
`;

const StyledHeader = styled.div`
  margin-top: -1px;
  margin-bottom: 1px;
  width: 100%;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
`;

const StyledBranding = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const StyledLogo = styled.div`
  width: 198px;
  height: 23px;
  background: url(${logo}) no-repeat;
  @media screen and (${responsive.sm.max}) {
  }
`;

const BaseLayout = ({
  children,
  metamaskFetching,
  ledgerFetching,
  trezorFetching,
  accountType,
  accountAddress,
  ledgerAccounts,
  ledgerUpdateNetwork,
  trezorAccounts,
  trezorUpdateNetwork,
  accountChangeNativeCurrency,
  accountUpdateAccountAddress,
  nativeCurrency,
  network,
  web3Available,
  online,
  modalOpen,
  ...props
}) => {
  return (
    <StyledLayout>
      <Column maxWidth={1000}>
        <StyledHeader>
          <Link to="/">
            <StyledBranding>
              <StyledLogo alt="Balance" />
            </StyledBranding>
          </Link>
        </StyledHeader>
        <StyledContent>{children}</StyledContent>
      </Column>
      <Notification />
      <Warning />
    </StyledLayout>
  );
};

BaseLayout.propTypes = {
  children: PropTypes.node.isRequired,
  metamaskFetching: PropTypes.bool.isRequired,
  ledgerFetching: PropTypes.bool.isRequired,
  ledgerUpdateNetwork: PropTypes.func.isRequired,
  trezorFetching: PropTypes.bool.isRequired,
  trezorUpdateNetwork: PropTypes.func.isRequired,
  accountChangeNativeCurrency: PropTypes.func.isRequired,
  accountUpdateAccountAddress: PropTypes.func.isRequired,
  accountType: PropTypes.string.isRequired,
  accountAddress: PropTypes.string.isRequired,
  nativeCurrency: PropTypes.string.isRequired,
  network: PropTypes.string.isRequired,
  web3Available: PropTypes.bool.isRequired,
  online: PropTypes.bool.isRequired,
  modalOpen: PropTypes.func.isRequired
};

const reduxProps = ({ account, ledger, trezor, metamask, warning }) => ({
  accountType: account.accountType,
  accountAddress: account.accountAddress,
  nativeCurrency: account.nativeCurrency,
  metamaskFetching: metamask.fetching,
  network: account.network,
  web3Available: metamask.web3Available,
  online: warning.online
});

export default connect(
  reduxProps,
  null
)(BaseLayout);
