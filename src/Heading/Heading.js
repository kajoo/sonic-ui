import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './Heading.module.scss';

export const APPEARANCES = {
  H1: 'H1',
  H2: 'H2',
  H3: 'H3',
  H4: 'H4',
  H5: 'H5',
  H6: 'H6',
};

class Heading extends React.Component {
  static displayName = 'Heading';

  static propTypes = {
    /** typography of the heading */
    appearance: PropTypes.oneOf(Object.keys(APPEARANCES)),

    /** is the text has dark or light skin */
    light: PropTypes.bool,

    /** any nodes to be rendered (usually text nodes) */
    children: PropTypes.any,
  };

  static defaultProps = {
    appearance: APPEARANCES.H1,
    light: false,
  };

  render() {
    const {
      appearance,
      light,
      ellipsis,
      children,
      className,
      dataHook,
      ...props
    } = this.props;

    const classes = classNames(
      styles.root,
      {
        [`${appearance}`]: true,
        [styles.ellipsis]: ellipsis,
        [styles.light]: light,
      },
      className,
    );

    return React.createElement(
      appearance.toLowerCase(),
      {
        ...props,
        className: classes,
        'data-hook': dataHook,
      },
      children,
    );
  }
}

export default Heading;
