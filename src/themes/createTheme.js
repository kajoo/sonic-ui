/**
 * Copyright (c) Kajoo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

'use strict';

import defaultValues from './defaultValues';

export default function createTheme(
  options: ?{
    colors?: Colors,
    overrides?: ThemeObj,
  },
) {
  return {
    ...defaultValues,
    ...options,
  };
}
