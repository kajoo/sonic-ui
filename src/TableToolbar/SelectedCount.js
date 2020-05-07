import React from 'react';
import PropTypes from 'prop-types';

import Text from '../Text';

export const SelectedCount = props => {
  const { dataHook } = props;

  return (
    <Text size="medium" weight="normal" dataHook={dataHook}>
      {props.children}
    </Text>
  );
};

SelectedCount.displayName = 'TableToolbar.SelectedCount';
SelectedCount.propTypes = {
  children: PropTypes.node,
  dataHook: PropTypes.string,
};
