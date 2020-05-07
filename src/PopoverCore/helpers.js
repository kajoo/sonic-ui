/**
 * Copyright (c) Kajoo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

/** specific functions and variables for test environment purposes */
export const popoverTestUtils = {
  createRange: () => {
    document.createRange = () =>
      ({
        setStart: () => null,
        setEnd: () => null,
        commonAncestorContainer: document.documentElement.querySelector('body'),
      });
  },
  generateId: () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1),
};
