/**
 * Copyright (c) Kajoo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import React from 'react';

export const buildChildrenObject = (
  children: React.ReactNode,
  childrenObject,
) => {
  return React.Children.toArray(children).reduce((acc, child) => {
    if (!React.isValidElement(child)) {
      return acc;
    }

    if (!child.type || !(child.type).displayName) {
      return acc;
    }

    const name = child.type.displayName.split('.').pop();
    acc[name] = child;
    return acc;
  }, childrenObject || {});
};

// export interface ElementProps {
//   children: any;
// }
export const createComponentThatRendersItsChildren = (displayName: string) => {
  const Element = ({ children }) =>
    typeof children === 'string'
      ? React.createElement('div', {}, children)
      : children;

  Element.displayName = displayName;

  return Element;
};

export const noop = () => null;

export const isReactElement = (
  child: any,
  Element: React.ComponentType<T>,
) => {
  return child && child.type === Element;
};

export const isStatelessComponent = Component =>
  !(Component.prototype && Component.prototype.render);
