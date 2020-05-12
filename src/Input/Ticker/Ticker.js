import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
// import FormFieldSpinnerUp from 'wix-ui-icons-common/system/FormFieldSpinnerUp';
// import FormFieldSpinnerDown from 'wix-ui-icons-common/system/FormFieldSpinnerDown';

import styles from './Ticker.module.scss';
import { InputContext } from '../InputContext';
// import InputConsumer from '../InputConsumer';

const Ticker = ({ onUp, onDown, upDisabled, downDisabled, dataHook }) => (
  <InputContext.Consumer>
    {({ disabled }) => (
      <div className={styles.root} data-hook={dataHook}>
        <div
          data-hook="ticker-up-button"
          data-disabled={upDisabled || disabled}
          className={classnames(styles.up, {
            [styles.disabled]: upDisabled || disabled,
          })}
          onClick={upDisabled || disabled ? null : onUp}
        >
          {/*
          <FormFieldSpinnerUp />
          */}
          <i className="ion ion-md-arrow-dropup" />
        </div>
        <div
          data-hook="ticker-down-button"
          data-disabled={downDisabled || disabled}
          className={classnames(styles.down, {
            [styles.disabled]: downDisabled || disabled,
          })}
          onClick={downDisabled || disabled ? null : onDown}
        >
          {/*
          <FormFieldSpinnerDown />
          */}
          <i className="ion ion-md-arrow-dropdown" />
        </div>
      </div>
    )}
  </InputContext.Consumer>
);

Ticker.displayName = 'Input.Ticker';

Ticker.propTypes = {
  onUp: PropTypes.func,
  onDown: PropTypes.func,
  upDisabled: PropTypes.bool,
  downDisabled: PropTypes.bool,
};

export default Ticker;
