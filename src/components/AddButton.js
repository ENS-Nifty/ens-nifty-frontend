import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import plusIcon from '../assets/plus.svg';

const StyledAddButton = styled.div`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  background-image: url(${plusIcon});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const AddButton = ({ size, ...props }) => (
  <StyledAddButton size={size} {...props} />
);

AddButton.propTypes = {
  size: PropTypes.number
};

AddButton.defaultProps = {
  size: 40
};

export default AddButton;
