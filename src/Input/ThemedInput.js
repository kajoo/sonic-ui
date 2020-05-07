import React from 'react';
import classNames from 'classnames';

import Input from './Input';
import DATA_ATTR from './DataAttr';
import styles from './Input.module.scss';

class ThemedInput extends Input {
  static propTypes = {
    ...Input.propTypes,
  };

  getDataAttr = ({ dataHook, size }) => {
    return {
      'data-hook': dataHook,
      [DATA_ATTR.DATA_SIZE]: size,
    };
  };

  render() {
    const {
      id,
      size,
      dataHook,
      title,
      theme,
      rtl,
      disabled,
      error,
      status,
      forceHover,
      forceFocus,
      roundInput,
      className,
      noLeftBorderRadius,
      noRightBorderRadius,
      value,
      readOnly,
      withSelection,
    } = this.props;

    let hasError = status === Input.StatusError;
    const hasWarning = status === Input.StatusWarning;

    // Check for deprecated fields and use them if provided
    if (error) {
      hasError = true;
    }

    const classes = {
      [styles.rtl]: !!rtl,
      [styles.disabled]: disabled,
      [styles.hasError]: hasError,
      [styles.hasWarning]: hasWarning,
      [styles.hasHover]: forceHover,
      [styles.hasFocus]: forceFocus || this.state.focus,
      [styles.roundInput]: roundInput,
      [styles.hasValue]:
        (value && value.length) || (this.input && !!this.input.value),
      [styles.noRightBorderRadius]: noRightBorderRadius === true, // assert boolean type
      [styles.noLeftBorderRadius]: noLeftBorderRadius === true, // assert boolean type
      /* Adding [noRightBorderRadius] and [noLeftBorderRadius] as a string className, is a hack for backward compatibility with
       * a bug that existed in WSR version <= 4.1.0. This should be removed in version 5.x.x.
       */
      [noRightBorderRadius]: typeof noRightBorderRadius === 'string',
      [noLeftBorderRadius]: typeof noLeftBorderRadius === 'string',
    };

    const placeholder = this.props.placeholder;
    return (
      <div
        className={classNames(
          classes,
          styles.root,
          styles[`theme-${theme}`],
          styles[`size-${size}${withSelection ? '-with-selection' : ''}`],
          className,
          { [styles.readOnly]: readOnly },
        )}
        {...this.getDataAttr({ dataHook, size })}
      >
        {theme === 'amaterial' && (
          <label className={styles.materialTitle} htmlFor={id}>
            {title}
          </label>
        )}
        {super.render({ placeholder })}
        {theme === 'material' && (
          <div className={`${styles.bar} ${styles.barBlack}`} />
        )}
        {theme === 'amaterial' && (
          <div className={`${styles.bar} ${styles.barBlue}`} />
        )}
      </div>
    );
  }
}

export default ThemedInput;
