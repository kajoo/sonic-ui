import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './Text.module.scss';

/*
 * Temporary fix: SIZES, SKINS, WEIGHTS constants are copied here from constants.js
 * in order to have AutoDocs able to parse them.
 * See this issue: https://github.com/wix/wix-ui/issues/784
 */
export const SIZES = {
  tiny: 'tiny',
  small: 'small',
  medium: 'medium',
};

export const SKINS = {
  standard: 'standard',
  error: 'error',
  success: 'success',
  premium: 'premium',
  disabled: 'disabled',
};

export const WEIGHTS = {
  thin: 'thin',
  normal: 'normal',
  bold: 'bold',
};

class Text extends React.Component {
  static displayName = 'Text';

  static propTypes = {
    dataHook: PropTypes.string,
    /** tag name that will be rendered */
    tagName: PropTypes.string,

    /** class to be applied to the root element */
    className: PropTypes.string,

    /** font size of the text */
    size: PropTypes.oneOf(Object.keys(SIZES)),

    /** any nodes to be rendered (usually text nodes) */
    children: PropTypes.any,

    /** is the text type is secondary. Affects the font color */
    secondary: PropTypes.bool,

    /** skin color of the text */
    skin: PropTypes.oneOf(Object.keys(SKINS)),

    /** make the text color lighter */
    light: PropTypes.bool,

    /** font weight of the text */
    weight: PropTypes.oneOf(Object.keys(WEIGHTS)),
  };

  static defaultProps = {
    size: SIZES.medium,
    secondary: false,
    skin: SKINS.standard,
    light: false,
    weight: WEIGHTS.thin,
    tagName: 'span',
  };

  render() {
    const {
      size,
      secondary,
      skin,
      light,
      weight,
      ellipsis,
      tagName,
      children,
      className,
      dataHook,
      ...props
    } = this.props;

    // const { dataHook, ...textProps } = props;

    return React.createElement(
      tagName,
      {
        ...props,
        // ...textProps,
        'data-hook': dataHook,
        className: classNames(
          styles.text,
          {
            [styles.secondary]: secondary,
            [styles.light]: light,
            [styles[`skin-${skin}`]]: true,
            [styles[`size-${size}`]]: true,
            [styles[`weight-${weight}`]]: true,
          },
          className,
        ),
        // ...style(
        //   'root',
        //   {
        //     size,
        //     secondary,
        //     skin,
        //     light,
        //     weight,
        //   },
        //   props,
        // ),
      },
      children,
    );
  }
}

export default Text;
