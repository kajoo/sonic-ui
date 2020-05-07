import React from 'react';
import PropTypes from 'prop-types';

import Heading from '../Heading';

export const Title = props => {
  const { dataHook } = props;

  return (
    <Heading appearance="H3" dataHook={dataHook}>
      {props.children}
    </Heading>
  );
};

Title.displayName = 'TableToolbar.Title';
Title.propTypes = {
  children: PropTypes.node,
  dataHook: PropTypes.string,
};
