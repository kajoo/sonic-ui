import React from 'react';

export const createComponentThatRendersItsChildren = (displayName: string) => {
  const Element = ({ children }) =>
    typeof children === 'string'
      ? React.createElement('div', {}, children)
      : children;

  Element.displayName = displayName;

  return Element;
};

export const buildChildrenObject = (children, childrenObject) => {
  return React.Children.toArray(children).reduce((acc, child) => {
    if (!React.isValidElement(child)) {
      return acc;
    }

    if (!child.type || !child.type.displayName) {
      return acc;
    }

    const name = child.type.displayName.split('.').pop();
    acc[name] = child;
    return acc;
  }, childrenObject || {});
};
