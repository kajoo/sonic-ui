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
import styles from './Body.module.scss';

class Body extends React.Component {
  static displayName = 'Card.Body';

  static propTypes = {
    /**
     * Specify an optional className to be added to your Body
     */
    className: PropTypes.string,
    /**
     * Specify the content of your Button
     */
    children: PropTypes.node,
    /**
     * Sets button width to 100%
     */
    fullWidth: PropTypes.bool,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { className, children, ...props } = this.props;

    const classes = classNames(styles.body, className);

    return <div className={classes}>{children}</div>;
  }
}

export default withTheme(Body);
