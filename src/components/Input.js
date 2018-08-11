import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { colors, transitions, fonts } from '../styles';

const StyledContainer = styled.div`
  border-bottom: 1px solid rgb(${colors.blue});
  position: relative;
  margin-bottom: 25px;
  transition: ${transitions.base};

  &::after {
    content: '';
    display: block;
    height: 2px;
    transition: ${transitions.base};
    left: ${({ focus }) => focus ? '0%' : '50%'};
    width: ${({ focus }) => focus ? '100%' : 0};
    position: absolute;
    background-color: rgb(${colors.blue});
    bottom: -1;
    will-change: width, left;
  }
`;

const StyledInputContainer = styled.div`
  width: 100%;

  & input {
    background: transparent;
    border-radius: 0;
    border: none;
    transition: ${transitions.base};
    opacity: ${({ focus, content }) => (focus || content) ? 1 : 0};
    width: 100%;

    &:focus {
      transition-delay: 0.1s;
      border-radius: 0;
      box-shadow: none;
      outline: none;
    }
  }
`;

const StyledLabel = styled.label`
  position: absolute;
  z-index: 1;
  pointer-events: none;
  top: 0;
  left: 0;
  color: rgb(${({ focus }) => focus ? colors.blue : colors.lightBlue});
  transition: ${transitions.base};
  transform-origin: left;
  transform: ${({ focus, content }) => (focus || content) ? 'translateY(-8px) scale(0.7)' : 'translateY(8px) scale(1)'};
  will-change: transform;
  font-weight: 400;
  font-size: ${fonts.medium};
`;

const StyledInput = styled.input`
  border: none;
  border-style: none;
  box-sizing: border-box;
  border-radius: 2px;
  margin: 6px 0;
  width: 100%;
  color: rgb(${colors.lightBlue});
  font-weight: 400;
  font-size: ${fonts.medium};
  &::placeholder {
    color: rgb(${colors.lightBlue});
  }
`;

class FloatInput extends Component {
  state = {
    value: '',
    focus: false,
    content: false
  }

  _onChange = ({ target }) => {
    this.setState({ value: target.value });
    this.props.onValueChange(target.value);
  };

  _onFocus = () => this.setState({ focus: true });

  _onBlur = () => {
    if (!this.state.value) {
      this.setState({ focus: false, content: false });
    } else this.setState({ focus: false, content: true });
  }

  render() {
    const { label, ...props } = this.props;
    return (
      <StyledContainer focus={this.state.focus} {...props}>
        <StyledLabel content={this.state.content} focus={this.state.focus}>
          {label}
        </StyledLabel>
        <StyledInputContainer content={this.state.content} focus={this.state.focus}>
          <StyledInput
            placholder={label}
            onChange={this._onChange}
            onFocus={this._onFocus}
            onBlur={this._onBlur}
            {...props}
          />
        </StyledInputContainer>
      </StyledContainer>
    );
  }
}

FloatInput.propTypes = {
  label: PropTypes.string.isRequired,
  onValueChange: PropTypes.func
};

FloatInput.defaultProps = {
  onValueChange: () => {}
};

export default FloatInput;
