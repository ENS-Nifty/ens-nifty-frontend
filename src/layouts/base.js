import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Link from '../components/Link';
import Wrapper from '../components/Wrapper';
import Column from '../components/Column';
import Notification from '../components/Notification';
import Blockie from '../components/Blockie';
import Icon from '../components/Icon';
import Warning from '../components/Warning';
import { ellipseAddress } from '../helpers/utilities';
import branding from '../assets/ens-nifty-branding.png';
import github from '../assets/github.svg';
import twitter from '../assets/twitter.svg';
import ethereum from '../assets/ethereum.svg';
import { colors, fonts, transitions } from '../styles';

const StyledLayout = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  text-align: center;
`;

const StyledContent = styled(Wrapper)`
  width: 100%;
  height: 100%;
  padding: 0 16px;
`;

const StyledHeader = styled.div`
  margin-top: -1px;
  margin-bottom: 1px;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
`;

const StyledBrandingWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const StyledBranding = styled.div`
  width: 200px;
  height: 50px;
  background: url(${branding}) no-repeat;
  background-size: cover;
  background-position: center;
`;

const StyledActiveAccount = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  font-weight: 500;
`;


const StyledFooter = styled.footer `
  width: 100%;
  margin: 0 auto;
  height: 80px;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
`;

const StyledLink = styled.a `
  transition: ${transitions.short};
  width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  & p {
    display: flex;
    align-items: center;
    padding-left: 0.5em;
    font-size: ${fonts.size.h6};
    color: rgb(${colors.white});
    font-weight: ${({ activeLink }) => (activeLink ? `700` : `500`)};
  }
  &:hover {
    opacity: 0.7;
  }
`;

const BaseLayout = ({
  children,
  metamaskFetching,
  accountType,
  accountAddress,
  network,
  web3Available,
  online,
  modalOpen,
  ...props
}) => {
  return (
    <StyledLayout>
      <Column maxWidth={1000} spanHeight>
        <StyledHeader>
          <Link to="/">
            <StyledBrandingWrapper>
              <StyledBranding alt="ENS Nifty" />
            </StyledBrandingWrapper>
          </Link>
          {accountAddress && (
            <Link to="/domains">
              <StyledActiveAccount>
                <Blockie seed={accountAddress} />
                <p>{ellipseAddress(accountAddress)}</p>
              </StyledActiveAccount>
            </Link>
          )}
        </StyledHeader>
        <StyledContent>{children}</StyledContent>
        <StyledFooter {...props}>
          <StyledLink
            href="https://github.com/ens-nifty/"
            target="blank"
            rel="noreferrer noopener"
          >
            <Icon icon={github}/>
            <p>{`Github`}</p>
          </StyledLink>
          <StyledLink
            href="https://twitter.com/ensnifty/"
            target="blank"
            rel="noreferrer noopener"
          >
            <Icon icon={twitter}/>
            <p>{`Twitter`}</p>
          </StyledLink>
          <StyledLink
            href="https://etherscan.io/address/ensnifty.eth/#code"
            target="blank"
            rel="noreferrer noopener"
          >
            <Icon icon={ethereum}/>
            <p>{`Contract`}</p>
          </StyledLink>

        </StyledFooter>
      </Column>
      <Notification />
      <Warning />
    </StyledLayout>
  );
};

BaseLayout.propTypes = {
  children: PropTypes.node.isRequired,
  metamaskFetching: PropTypes.bool.isRequired,
  accountType: PropTypes.string.isRequired,
  accountAddress: PropTypes.string.isRequired,
  network: PropTypes.string.isRequired,
  web3Available: PropTypes.bool.isRequired,
  online: PropTypes.bool.isRequired
};

const reduxProps = ({ account, metamask, warning }) => ({
  accountType: account.type,
  accountAddress: account.address,
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
