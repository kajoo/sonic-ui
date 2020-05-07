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

import { ThemeContext } from './ThemeProvider';

export default function withTheme(Component) {
  return function ThemeComponent(props) {
    return (
      <ThemeContext.Consumer>
        {contexts => <Component {...props} defaultTheme={contexts} />}
      </ThemeContext.Consumer>
    );
  };
}
