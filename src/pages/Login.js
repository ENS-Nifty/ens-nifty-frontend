import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Link from '../components/Link';
import Input from '../components/Input';
import Button from '../components/Button';
import Wrapper from '../components/Wrapper';
import Form from '../components/Form';
import logo from '../assets/logo.svg';
import { authLogin, authUpdateEmail, authUpdatePassword } from '../reducers/_auth';

const StyledLogin = styled.div`width: 100%;`;

const StyledForm = styled(Form)`padding: 25px;`;

const StyledLogo = styled.img`width: 50%;`;

class Login extends Component {
  onSubmit = () => {
    this.props.authLogin(this.props.email, this.props.password);
  };
  render() {
    return (
      <StyledLogin>
        <Link to="/">
          <StyledLogo src={logo} alt="App Logo" />
        </Link>
        <Wrapper fetching={this.props.fetching}>
          <StyledForm onSubmit={this.onSubmit}>
            <Input label="Email" type="email" onValueChange={value => this.props.authUpdateEmail(value)} />
            <Input label="Password" type="password" onValueChange={value => this.props.authUpdatePassword(value)} />
            <Button type="submit" text="Login" round />
          </StyledForm>
        </Wrapper>
      </StyledLogin>
    );
  }
}

Login.propTypes = {
  authLogin: PropTypes.func.isRequired,
  authUpdateEmail: PropTypes.func.isRequired,
  authUpdatePassword: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
};

const reduxProps = ({ auth }) => ({
  fetching: auth.fetching,
  email: auth.email,
  password: auth.password
});

export default connect(reduxProps, {
  authLogin,
  authUpdateEmail,
  authUpdatePassword
})(Login);
