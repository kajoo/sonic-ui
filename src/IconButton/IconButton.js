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
    /** render as some other component or DOM tag */
    as: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.object,
      PropTypes.string,
    ]),
    /** Used for passing any icon. For external icon make sure to follow ux sizing guidelines */
    children: PropTypes.node,
    /** Button skins */
    skin: PropTypes.oneOf([
      'standard',
      'inverted',
      'light',
      'transparent',
      'premium',
    ]),
    /** Button priority */
    action: PropTypes.oneOf(['primary', 'secondary']),
    /** Button size */
    size: PropTypes.oneOf(['tiny', 'small', 'medium', 'large']),
    /** Click event handler  */
    onClick: PropTypes.func,
    /** Applies disabled styles */
    disabled: PropTypes.bool,

    /** A single CSS class name to be appended to ther RichTextArea's wrapper element. */
    className: PropTypes.string,
    /** Applied as data-hook HTML attribute that can be used in the tests */
    dataHook: PropTypes.string,
  };

  static defaultProps = {
    skin: 'standard',
    action: 'primary',
    size: 'small',
    disabled: false,
  };

  render() {
    const {
      // skin,
      // action,
      size,
      disabled,
      className,
      children,
      dataHook,
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
      <ButtonLayout {...props} className={classes} dataHook={dataHook}>
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
