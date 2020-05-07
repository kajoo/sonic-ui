/**
 * Copyright (c) Kajoo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './TextArea.module.scss';

class TextArea extends React.Component {
  static displayName = 'TextArea';

  // For autoGrow prop min rows is 2 so the textarea does not look like an input
  static MIN_ROWS = 2;

  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,

    /** Inputs value */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /** Default value for those who wants to use this component un-controlled */
    defaultValue: PropTypes.string,

    /** Placeholder to display */
    placeholder: PropTypes.string,

    /** i.e. '12px' */
    maxHeight: PropTypes.string,

    /** i.e. '12px' */
    minHeight: PropTypes.string,

    /** Define max length allowed in the inputArea */
    maxLength: PropTypes.number,
    menuArrow: PropTypes.bool,

    /** Will cause the Input Area to grow and shrink according to user input */
    autoGrow: PropTypes.bool,

    /** Sets the minimum amount of rows the component can have when in autoGrow mode */
    minRowsAutoGrow: PropTypes.number,

    /** Sets the input to readOnly */
    readOnly: PropTypes.bool,
    resizable: PropTypes.bool,

    /** When true a letters counter will appear */
    hasCounter: PropTypes.bool,

    /** Sets UI to erroneous */
    error: PropTypes.bool,

    /** The error message to display when hovering the error icon, if not given or empty there will be no tooltip */
    errorMessage: PropTypes.string,

    /** Standard React Input autoFocus (focus the element on mount) */
    autoFocus: PropTypes.bool,

    /** Standard React TextArea autoSelect (select the entire text of the element on focus) */
    autoSelect: PropTypes.bool,

    /** Standard input onFocus callback */
    onFocus: PropTypes.func,

    /** Standard input onBlur callback */
    onBlur: PropTypes.func,

    /** Standard input onChange callback */
    onChange: PropTypes.func,

    /** called when user pastes text from clipboard (using mouse or keyboard shortcut) */
    onPaste: PropTypes.func,

    /** Standard input onKeyDown callback */
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,

    /** Called when user presses -enter- */
    onEnterPressed: PropTypes.func,

    /** Called when user presses -escape- */
    onEscapePressed: PropTypes.func,

    /** A single CSS class name to be appended to ther TextArea's wrapper element. */
    className: PropTypes.string,
    dataHook: PropTypes.string,
  };

  static defaultProps = {
    minRowsAutoGrow: TextArea.MIN_ROWS,
  };

  constructor(props) {
    super(props);

    this.state = {
      focus: false,
      counter: (this.props.value || this.props.defaultValue || '').length,
      computedRows: this.props.minRowsAutoGrow,
    };

    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);
    this.select = this.select.bind(this);

    this._onInput = this._onInput.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);

    this._getComputedStyle = this._getComputedStyle.bind(this);
    this._calculateComputedRows = this._calculateComputedRows.bind(this);
    this._getRowsCount = this._getRowsCount.bind(this);
    this._getDefaultLineHeight = this._getDefaultLineHeight.bind(this);
    // this.onCompositionChange = this.onCompositionChange.bind(this);
    // this.onKeyDown = this.onKeyDown.bind(this);
    // this.onKeyPress = this.onKeyPress.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.autoGrow &&
      prevProps.minRowsAutoGrow !== this.props.minRowsAutoGrow
    ) {
      this._calculateComputedRows();
    }
  }

  render() {
    const {
      value,
      disabled,
      minHeight,
      maxHeight,
      autoGrow,
      error,
      rows,
      resizable,
      className,
      ...props
    } = this.props;

    /* eslint-disable no-unused-vars */
    const rowsAttr = rows
      ? rows
      : autoGrow
      ? this.state.computedRows
      : undefined;
    const onInput = !rows && autoGrow ? this._onInput : undefined;

    const inlineStyle = {};
    if (minHeight) {
      inlineStyle.minHeight = minHeight;
    }
    if (maxHeight) {
      inlineStyle.maxHeight = maxHeight;
    }

    const classes = classNames(
      styles.root,
      {
        [styles.hasError]: !!error,
        // [styles.hasFocus]: this.state.focus,
        [styles.resizable]: !!resizable,
        [styles.nonResizable]: !resizable || !!disabled,
        [styles.disabled]: !!disabled,
      },
      className,
    );

    return (
      <div className={styles.wrapper}>
        <div className={classes}>
          <textarea
            {...props}
            ref={textArea => (this.textArea = textArea)}
            value={value}
            disabled={disabled}
            rows={rowsAttr}
            style={inlineStyle}
            onInput={onInput}
            onFocus={this._onFocus}
            onBlur={this._onBlur}
            onChange={this._onChange}
            onKeyDown={this._onKeyDown}
            className={styles.textArea}
          />
        </div>

        <div className={styles.error}>{error && !disabled && <div />}</div>
      </div>
    );
  }

  focus() {
    this.onFocus();

    this.textArea && this.textArea.focus();
  }

  blur() {
    this.textArea && this.textArea.blur();
  }

  select() {
    this.textArea && this.textArea.select();
  }

  _onInput() {
    this._calculateComputedRows();
  }

  _onFocus(e) {
    this.setState({ focus: true });

    this.props.onFocus && this.props.onFocus(e);

    if (this.props.autoSelect) {
      // Set timeout is needed here since onFocus is called before react
      // gets the reference for the input (specifically when autoFocus
      // is on. So setTimeout ensures we have the ref.input needed in select)
      setTimeout(() => this.select(), 0);
    }
  }

  _onBlur(e) {
    this.setState({ focus: false });

    this.props.onBlur && this.props.onBlur(e);
  }

  _onChange(e) {
    this.props.hasCounter && this.setState({ counter: e.target.value.length });

    this.props.onChange && this.props.onChange(e);
  }

  _onKeyDown(e) {
    this.props.onKeyDown && this.props.onKeyDown(e);

    if (e.key === 'Enter') {
      this.props.onEnterPressed && this.props.onEnterPressed();
    } else if (e.key === 'Escape') {
      this.props.onEscapePressed && this.props.onEscapePressed();
    }
  }

  _getComputedStyle() {
    this._updateComputedStyle();
    return this._computedStyle;
  }

  _calculateComputedRows() {
    this.setState({ computedRows: 1 }, () => {
      const rowsCount = this._getRowsCount();
      const computedRows = Math.max(this.props.minRowsAutoGrow, rowsCount);
      this.setState({
        computedRows,
      });
    });
  }

  _getRowsCount() {
    const computedStyle = this._getComputedStyle();
    const fontSize = parseInt(computedStyle.getPropertyValue('font-size'), 10);
    const lineHeight = parseInt(
      computedStyle.getPropertyValue('line-height'),
      10,
    );
    const lineHeightValue = isNaN(lineHeight)
      ? this._getDefaultLineHeight() * fontSize
      : lineHeight;
    return Math.floor(this.textArea.scrollHeight / lineHeightValue);
  }

  _getDefaultLineHeight() {
    if (!this._defaultLineHeight) {
      const { parentNode } = this.textArea;
      const computedStyles = this._getComputedStyle();
      const fontFamily = computedStyles.getPropertyValue('font-family');
      const fontSize = computedStyles.getPropertyValue('font-size');
      const tempElement = document.createElement('span');
      const defaultStyles =
        'position:absolute;display:inline;border:0;margin:0;padding:0;line-height:normal;';
      tempElement.setAttribute(
        'style',
        `${defaultStyles}font-family:${fontFamily};font-size:${fontSize};`,
      );
      tempElement.innerText = 'M';
      parentNode.appendChild(tempElement);
      this._defaultLineHeight =
        parseInt(tempElement.clientHeight, 10) / parseInt(fontSize, 10);
      tempElement.parentNode.removeChild(tempElement);
    }

    return this._defaultLineHeight;
  }
}

export default TextArea;
