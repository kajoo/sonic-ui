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
import classname from 'classnames';

import styles from './index.module.scss';

class Cell extends React.Component {
  static displayName = 'Cell';

  static propTypes = {
    /** any node to be rendered inside */
    children: PropTypes.node,

    /** how many columns should this cell occupy. Can be any number from 1 to 12 inclusive */
    span: PropTypes.number,

    /** whether to align children vertically to the middle */
    vertical: PropTypes.bool,
  };

  static defaultProps = {
    span: 12,
  };

  render() {
    const { span, children, vertical } = this.props;

    return (
      <div
        style={{
          gridColumn: `span ${span}`,
        }}
        className={classname(styles.root, { [styles.vertical]: vertical })}
      >
        {children}
      </div>
    );
  }
}

export default Cell;
