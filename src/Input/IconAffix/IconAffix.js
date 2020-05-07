import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { InputContext } from '../InputContext';
import styles from './IconAffix.module.scss';

const IconAffix = ({ children, dataHook }) => (
  <InputContext.Consumer>
    {({ size, inSuffix, onInputClicked, disabled }) => {
      const className = classNames(styles.icon, {
        [styles.inSuffix]: inSuffix,
        [styles.disabled]: disabled,
      });
      return (
        <div
          onClick={!disabled ? onInputClicked : undefined}
          className={className}
          data-hook={dataHook}
        >
          {React.cloneElement(children, {
            size: size === 'small' ? '18px' : '24px',
          })}
        </div>
      );
    }}
  </InputContext.Consumer>
);

IconAffix.displayName = 'Input.IconAffix';
IconAffix.propTypes = {
  children: PropTypes.element.isRequired,
  dataHook: PropTypes.string,
};

export default IconAffix;
