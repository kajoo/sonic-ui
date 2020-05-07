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

import styles from './Label.module.scss';

class Label extends React.Component {
  static displayName = 'Label';

  static propTypes = {
    /** ID of element */
    id: PropTypes.string,

    /** For property */
    for: PropTypes.string,

    /** Custom className for wrapper */
    className: PropTypes.string,

    /** Children */
    children: PropTypes.node,

    /** should the text be ellipsed or not */
    ellipsis: PropTypes.bool,

    /** Is the Label disabled */
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    ellipsis: false,
  };

  render() {
    const { id, size, ellipsis, disabled, children, className } = this.props;

    const classes = classNames(
      styles.root,
      {
        [styles[`${size}`]]: true,
        [styles.ellipsis]: ellipsis,
        [styles.disabled]: disabled,
      },
      className,
    );

    return (
      <label id={id} htmlFor={this.props.for} className={classes}>
        {children}
      </label>
    );
  }
}

export default Label;
