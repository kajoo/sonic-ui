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
import ReactCollapse from 'react-collapse';

class Collapse extends React.Component {
  static displayName = 'Collapse';

  static propTypes = {
    /** ID of element */
    open: PropTypes.string,

    /** Custom className for wrapper */
    className: PropTypes.string,

    /** Children */
    children: PropTypes.node,

    /** Is the Collapse disabled */
    dataHook: PropTypes.bool,
  };

  static defaultProps = {
    open: true,
  };

  render() {
    const { open, className, children, dataHook } = this.props;

    return (
      <ReactCollapse open={open} className={className} data-hook={dataHook}>
        {children}
      </ReactCollapse>
    );
  }
}

export default Collapse;
