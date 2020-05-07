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

import Label from '../Label';
import styles from './FormField.module.scss';

const labelPlacements = {
  top: 'top',
  right: 'right',
  left: 'left',
};

class FormField extends React.Component {
  static displayName = 'FormField';

  static propTypes = {
    /**
     * any kids to render, should be some form of input. Input, InputArea & RichTextArea work well
     *
     * `children` can be React node or a function
     *
     * when function, it receives object with:
     * * `setCharactersLeft` - function accepts a number and will display it on top right of `FormField` component
     *
     */
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),

    /**
     * Specify an optional className to be added to your FormField
     */
    className: PropTypes.string,

    /** Defines if the content (children container) grows when there's space available (otherwise, it uses the needed space only) */
    stretchContent: PropTypes.bool,

    /** optional text labeling this form field */
    label: PropTypes.node,

    /** setting label size (small, medium) */
    labelSize: PropTypes.string,

    labelPlacement: PropTypes.oneOf([
      labelPlacements.top,
      labelPlacements.right,
      labelPlacements.left,
    ]),

    /** string used to match text label with FormField children. For example:
     *
     * ```js
     * <FormField id="myFormField" label="Hello">
     *   <Input id="myFormField"/>
     * </FormField>
     * ```
     */
    id: PropTypes.string,

    /** whether to display an asterisk (*) or not */
    required: PropTypes.bool,

    /** used for testing */
    dataHook: PropTypes.string,
  };

  static defaultProps = {
    required: false,
    stretchContent: true,
    labelPlacement: labelPlacements.top,
  };

  render() {
    const {
      className,
      label,
      labelSize,
      labelPlacement,
      stretchContent,
      id,
      required,
      dataHook,
      children,
    } = this.props;

    const classes = classNames(
      styles.root,
      {
        [styles.labelTop]: label && labelPlacement === labelPlacements.top,
        [styles.labelLeft]: label && labelPlacement === labelPlacements.left,
        [styles.labelRight]: label && labelPlacement === labelPlacements.right,
        [styles.stretchContent]: stretchContent,
      },
      className,
    );

    return (
      <div className={classes} data-hook={dataHook}>
        {label && labelPlacement && (
          <div
            className={classNames(styles.label, {
              [styles.minLabelHeight]: !children,
            })}
          >
            <Label for={id} size={labelSize}>
              {label}
            </Label>

            {required && (
              <div
                className={styles.required}
                data-hook="formfield-asterisk"
              >
                *
              </div>
            )}
          </div>
        )}

        {children && (
          <div
            data-hook="formfield-children"
            className={classNames(styles.children, {
              [styles.childrenWithInlineSuffixes]:
                !label || this.hasInlineLabel(label, labelPlacement),
            })}
          >
            {this.renderChildren()}
          </div>
        )}
      </div>
    );
  }

  renderChildren() {
    const { children } = this.props;
    if (typeof children === 'function') {
      return children();
    }

    return children;
  }

  hasInlineLabel(label, labelPlacement) {
    return (
      label &&
      (labelPlacement === labelPlacements.left ||
        labelPlacement === labelPlacements.right)
    );
  }
}

export default FormField;
