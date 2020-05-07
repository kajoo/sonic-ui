import React from 'react';
import PropTypes from 'prop-types';

import styles from './Divider.module.scss';

export const Divider = props => {
  const { dataHook } = props;

  return <span className={styles.divider} data-hook={dataHook} />;
};

Divider.displayName = 'TableToolbar.Divider';
