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
import styles from './Header.module.scss';

class Header extends React.Component {
  static displayName = 'SideMenu.Header';

  static propTypes = {
    /**
     * onClick callback
     */
    onClick: PropTypes.func,
    /**
     * Specify an optional className to be added to your Header
     */
    className: PropTypes.string,
    /**
     * Specify the content of your Header
     */
    children: PropTypes.node,
    /**
     * Sets data-hook property
     */
    dataHook: PropTypes.string,
  };

  static defaultProps = {
    dataHook: 'menu-header',
  };

  render() {
    const { onClick, className, children, dataHook } = this.props;

    const classes = classNames(
      styles.header,
      { [styles.clickable]: !!onClick },
      className,
    );

    return (
      <div onClick={onClick} className={classes} data-hook={dataHook}>
        {children}
      </div>
    );
  }
}

export default withTheme(Header);
