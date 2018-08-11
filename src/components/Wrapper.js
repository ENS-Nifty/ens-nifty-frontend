import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Loader from './Loader';

const StyledWrapper = styled.div`
  width: 100%;
  min-height: 210px;
  display: flex;
  align-items: center;
`;

const Wrapper = ({ children, fetching }) => <StyledWrapper>{fetching ? <Loader /> : children} </StyledWrapper>;

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
  fetching: PropTypes.bool
};

Wrapper.defaultProps = {
  fetching: false
};

export default Wrapper;
