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

class Container extends React.Component {
  static displayName = 'Container';

  static propTypes = {
    /** any node to be rendered inside */
    children: PropTypes.node,

    /** whether to have paddings or not */
    fluid: PropTypes.bool,

    /** Custom class property */
    className: PropTypes.string,
    dataHook: PropTypes.string,
  };

  static defaultProps = {
    fluid: false,
  };

  render() {
    // console.log(styles);
    const { children, fluid, className, style, dataHook } = this.props;

    const classes = classNames(
      {
        [styles.container]: !fluid,
        [styles['container-fluid']]: fluid,
      },
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

export default Container;
