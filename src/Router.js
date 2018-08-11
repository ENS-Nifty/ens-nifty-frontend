import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Home from './pages/Home';
import Domains from './pages/Domains';
import RegisterENS from './pages/RegisterENS';
import DeregisterENS from './pages/DeregisterENS';
import NotFound from './pages/NotFound';
import { warningOnline, warningOffline } from './reducers/_warning';

class Router extends Component {
  componentDidMount() {
    window.browserHistory = this.context.router.history;
    window.onoffline = () => this.props.warningOffline();
    window.ononline = () => this.props.warningOnline();
  }
  render = () => (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/domains" component={Domains} />
      <Route path="/register-ens" component={RegisterENS} />
      <Route path="/deregister-ens" component={DeregisterENS} />
      <Route component={NotFound} />
    </Switch>
  );
}

Router.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  email: PropTypes.string,
  signup: PropTypes.any
};

export default withRouter(
  connect(
    null,
    {
      warningOffline,
      warningOnline
    }
  )(Router)
);
