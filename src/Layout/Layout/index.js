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

import styles from './index.module.scss';

class Layout extends React.Component {
  static displayName = 'Layout';

  static propTypes = {
    /** one or more Cell components. Other nodes are accepted although not recommended */
    children: PropTypes.node,

    /** distance between cells both vertically and horizontally */
    gap: PropTypes.string,

    /** set custom amount of columns to be rendered. Default is 12 which means at `<Cell span={12}/>` occupies all columns, in other words, full width */
    cols: PropTypes.number,

    /** is used to justify the grid items along the row axis */
    justifyItems: PropTypes.string,

    /** is used to aligns the grid items along the column axis */
    alignItems: PropTypes.string,
  };

  static defaultProps = {
    gap: '30px',
  };

  render() {
    const { children, gap, cols, justifyItems, alignItems } = this.props;

    return (
      <div
        style={{
          gridGap: gap,
          justifyItems,
          alignItems,
          gridTemplateColumns: cols ? `repeat(${cols}, 1fr)` : undefined,
        }}
        className={styles.root}
      >
        {children}
      </div>
    );
  }
}

export default Layout;
