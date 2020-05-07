import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { ACTIVE_STEP, STEP_TYPES } from './Constants';
import styles from './Step.module.scss';

const KEY_CODES = { ENTER: 13, SPACE: 32 };

class Step extends React.PureComponent {
  static displayName = 'Stepper.Step';

  constructor(props) {
    super(props);

    this.state = {
      stepHover: false,
    };

    this._onMouseOver = this._onMouseOver.bind(this);
    this._onMouseOut = this._onMouseOut.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
  }

  render() {
    const {
      type,
      active,
      id,
      text,
      onFocus,
      focusableOnFocus,
      focusableOnBlur,
    } = this.props;
    const { stepHover } = this.state;

    const classes = classNames(styles.root, {
      [styles.disabled]: type === STEP_TYPES.DISABLED,
      [styles.selected]: active,
    });
    const stepClasses = classNames(styles.stepText, {
      [styles.disabled]: type === STEP_TYPES.DISABLED,
      [styles.selected]: active,
      [styles.stepHover]: stepHover,
      [styles.error]: type === STEP_TYPES.ERROR,
    });

    return (
      <div
        data-type="stepper-step"
        data-step-type={type ? type : STEP_TYPES.NORMAL}
        data-active={active ? ACTIVE_STEP : ''}
        key={`step${id}`}
        tabIndex={type === STEP_TYPES.DISABLED ? -1 : 0}
        onFocus={focusableOnFocus}
        onBlur={focusableOnBlur}
        onMouseOver={this._onMouseOver}
        onMouseOut={this._onMouseOut}
        onKeyDown={this._onKeyDown}
        onKeyUp={this._onKeyUp}
        className={classes}
        {...styles(
          'root',
          {
            disabled: type === STEP_TYPES.DISABLED,
            selected: active,
          },
          this.props,
        )}
        onClick={() =>
          this._onClick({
            id,
            type,
            active,
          })
        }
      >
        <div className={styles.stepTextWrapper}>
          <span
            className={stepClasses}
            {...styles(
              'stepText',
              {
                disabled: type === STEP_TYPES.DISABLED,
                selected: active,
                stepHover: stepHover,
                error: type === STEP_TYPES.ERROR,
              },
              this.props,
            )}
          >
            {text}
          </span>
        </div>
      </div>
    );
  }

  _onMouseOver() {
    this.setState({ stepHover: true });
  }

  _onMouseOut() {
    this.setState({ stepHover: false });
  }

  _onClick({ id, type, active }) {
    const { onClick } = this.props;
    type !== STEP_TYPES.DISABLED && !active && onClick && onClick(id);
  }

  _onKeyDown(event) {
    if (this._enterOrSpace(event.keyCode)) {
      event.preventDefault();
    }
  }

  _onKeyUp(event) {
    const { type, active, id } = this.props;
    if (this._enterOrSpace(event.keyCode)) {
      event.preventDefault();
      this._onClick({ id, type, active });
    }
  }

  _enterOrSpace(keyCode) {
    return keyCode === KEY_CODES.ENTER || keyCode === KEY_CODES.SPACE;
  }
}

export default Step;
