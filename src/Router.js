import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Home from './pages/Home';
import Domains from './pages/Domains';
import TokenizeDomain from './pages/TokenizeDomain';
import UntokenizeDomain from './pages/UntokenizeDomain';
import TransferDomain from './pages/TransferDomain';
import NotFound from './pages/NotFound';
import { warningOnline, warningOffline } from './reducers/_warning';

class Router extends Component {
  componentDidMount() {
    window.browserHistory = this.context.router.history;
    window.onoffline = () => this.props.warningOffline();
    window.ononline = () => this.props.warningOnline();
  }

  render = () => {
    const address = this.props.address;
    return (
      <Switch>
        <Route
          exact
          path="/"
          render={routerProps => {
            if (!address) {
              return <Redirect to="/domains" />;
            }
            return <Home {...routerProps} />;
          }}
        />
        <Route
          exact
          path="/domains"
          render={routerProps => {
            if (!address) {
              return <Redirect to="/" />;
            }
            return <Domains {...routerProps} />;
          }}
        />
        <Route
          exact
          path="/tokenize-domain"
          render={routerProps => {
            if (!address) {
              return <Redirect to="/" />;
            }
            return <TokenizeDomain {...routerProps} />;
          }}
        />
        <Route
          exact
          path="/untokenize-domain"
          render={routerProps => {
            if (!address) {
              return <Redirect to="/" />;
            }
            return <UntokenizeDomain {...routerProps} />;
          }}
        />
        <Route
          exact
          path="/transfer-domain"
          render={routerProps => {
            if (!address) {
              return <Redirect to="/" />;
            }
            return <TransferDomain {...routerProps} />;
          }}
        />
        <Route component={NotFound} />
      </Switch>
    );
  };
}

Router.contextTypes = {
  router: PropTypes.object.isRequired
};

const reduxProps = ({ account }) => ({
  address: account.address
});

export default withRouter(
  connect(
    reduxProps,
    {
      warningOffline,
      warningOnline
    }
  )(Router)
);
