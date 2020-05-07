import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './RichTextToolbarButton.module.scss';
// import Tooltip from '../../Tooltip';

const RichTextToolbarButton = ({
  dataHook,
  onClick,
  tooltipText,
  isActive,
  isDisabled,
  children,
}) => (
  <button
    data-hook={dataHook}
    className={classNames(
      styles.button,
      isDisabled && styles.disabled,
      !isDisabled && isActive && styles.active,
    )}
    onClick={!isDisabled && onClick}
  >
    {children}
  </button>
);
// <Tooltip content={tooltipText} theme="dark">
// </Tooltip>

export default RichTextToolbarButton;
