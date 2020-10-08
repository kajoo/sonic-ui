import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { X } from 'react-feather';

import ButtonLayout from '../ButtonLayout';
import styles from './CloseButton.module.scss';

const mapToSize = {
  small: 10,
  medium: 12,
  large: 14,
}

class CloseButton extends React.PureComponent {
  static displayName = 'CloseButton';

  static propTypes = {
    /** skin of the CloseButton */
    skin: PropTypes.oneOf([
      'standard',
      'standardFilled',
      'light',
      'lightFilled',
      'dark',
      'transparent',
    ]),

    /** size of closebutton */
    size: PropTypes.oneOf(['small', 'medium', 'large']),

    /** when set to true this component is disabled */
    disabled: PropTypes.bool,

    /** Callback function that pass `id` property as first parameter
     * and mouse event as second parameter when clicking on CloseButton */
    onClick: PropTypes.func,

    /** The text of the tag */
    children: PropTypes.node,

    /** Standard className which has preference over any other intrinsic classes  */
    className: PropTypes.string,

    /** Applied as data-hook HTML attribute that can be used in the tests */
    dataHook: PropTypes.string,
  };

  static defaultProps = {
    skin: 'standard',
    size: 'small',
    disabled: false,
  };

  render() {
    const {
      skin,
      size,
      disabled,
      onClick,
      children,
      className,
      dataHook,
    } = this.props;

    const classes = classNames(
      styles.root,
      styles[`skin-${skin}`],
      styles[`size-${size}`],
      {
        [styles.disabled]: disabled,
      },
      className,
    );

    return (
      <ButtonLayout
        onClick={onClick}
        className={classes}
      >
        <X
          size={mapToSize[size]}
        />
      </ButtonLayout>
    );
  }
}

export default CloseButton;
