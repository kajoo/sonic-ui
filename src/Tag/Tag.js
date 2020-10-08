import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import noop from 'lodash/noop';

import Text from '../Text';
import CloseButton from '../CloseButton';
import styles from './Tag.module.scss';

const tagToTextSize = {
  tiny: 'tiny',
  small: 'small',
  medium: 'small',
  large: 'medium',
};

class Tag extends React.PureComponent {
  static displayName = 'Tag';

  static propTypes = {
    /** The id of the Tag  */
    id: PropTypes.string.isRequired,

    /** theme of the Tag */
    skin: PropTypes.oneOf([
      'standard',
      'error',
      'warning',
      'dark',
      'neutral',
      'light',
    ]),

    /** The height of the Tag */
    size: PropTypes.oneOf(['tiny', 'small', 'medium', 'large']),

    /** when set to true this component is disabled */
    disabled: PropTypes.bool,

    /** If the Tag is removable then it will contain a small clickable X */
    removable: PropTypes.bool,

    /** Callback function that pass `id` property as parameter when removing the Tag  */
    onRemove: PropTypes.func,

    /** Callback function that pass `id` property as first parameter
     * and mouse event as second parameter when clicking on Tag */
    onClick: PropTypes.func,

    /** The text of the tag */
    children: PropTypes.node.isRequired,

    /** Standard className which has preference over any other intrinsic classes  */
    className: PropTypes.string,

    /** Applied as data-hook HTML attribute that can be used in the tests */
    dataHook: PropTypes.string,
  };

  static defaultProps = {
    skin: 'standard',
    size: 'small',
    removable: true,
    onRemove: noop,
    onClick: noop,
  };

  constructor(props) {
    super(props);

    this.onRemove = this.onRemove.bind(this);
  }

  render() {
    const {
      id,
      skin,
      size,
      thumb,
      disabled,
      removable,
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
        [styles.withRemoveButton]: removable,
        [styles.withThumb]: thumb,
        [styles.disabled]: disabled,
        [styles.clickable]: onClick !== noop,
      },
      className,
    );

    return (
      <span
        id={id}
        data-hook={dataHook}
        className={classes}
      >
        {thumb ? (
          <span className={styles.thumb}>
            {thumb}
          </span>
        ) : null}
        <Text
          skin={disabled ? 'disabled' : 'standard'}
          size={tagToTextSize[size]}
          weight={size === 'tiny' ? 'thin' : 'normal'}
          ellipsis
        >
          {children}
        </Text>
        {removable && (
          <CloseButton
            size={size === 'large' ? 'medium' : 'small'}
            disabled={disabled}
            className={styles.removeButton}
            dataHook="tag-remove-button"
            onClick={this.onRemove}
          />
        )}
      </span>
    );
  }

  onRemove(event) {
    const { id, onRemove } = this.props;
    event.stopPropagation();
    onRemove(id);
  }
}

export default Tag;
