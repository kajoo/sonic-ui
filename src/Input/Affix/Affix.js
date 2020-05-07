import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './Affix.module.scss';
import { InputContext } from '../InputContext';

const Affix = ({ children, value }) => (
  <InputContext.Consumer>
    {({ size, inSuffix, inPrefix, onInputClicked, disabled }) => {
      const className = classNames(styles.custom, {
        [styles.inSuffix]: inSuffix,
        [styles.inPrefix]: inPrefix,
        [styles.small]: size === 'small',
        [styles.disabled]: !!disabled,
      });
      return (
        <div
          onClick={onInputClicked}
          className={className}
          data-hook="custom-affix"
        >
          {value || children}
        </div>
      );
    }}
  </InputContext.Consumer>
);

Affix.displayName = 'Input.Affix';
Affix.propTypes = {
  children: PropTypes.node,
  value: PropTypes.string,
};

export default Affix;
