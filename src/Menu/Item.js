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
import styles from './Item.module.scss';

class Item extends React.Component {
  static displayName = 'Menu.Item';

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
    tag: PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.string]),
  };

  static defaultProps = {
    dataHook: 'menu.item',
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      className,
      children,
      active,
      title,
      tag,
      dataHook,
      ...props
    } = this.props;

    const classes = classNames(
      styles.item,
      {
        [styles.active]: active,
      },
      className,
    );

    const Component = tag || 'a';

    return (
      <Component className={classes} data-hook={dataHook} {...props}>
        {children}
      </Component>
    );
  }
}

export default Item;
