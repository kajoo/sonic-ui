import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ErrorIndicator from '../ErrorIndicator';
import styles from './InputErrorSuffix.module.scss';

class InputErrorSuffix extends React.Component {
  static propTypes = {
    theme: PropTypes.oneOf(['normal', 'paneltitle', 'material', 'amaterial']),
    errorMessage: PropTypes.string.isRequired,
    focused: PropTypes.bool,
    narrow: PropTypes.bool,
    tooltipPlacement: PropTypes.string,
  };

  render() {
    const { tooltipPlacement, errorMessage, narrow } = this.props;

    const classes = classNames(styles.root, {
      [styles.narrow]: narrow,
    });

    return (
      <ErrorIndicator
        className={classes}
        dataHook="input-tooltip"
        disabled={errorMessage.length === 0}
        placement={tooltipPlacement}
        errorMessage={errorMessage}
      />
    );
  }
}

export default InputErrorSuffix;
