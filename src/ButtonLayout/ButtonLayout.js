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
    tag: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.object,
      PropTypes.string,
    ]),
    skin: PropTypes.oneOf(['standard', 'success', 'warning', 'danger', 'link']),
    action: PropTypes.oneOf(['primary', 'secondary']),
    /**
     * Size of button content
     */
    size: PropTypes.oneOf(['tiny', 'small', 'medium', 'large']),
    /** Element based icon (svg, image etc.) */
    prefixIcon: PropTypes.element,
    /** Element based icon (svg, image etc.) */
    suffixIcon: PropTypes.element,
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
    tag: 'button',
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
      tag: Component,
      skin,
      action,
      size,
      disabled,
      href,
      tabIndex,
      fullWidth,
      prefixIcon,
      suffixIcon,
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
        {this.renderAffix(prefixIcon, styles.prefix)}
        <span className={styles.content}>{children}</span>
        {this.renderAffix(suffixIcon, styles.suffix)}
      </Component>
    );
  }

  renderAffix(affix, className) {
    return affix && React.cloneElement(affix, {
      className: classNames(className, affix.props.className),
    });
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
