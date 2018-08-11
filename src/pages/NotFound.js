import React from 'react';
import { Link } from 'react-router-dom';
import Wrapper from '../components/Wrapper';
import Column from '../components/Column';

const NotFound = () => (
  <Wrapper>
    <Column>
      <Link to="/"><h1>404 Page Not Found</h1></Link>
    </Column>
  </Wrapper>
);
export default NotFound;
