import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './Item.module.scss';

export const Item = props => {
  const { dataHook } = props;

  const classes = classNames(styles.item, {
    [styles.layoutButton]: props.layout === 'button',
  });

  return (
    <span className={classes} data-hook={dataHook}>
      {props.children}
    </span>
  );
};

Item.displayName = 'TableToolbar.Item';
Item.propTypes = {
  children: PropTypes.any,
  layout: PropTypes.oneOf(['button']),
  dataHook: PropTypes.string,
};
