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

import styles from './Divider.module.scss';

class Divider extends React.Component {
  static displayName = 'Card.Divider';

  static propTypes = {
    /**
     * Specify an optional className to be added to your Divider
     */
    className: PropTypes.string,
  };

  render() {
    const classes = classNames(styles.divider, this.props.className);

    return (
      <hr className={classes} />
    );
  }
}

export default Divider;
