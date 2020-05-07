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

export const ThemeContext = React.createContext();

export class ThemeProvider extends React.Component {
  render() {
    const { children, theme } = this.props;

    return (
      <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    );
  }
}

// export default ThemeProvider;
