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

import ButtonLayout from '../ButtonLayout';
import Loader from '../Loader';
import { withTheme } from '../themes';
import buttonStyle from './buttonStyle';
import styles from './Button.module.scss';

class Button extends React.PureComponent {
  static displayName = 'Button';

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
    theme: PropTypes.oneOf(['primary', 'warning', 'danger']),
    /**
     * Size of button content
     */
    size: PropTypes.oneOf(['tiny', 'small', 'medium', 'large']),
    /**
     * Specify the content of your Button
     */
    children: PropTypes.node,
    /**
     * Element based icon (svg, image etc.)
     */
    prefixIcon: PropTypes.element,
    /**
     * Element based icon (svg, image etc.)
     */
    suffixIcon: PropTypes.element,
    /**
     * Applies disabled styles
     */
    disabled: PropTypes.bool,
    /**
     * Sets button width to 100%
     */
    fullWidth: PropTypes.bool,
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
    isLoading: PropTypes.bool,
  };

  static defaultProps = {
    isLoading: false,
    // as: 'button',
    // action: 'primary',
    // size: 'medium',
  };

  constructor(props) {
    super(props);

    this.state = {
      hovered: false,
    };

    // this.addAffix = this.addAffix.bind(this);
    // this.onClick = this.onClick.bind(this);
    // this.onMouseEnter = this.onMouseEnter.bind(this);
    // this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  render() {
    const { isLoading, children, ...props } = this.props;
    const { size } = props;

    let style;
    switch (size) {
      case 'large': {
        style = { height: '2rem', width: '2rem' };
        break;
      }
      case 'tiny': {
        style = { height: '1rem', width: '1rem' };
        break;
      }
      default: {
        style = { height: '1.5rem', width: '1.5rem' };
        break;
      }
    }

    return (
      <ButtonLayout
        {...props}
      >
        {isLoading ? <Loader style={style} /> : children}
      </ButtonLayout>
    );
    /*
    const {
      defaultTheme,
      as: Component,
      size,
      className,
      children,
      prefixIcon,
      suffixIcon,
      disabled,
      fullWidth,
      ...props
    } = this.props;

    // const style = buttonStyle(defaultTheme, this.props, this.state);

    const classes = classNames(
      styles.button,
      {
        [styles[`${size}`]]: true,
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
        onClick={this.onClick}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        {this.addAffix(prefixIcon, styles.prefix)}
        <span className={styles.content}>{children}</span>
        {this.addAffix(suffixIcon, styles.suffix)}
      </Component>
    );
    */
  }
}

export default Button;