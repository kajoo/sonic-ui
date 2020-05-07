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
import styles from './Card.module.scss';

class Card extends React.Component {
  static displayName = 'Card';

  static propTypes = {
    /**
     * Specify an optional className to be added to your Card
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

    // this.onClick = this.onClick.bind(this);
  }

  render() {
    const { defaultTheme, className, children, ...props } = this.props;

    const classes = classNames(styles.card, className);

    return React.createElement(
      'div',
      {
        ...props,
        className: classes,
      },
      children,
    );
  }
}

export default withTheme(Card);
