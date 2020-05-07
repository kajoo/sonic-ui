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
import styles from './NavigationCategory.module.scss';

class NavigationCategory extends React.Component {
  static displayName = 'SideMenu.NavigationCategory';

  static propTypes = {
    /**
     * Specify an optional className to be added to your NavigationCategory
     */
    className: PropTypes.string,
    /**
     * Specify the icon of NavigationCategory
     */
    icon: PropTypes.node,
    /**
     * Specify the content of your NavigationCategory
     */
    children: PropTypes.node,
    /**
     * Displays an arrow on hover
     */
    withArrow: PropTypes.bool,
  };

  static defaultProps = {
    withArrow: true,
    dataHook: 'menu-navigation-category',
  };

  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  render() {
    const {
      className,
      icon,
      title,
      children,
      dataHook,
      defaultTheme,
      withArrow,
      ...props
    } = this.props;

    const classes = classNames(styles.category, className);

    return (
      <div
        {...props}
        className={classes}
        onClick={this.onClick}
        data-hook={dataHook}
      >
        <div className={styles.content}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <span className={styles.title}>{title}</span>
        </div>

        {children}
      </div>
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

export default withTheme(NavigationCategory);
