import React from 'react';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';
import classNames from 'classnames';

import Text from '../Text';
import { withFocusable, focusableStates } from '../common/Focusable';
import styles from './RadioGroup.module.scss';

class RadioButton extends React.Component {
  static displayName = 'RadioGroup.Radio';

  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]),
    vAlign: PropTypes.oneOf(['center', 'top']),
    name: PropTypes.string,
    onChange: PropTypes.func,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    children: PropTypes.any,
    style: PropTypes.object,
    type: PropTypes.oneOf(['default', 'button']),
    lineHeight: PropTypes.string,

    /** optional node to be rendered under label. Clicking it will not trigger `onChange` */
    content: PropTypes.node,
  };

  static defaultProps = {
    vAlign: 'center',
    type: 'default',
    content: null,
  };

  constructor(props) {
    super(props);
    this.id = uniqueId();
  }

  render() {
    return this.props.type === 'button'
      ? this.renderButton()
      : this.renderRadio();
  }

  renderButton() {
    const { checked, disabled, onChange, value, icon, children } = this.props;

    return (
      <button
        type="button"
        className={classNames(styles.radioButton, {
          [styles.checked]: checked,
        })}
        checked={checked}
        disabled={disabled}
        id={this.id}
        onClick={() => (!checked && !disabled ? onChange(value) : null)}
      >
        {icon && <span>{icon}</span>}
        {children && <span>{children}</span>}
      </button>
    );
  }

  renderRadio() {
    const {
      checked,
      children,
      content,
      disabled,
      lineHeight,
      name,
      onChange,
      style,
      vAlign,
      value,
      className,
    } = this.props;

    return (
      <div
        className={classNames(
          styles.radioWrapper,
          {
            [styles.disabled]: disabled,
            [styles.checked]: checked,
          },
          className,
        )}
        style={style}
        tabIndex={disabled ? null : 0}
        onFocus={this.props.focusableOnFocus}
        onBlur={this.props.focusableOnBlur}
        {...focusableStates(this.props)}
      >
        <input
          type="radio"
          name={name}
          value={value}
          id={this.id}
          checked={checked}
          disabled={disabled}
          onChange={() => (!checked && !disabled ? onChange(value) : null)}
        />

        <label
          data-hook="radio-label"
          style={{ lineHeight }}
          htmlFor={this.id}
          className={classNames({
            [styles.vcenter]: vAlign === 'center',
            [styles.vtop]: vAlign === 'top',
          })}
        >
          <div
            style={{ height: lineHeight }}
            className={styles.radioButtonWrapper}
            data-hook="radiobutton-radio"
          >
            <div
              className={classNames(styles.radio, {
                [styles.radioButtonChecked]: checked,
              })}
            />
          </div>

          {children && (
            <Text
              className={styles.children}
              data-hook="radiobutton-children"
              tagName="div"
              size="medium"
              weight="thin"
              secondary
            >
              {children}
            </Text>
          )}
        </label>

        {content && <div data-hook="radio-button-content">{content}</div>}
      </div>
    );
  }
}

export default withFocusable(RadioButton);
