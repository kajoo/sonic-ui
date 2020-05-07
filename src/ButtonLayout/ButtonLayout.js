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

import styles from './ButtonLayout.module.scss';

class ButtonLayout extends React.PureComponent {
  static displayName = 'ButtonLayout';

  static propTypes = {
    /**
     * Specify how the button itself should be rendered.
     * Make sure to apply all props to the root node and render children appropriately
     */
    as: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.object,
      PropTypes.string,
    ]),
    skin: PropTypes.oneOf(['standard', 'warning', 'danger', 'link']),
    action: PropTypes.oneOf(['primary', 'secondary']),
    /**
     * Size of button content
     */
    size: PropTypes.oneOf(['tiny', 'small', 'medium', 'large']),
    /**
     * Specify the content of your Button
     */
    children: PropTypes.node,
    /**
     * Click event handler
     */
    onClick: PropTypes.func,
    /**
     * Specify an optional className to be added to your Button
     */
    className: PropTypes.string,
    /**
     * String based data hook
     */
    dataHook: PropTypes.string,
  };

  static defaultProps = {
    as: 'button',
    skin: 'standard',
    action: 'primary',
    size: 'medium',
  };

  constructor(props) {
    super(props);

    this.state = {
      hovered: false,
    };

    this._onClick = this._onClick.bind(this);
    this._onMouseEnter = this._onMouseEnter.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);
  }

  render() {
    const {
      as: Component,
      skin,
      action,
      size,
      disabled,
      href,
      tabIndex,
      fullWidth,
      children,
      className,
      dataHook,
      ...props
    } = this.props;

    const htmlTabIndex = disabled ? -1 : tabIndex || 0;
    const htmlHref = disabled ? undefined : href;

    const classes = classNames(
      styles.button,
      {
        [styles[`skin-${skin}`]]: true,
        [styles[`action-${action}`]]: true,
        [styles[`size-${size}`]]: true,
        [styles.disabled]: disabled,
        [styles.fullWidth]: fullWidth,
      },
      className,
    );

    return (
      <Component
        {...props}
        className={classes}
        disabled={disabled}
        aria-disabled={disabled}
        href={htmlHref}
        tabIndex={htmlTabIndex}
        onClick={this._onClick}
        onMouseEnter={this._onMouseEnter}
        onMouseLeave={this._onMouseLeave}
        data-hook={dataHook}
      >
        <span className={styles.content}>{children}</span>
      </Component>
    );
    // {this.addAffix(prefixIcon, styles.prefix)}
    // {this.addAffix(suffixIcon, styles.suffix)}
  }

  _onClick(e) {
    if (this.props.disabled) {
      e.preventDefault();
      return;
    }

    this.props.onClick && this.props.onClick(e);
  }

  _onMouseEnter(event) {
    this.setState({ hovered: true });

    this.props.onMouseEnter && this.props.onMouseEnter(event);
  }

  _onMouseLeave(event) {
    this.setState({ hovered: false });

    this.props.onMouseLeave && this.props.onMouseLeave(event);
  }
}

export default ButtonLayout;
