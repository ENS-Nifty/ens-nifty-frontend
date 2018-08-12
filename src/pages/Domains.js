import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import BaseLayout from '../layouts/base';
import Loader from '../components/Loader';
import Link from '../components/Link';
import Button from '../components/Button';
import AddButton from '../components/AddButton';
import {
  untokenizeUpdateDomain,
  transferUpdateDomain
} from '../reducers/_tokenize';
import { accountGetTokenizedDomains } from '../reducers/_account';
import tokenImg from '../assets/token.png';
import { mod } from '../helpers/bignumber.js';

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

const StyledToken = styled.div`
  width: 50px;
  height: 50px;
  margin-right: 12px;
  background: url(${tokenImg}) no-repeat;
  background-size: cover;
  background-position: center;
`;
const StyledCompomentToken = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 5px;
`;

const StyledTokenWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StyledActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

function hashToStyle(token) {
  const modulos = mod(token.labelHash, 360)
  return {filter: `hue-rotate(${modulos}DEG)`}

}
const StyledAddButtonWrapper = styled.div`
  margin: 20px auto;
  display: flex;
  align-items: center;
  justify-content: center
  width: 100%;
  max-width: 600px;
  height: 60px;
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
          <StyledTitle>{'Tokenized Domains'}</StyledTitle>
          <StyledDomains>
            {!fetching ? (
              !!domains.length ? (
                <StyledDomainsList>

                  {domains.map(token => (
                    <div key={token.labelHash}>
                      <StyledCompomentToken>
                        <StyledTokenWrapper>
                          <StyledToken style={hashToStyle(token)} />
                          <p>{token.domain || token.labelHash}</p>
                        </StyledTokenWrapper>
                        <StyledActionsWrapper>
                          <Button
                            onClick={() =>
                              this.props.transferUpdateDomain(
                                token.domain,
                                token.labelHash
                              )
                            }
                          >
                            Transfer
                          </Button>
                          <Button
                            color="red"
                            onClick={() =>
                              this.props.untokenizeUpdateDomain(
                                token.domain,
                                token.labelHash
                              )
                            }
                          >
                            Untokenize
                          </Button>
                        </StyledActionsWrapper>
                      </StyledCompomentToken>
                    </div>
                  ))}
                  <StyledAddButtonWrapper>
                    <Link to="/tokenize-domain">
                      <AddButton />
                    </Link>
                  </StyledAddButtonWrapper>
                </StyledDomainsList>
              ) : (
                <div>
                  <StyledNoDomainsMessage>
                    You haven't tokenized any domains
                  </StyledNoDomainsMessage>
                  <Link to="/tokenize-domain">
                    <Button color="green">Tokenize Domain</Button>
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
  { accountGetTokenizedDomains, untokenizeUpdateDomain, transferUpdateDomain }
)(Domains);
