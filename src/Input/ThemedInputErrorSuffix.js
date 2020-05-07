import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import InputErrorSuffix from './InputErrorSuffix';
import Tooltip from '../Tooltip';
// import FormFieldErrorFilled from '../new-icons/system/FormFieldErrorFilled';
import styles from './Input.module.scss';

const placementToMoveBy = {
  right: { x: 2, y: -10 },
  left: { x: -2, y: -10 },
  top: { x: 0, y: -10 },
  bottom: { x: 0, y: -8 },
};

const AmaterialErrorSuffix = ({
  focused,
  error,
  errorMessage,
  placement,
  onShow,
}) =>
  focused ? null : (
    <Tooltip
      dataHook="input-tooltip"
      disabled={!error && !errorMessage}
      placement={placement}
      maxWidth="230px"
      hideDelay={5}
      showDelay={5}
      active={focused}
      moveBy={placementToMoveBy[placement]}
      alignment="center"
      content={errorMessage}
      overlay=""
      textAlign="left"
      onShow={onShow}
    >
      <div className={classNames(styles.errorIcon, styles.suffix)}>
        {/*
        <FormFieldErrorFilled size="1.5em" />
        */}
        <i className="ion ion-md-information-circle-outline" />
      </div>
    </Tooltip>
  );

AmaterialErrorSuffix.propTypes = {
  errorMessage: PropTypes.node.isRequired,
  error: PropTypes.bool,
  focused: PropTypes.bool,
  placement: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
  onShow: PropTypes.func,
};

AmaterialErrorSuffix.defaultProps = {
  placement: 'right',
};

class ThemedInputErrorSuffix extends InputErrorSuffix {
  static propTypes = {
    tooltipPlacement: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
    onTooltipShow: PropTypes.func,
  };

  render() {
    const {
      theme,
      focused,
      error,
      errorMessage,
      tooltipPlacement,
      onTooltipShow,
    } = this.props;
    return theme === 'amaterial' ? (
      <AmaterialErrorSuffix
        focused={focused}
        error={error}
        errorMessage={errorMessage}
        placement={tooltipPlacement}
        onShow={onTooltipShow}
      />
    ) : (
      super.render()
    );
  }
}

export default ThemedInputErrorSuffix;
