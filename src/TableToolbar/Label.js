import React from 'react';
import PropTypes from 'prop-types';

import OriginalLabel from '../Label';
import styles from './Item.module.scss';

export const Label = props => {
  return (
    <OriginalLabel {...props} className={styles.itemLabel}>
      {React.Children.toArray(props.children).map((c, index) => {
        return typeof c === 'string' ? <span key={index}>{c}</span> : c;
      })}
    </OriginalLabel>
  );
};

Label.displayName = 'TableToolbar.Label';
Label.propTypes = {
  children: PropTypes.any,
  dataHook: PropTypes.string,
};
