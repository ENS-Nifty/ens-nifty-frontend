import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CloseButton from './CloseButton';
import { colors } from '../styles';

const StyledModal = styled.div`
  height: 100vh;
  width: 100vw;
  text-align: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  will-change: opacity;
  background-color: rgba(${colors.black}, 0.7);
  opacity: ${({ show }) => show ? 1 : 0};
  visibility: ${({ show }) => show ? 'visible' : 'hidden'};
  pointer-events: ${({ show }) => show ? 'auto' : 'none'};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledCard = styled.div`
  position:relative;
  width: 100%;
  max-width: 500px;
  padding: 15px;
  background-color: rgb(${colors.white});
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Modal = ({ show, toggleModal, ...otherProps }) => (
  <StyledModal show={show} {...otherProps}>
    <StyledCard>
      <CloseButton onClick={toggleModal} />
      <h1>This is a Modal</h1>
    </StyledCard>
  </StyledModal>
);

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired
};

export default Modal;
