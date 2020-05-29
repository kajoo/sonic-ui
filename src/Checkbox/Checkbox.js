/**
 * Copyright (c) Kajoo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Label from '../Label';
import styles from './Checkbox.module.scss';
import { withFocusable, focusableStates } from '../common/Focusable';
import { generateID } from '../utils/generateId';

class Checkbox extends React.Component {
  static displayName = 'Checkbox';

  static propTypes = {
    id: PropTypes.string,
    /** used for automatic testing */
    checked: PropTypes.bool,
    /** Is checkbox disabled */
    disabled: PropTypes.bool,
    /** Does checkbox has an error */
    hasError: PropTypes.bool,
    /** Checkbox is in an indeterminate state */
    indeterminate: PropTypes.bool,
    /** The error message when there's an error */
    errorMessage: PropTypes.string,
    /** Selection area emphasises the clickable area, none means no emphasis, hover is when the mouse is on the component, and always will show constantly */
    selectionArea: PropTypes.oneOf(['none', 'hover', 'always']),
    /** Positioning of the checkbox compared to the label */
    vAlign: PropTypes.oneOf(['center', 'top']),

    /** used for automatic testing */
    hover: PropTypes.bool,
    size: PropTypes.oneOf(['medium']),
    onChange: PropTypes.func,
    children: PropTypes.node,
    className: PropTypes.string,
    dataHook: PropTypes.string,
  };

  static defaultProps = {
    checked: false,
    size: 'medium',
    selectionArea: 'none',
    vAlign: 'center',
    onChange: e => e.stopPropagation(),
  };

  constructor(props) {
    super(props);

    this.state = {
      isFocused: false,
    };
    this._id = `${Checkbox.displayName}-${generateID()}`;
  }

  render() {
    const {
      id = this._id,
      checked,
      indeterminate,
      hover,
      disabled,
      vAlign,
      size,
      onChange,
      children,
      className,
      dataHook,
    } = this.props;

    const classes = classNames(
      styles.root,
      indeterminate
        ? styles.indeterminate
        : checked
        ? styles.checked
        : styles.unchecked,
      {
        [styles.hover]: hover,
        [styles.disabled]: disabled,
      },
      className,
    );

    return (
      <div
        className={classes}
        tabIndex={disabled ? null : 0}
        data-hook={dataHook}
      >
        <input
          id={id}
          type="checkbox"
          disabled={disabled}
          onChange={disabled ? null : onChange}
          style={{ display: 'none' }}
          data-hook="checkbox-input"
        />

        <Label
          for={id}
          className={classNames({
            [styles.vtop]: vAlign === 'top',
          })}
          dataHook="checkbox-label"
        >
          <div className={styles.checkboxContainer}>
            <div className={classNames(styles.checkbox, styles[size])}>
              <div className={styles.inner} onClick={e => e.stopPropagation()}>
                {indeterminate ? (
                  <i className="ion ion-ios-remove" />
                ) : (
                  <i className="ion ion-ios-checkmark" />
                )}
              </div>
            </div>
          </div>
        </Label>

        {children && (
          <div className={styles.children} data-hook="checkbox-children">
            {children}
          </div>
        )}
      </div>
    );
  }
}

export default Checkbox;
