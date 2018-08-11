import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import BaseLayout from '../layouts/base';
import Loader from '../components/Loader';
import Link from '../components/Link';
import Button from '../components/Button';
import { accountGetTokenizedDomains } from '../reducers/_account';

const StyledTitle = styled.h3`
  margin-bottom: 50px;
`;

const StyledWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  text-align: center;
  height: 100%;
`;

const StyledDomains = styled.div`
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledDomainsList = styled.div`
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledNoDomainsMessage = styled.p`
  margin: 20px auto;
  font-size: 28px;
  opacity: 0.7;
`;

class Domains extends Component {
  componentDidMount() {
    this.props.accountGetTokenizedDomains();
  }

  render() {
    const { fetching, domains } = this.props;
    return (
      <BaseLayout>
        <StyledWrapper>
          <StyledTitle>{'Registered Domains'}</StyledTitle>
          <StyledDomains>
            {!fetching ? (
              !!domains.length ? (
                <StyledDomainsList>
                  {domains.map(domain => (
                    <div>
                      <p>{domain}</p>
                      <Link to="/deregister-ens">
                        <Button>Deregister</Button>
                      </Link>
                    </div>
                  ))}
                </StyledDomainsList>
              ) : (
                <div>
                  <StyledNoDomainsMessage>
                    You haven't registered any domains as NFTs
                  </StyledNoDomainsMessage>
                  <Link to="/register-ens">
                    <Button>Register Domain</Button>
                  </Link>
                </div>
              )
            ) : (
              <Loader />
            )}
          </StyledDomains>
        </StyledWrapper>
      </BaseLayout>
    );
  }
}

const reduxProps = ({ account }) => ({
  fetching: account.fetching,
  domains: account.domains,
  address: account.address
});

export default connect(
  reduxProps,
  { accountGetTokenizedDomains }
)(Domains);
