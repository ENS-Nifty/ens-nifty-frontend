import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { authLogout } from '../reducers/_auth';
import { deleteSession } from '../helpers/utilities';

class Logout extends Component {
  componentWillMount() {
    this.props.authLogout();
    deleteSession();
  }
  render = () => null;
}

Logout.propTypes = {
  authLogout: PropTypes.func.isRequired
};

export default connect(null, { authLogout })(Logout);
