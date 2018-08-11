import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Route, Switch, Redirect } from 'react-router-dom';
import Column from './components/Column';
import Login from './pages/Login';
import Logout from './pages/Logout';
import NotFound from './pages/NotFound';

const StyledWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  text-align: center;
`;

class Router extends Component {
  componentDidMount() {
    window.browserHistory = this.context.router.history;
  }
  render = () => (
    <StyledWrapper>
      <Column>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/login" />} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/logout" component={Logout} />
          <Route component={NotFound} />
        </Switch>
      </Column>
    </StyledWrapper>
  );
}

Router.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
};

export default Router;
