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

class Column extends React.Component {
  static displayName = 'Column';

  static propTypes = {
    /** any node to be rendered inside */
    children: PropTypes.node,

    /** whether to align children vertically to the middle */
    span: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    xs: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    sm: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    md: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    lg: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    xl: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /** Custom class property */
    className: PropTypes.string,
    dataHook: PropTypes.string,
  };

  static defaultProps = {
    span: 12,
  };

  render() {
    const {
      children,
      span,
      xs,
      sm,
      md,
      lg,
      xl,
      className,
      style,
      dataHook,
    } = this.props;

    const classes = classNames(
      styles.col,
      {
        // [styles[`colXs${span}`]]: this.isLegalCol(span),
        // [styles[`colXs${xs}`]]: this.isLegalCol(xs),
        [styles[`col-sm-${span}`]]: this.isLegalCol(span),
        [styles[`col-sm-${sm}`]]: this.isLegalCol(sm),
        [styles[`col-md-${md}`]]: this.isLegalCol(md),
        [styles[`col-lg-${lg}`]]: this.isLegalCol(lg),
        [styles[`col-xl-${xl}`]]: this.isLegalCol(xl),
        // [styles[`${xs}Xs`]]: this.isVisibleHidden(xs),
        [styles['d-sm-none']]: this.isHidden(sm),
        [styles['d-md-none']]: this.isHidden(md),
        [styles['d-lg-none']]: this.isHidden(lg),
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

  isHidden(str) {
    // return str === 'hidden' || str === 'visible';
    return str === 'hidden';
  }

  isLegalCol(numStr) {
    // if (numStr && !this.isVisibleHidden(numStr)) {
    if (numStr && !this.isHidden(numStr)) {
      const num = Number(numStr);
      return Number.isInteger(num) && num > 0 && num <= 12;
    }

    return false;
  }
}

export default Column;
