import React, { Component } from 'react';
import styled from 'styled-components';
import BaseLayout from '../layouts/base';
import Loader from '../components/Loader';
import Link from '../components/Link';
import Button from '../components/Button';
import { accountGetTokenizedDomains } from '../reducers/_account';

import { connect } from 'react-redux';

const StyledWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  text-align: center;
  height: 360px;
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
          <h3>{'Registered Domains'}</h3>
          {!fetching ? (
            !!domains.length ? (
              <div>
                {domains.map(domain => (
                  <div>
                    <p>{domain}</p>
                    <Link to="/deregister-ens">
                      <Button>Deregister</Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <p>You haven't registered any domains as NFTs</p>
                <Link to="/register-ens">
                  <Button>Register Domain</Button>
                </Link>
              </div>
            )
          ) : (
            <Loader />
          )}
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
