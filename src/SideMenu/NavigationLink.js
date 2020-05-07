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

import { withTheme } from '../themes';
import styles from './NavigationLink.module.scss';

class NavigationLink extends React.Component {
  static displayName = 'SideMenu.NavigationLink';

  static propTypes = {
    /**
     * Specify how the button itself should be rendered.
     * Make sure to apply all props to the root node and render children appropriately
     */
    as: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.object,
      PropTypes.string,
    ]),
    /**
     * Specify children direction
     */
    direction: PropTypes.oneOf(['horizontal', 'vertical']),
    /**
     * Specify an optional className to be added to your NavigationLink
     */
    className: PropTypes.string,
    /**
     * Specify the icon of NavigationLink
     */
    icon: PropTypes.node,
    /**
     * Specify the content of your NavigationLink
     */
    children: PropTypes.node,
    /**
     * Click event handler
     */
    onClick: PropTypes.func,
    /**
     * Applies disabled styles
     */
    disabled: PropTypes.bool,
    /**
     * Sets button width to 100%
     */
    isActive: PropTypes.bool,
    /**
     * Displays an arrow on hover
     */
    withArrow: PropTypes.bool,
  };

  static defaultProps = {
    as: 'a',
    direction: 'horizontal',
    withArrow: false,
    disabled: false,
    dataHook: 'menu-navigation-link',
  };

  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  render() {
    const {
      as: Component,
      defaultTheme,
      withArrow,
      className,
      children,
      direction,
      icon,
      disabled,
      isActive,
      dataHook,
      ...props
    } = this.props;

    const classes = classNames(
      styles.link,
      {
        [styles.vertical]: direction === 'vertical',
        [styles.active]: isActive,
        [styles.disabled]: disabled,
      },
      className,
    );

    return (
      <Component
        {...props}
        className={classes}
        onClick={this.onClick}
        data-hook={dataHook}
      >
        {icon && <span className={styles.icon}>{icon}</span>}
        <span className={styles.children}>{children}</span>
      </Component>
    );
  }

  onClick(e) {
    if (this.props.disabled) {
      e.preventDefault();
      return;
    }

    this.props.onClick && this.props.onClick(e);
  }
}

export default withTheme(NavigationLink);
