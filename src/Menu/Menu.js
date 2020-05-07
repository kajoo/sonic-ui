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
import styles from './Menu.module.scss';

class Menu extends React.Component {
  static displayName = 'Menu';

  static propTypes = {
    /**
     * Specify an optional className to be added to your Menu
     */
    className: PropTypes.string,
    /**
     * Specify the content of your Menu
     */
    children: PropTypes.node,
    /**
     * Sets data-hook property
     */
    dataHook: PropTypes.string,
  };

  static defaultProps = {
    dataHook: 'menu',
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { className, children, dataHook } = this.props;

    const classes = classNames(styles.menu, className);

    return (
      <div className={classes} data-hook={dataHook}>
        {children}
      </div>
    );
  }
}

export default Menu;
