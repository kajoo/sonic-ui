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
    ...ButtonLayout.propTypes,
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
     * Showing a loading indicator
     */
    isLoading: PropTypes.bool,
  };

  static defaultProps = {
    isLoading: false,
  };

  render() {
    const { isLoading, children, ...props } = this.props;
    const { size } = props;

    let loaderStyle;
    switch (size) {
      case 'large': {
        loaderStyle = { height: '2rem', width: '2rem' };
        break;
      }
      case 'tiny': {
        loaderStyle = { height: '1rem', width: '1rem' };
        break;
      }
      default: {
        loaderStyle = { height: '1.5rem', width: '1.5rem' };
        break;
      }
    }

    return (
      <ButtonLayout
        {...props}
      >
        {isLoading ? <Loader style={loaderStyle} /> : children}
      </ButtonLayout>
    );
  }
}

export default Button;
