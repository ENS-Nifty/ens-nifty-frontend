import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const SLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  margin: 0;
  padding: 0;
`;

const LinkWrapper = ({ children, ...otherProps }) => (
  <SLink {...otherProps}>
    {children}
  </SLink>
);

LinkWrapper.propTypes = {
  children: PropTypes.node.isRequired
};

export default LinkWrapper;
