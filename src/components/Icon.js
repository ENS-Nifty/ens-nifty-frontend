import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors, transitions } from "../styles";

const StyledIcon = styled.div`
  transition: ${transitions.base};
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  mask: ${({ icon }) => `url(${icon}) center no-repeat`};
  mask-size: 90%;
  background-color: ${({ color }) => `rgb(${colors[color]})`};
  background-size: contain;
  background-repeat: no-repeat;
  &:hover {
    opacity: 0.5;
  }
`;

const Icon = ({ icon, color, size, ...props }) => (
  <StyledIcon icon={icon} color={color} size={size} {...props} />
);

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  color: PropTypes.string,
  size: PropTypes.number
};

Icon.defaultProps = {
  color: "white",
  size: 20
};

export default Icon;
