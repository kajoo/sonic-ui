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

import styles from './index.module.scss';

class Row extends React.Component {
  static displayName = 'Row';

  static propTypes = {
    /** any node to be rendered inside */
    children: PropTypes.node,

    /** whether to remove it's margins */
    noGutters: PropTypes.bool,

    /** Custom class property */
    className: PropTypes.string,
    dataHook: PropTypes.string,
  };

  static defaultProps = {
    noGutters: false,
  };

  render() {
    const { children, noGutters, className, style, dataHook } = this.props;

    const classes = classNames(
      styles.row,
      { [styles['no-gutters']]: noGutters },
      className,
    );

    return (
      <div
        className={classes}
        style={style}
        data-hook={dataHook}
        children={children}
      />
    );
  }
}

export default Row;
