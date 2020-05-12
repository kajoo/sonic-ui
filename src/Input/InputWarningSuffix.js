import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// import FormFieldErrorFilled from 'wix-ui-icons-common/system/FormFieldWarningFilled';

import Tooltip from '../Tooltip';
import styles from './Input.module.scss';

class InputWarningSuffix extends React.Component {
  static propTypes = {
    theme: PropTypes.oneOf(['normal', 'paneltitle', 'material', 'amaterial']),
    warningMessage: PropTypes.string.isRequired,
    focused: PropTypes.bool,
    narrow: PropTypes.bool,
    tooltipPlacement: PropTypes.string,
  };

  render() {
    const classes = classNames(styles.warningExclamation, {
      [styles.narrow]: this.props.narrow,
    });
    return (
      <Tooltip
        dataHook="input-tooltip"
        disabled={this.props.warningMessage.length === 0}
        placement={this.props.tooltipPlacement}
        alignment="center"
        textAlign="left"
        content={this.props.warningMessage}
        overlay=""
        theme="dark"
        maxWidth="230px"
        hideDelay={150}
        zIndex={10000}
      >
        <div className={classes}>
          {/*
          <FormFieldErrorFilled />
          */}
          <i className="ion ion-md-alert" />
        </div>
      </Tooltip>
    );
  }
}

export default InputWarningSuffix;
