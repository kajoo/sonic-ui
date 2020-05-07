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

import Heading from '../Heading';
import Text from '../Text';
import { withTheme } from '../themes';
import styles from './Header.module.scss';

const isString = a => typeof a === 'string';

class Header extends React.Component {
  static displayName = 'Card.Header';

  static propTypes = {
    /**
     * Specify an optional className to be added to your Header
     */
    className: PropTypes.string,
    /**
     * Required card title
     */
    title: PropTypes.node.isRequired,
    /**
     * Any string to be rendered below title
     */
    subtitle: PropTypes.node,
    /**
     * Sets button width to 100%
     */
    fullWidth: PropTypes.bool,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { className, title, subtitle, dataHook } = this.props;

    const classes = classNames(styles.header, className);

    return (
      <div className={classes} data-hook={dataHook}>
        <div className={styles.titleWrapper}>
          {isString(title) ? (
            <Heading dataHook="title" appearance="H3" children={title} />
          ) : (
            <span className={styles.title} data-hook="title">{title}</span>
          )}

          {subtitle && isString(subtitle) ? (
            <Text dataHook="subtitle" children={subtitle} secondary />
          ) : (
            <span data-hook="subtitle">{subtitle}</span>
          )}
        </div>
      </div>
    );
  }
}

export default withTheme(Header);
