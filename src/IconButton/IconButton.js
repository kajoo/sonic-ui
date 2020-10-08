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

import ButtonLayout from '../ButtonLayout';
import styles from './IconButton.module.scss';

const SIZES = {
  tiny: 'tiny',
  small: 'small',
  medium: 'medium',
  large: 'large',
};
const iconChildSize = {
  [SIZES.tiny]: '18px',
  [SIZES.small]: '18px',
  [SIZES.medium]: '24px',
  [SIZES.large]: '24px',
};

class IconButton extends React.PureComponent {
  static displayName = 'IconButton';

  static propTypes = {
    ...ButtonLayout.propTypes,
  };

  static defaultProps = {
    ...ButtonLayout.defaultProps,
  };

  render() {
    const {
      // skin,
      // action,
      size,
      disabled,
      className,
      children,
      ...props
    } = this.props;

    const childSize = iconChildSize[size];

    const classes = classNames(
      styles.root,
      {
        // [styles[`skin-${skin}`]]: true,
        // [styles[`action-${action}`]]: true,
        [styles[`size-${size}`]]: true,
        [styles.disabled]: disabled,
      },
      className,
    );

    return (
      <ButtonLayout {...props} className={classes}>
        {children &&
          React.cloneElement(children, {
            size: childSize,
            width: childSize,
            height: childSize,
          })}
      </ButtonLayout>
    );
  }
}

export default IconButton;
