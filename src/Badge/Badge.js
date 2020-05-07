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

import styles from './Badge.module.scss';

class Badge extends React.Component {
  static displayName = 'Badge';

  static propTypes = {
    /** color indication of the component */
    skin: PropTypes.oneOf([
      'general',
      'standard',
      'success',
      'warning',
      'danger',
      'premium',
    ]),
    /** component size */
    size: PropTypes.oneOf(['medium', 'small']),
    /** variation of the component structure */
    type: PropTypes.oneOf(['solid', 'outlined', 'transparent']),
    /** forces an uppercase letters */
    uppercase: PropTypes.bool,
    /** callback function called when badge is clicked */
    onClick: PropTypes.func,
    /** the text to display in the badge */
    children: PropTypes.any,
    /** Applied as data-hook HTML attribute that can be used to create driver in testing */
    dataHook: PropTypes.string,
  };

  static defaultProps = {
    skin: 'general',
    type: 'solid',
    size: 'medium',
    uppercase: true,
  };

  render() {
    const {
      skin,
      type,
      size,
      uppercase,
      onClick,
      children,
      className,
      dataHook,
      ...props
    } = this.props;

    const classes = classNames(styles.badge, {
      [styles[`skin-${skin}`]]: true,
      [styles[`type-${type}`]]: true,
      [styles[`size-${size}`]]: true,
      [styles.uppercase]: uppercase,
      [styles.clickable]: onClick,
    }, className);

    return (
      <div
        {...props}
        className={classes}
        onClick={onClick}
        data-hook={dataHook}
      >
        <span>
          {children}
        </span>
      </div>
    );
  }
}

export default Badge;
