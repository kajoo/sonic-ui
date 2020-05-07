import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './Item.module.scss';

export const ItemGroup = props => {
  const { dataHook } = props;

  const classes = classNames(styles.itemGroup, {
    [styles.positionStart]: props.position === 'start',
    [styles.positionEnd]: props.position === 'end',
  });

  return (
    <div className={classes} data-hook={dataHook}>
      {props.children}
    </div>
  );
};

ItemGroup.displayName = 'TableToolbar.ItemGroup';
ItemGroup.propTypes = {
  children: PropTypes.any,
  position: PropTypes.oneOf(['start', 'end']),
  dataHook: PropTypes.string,
};
ItemGroup.defaultProps = {
  position: 'start',
};
