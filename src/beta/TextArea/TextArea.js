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
import debounce from 'lodash/debounce';
import isNaN from 'lodash/isNaN';

import styles from './TextArea.module.scss';

class TextArea extends React.PureComponent {
  static displayName = 'TextArea';

  // For autoGrow prop min rows is 2 so the textarea does not look like an input
  static MIN_ROWS = 2;

  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    tabIndex: PropTypes.number,

    /** Placeholder to display */
    placeholder: PropTypes.string,

    /** The theme of the input, can be one of `normal`, `paneltitle` */
    theme: PropTypes.oneOf(['normal', 'paneltitle', 'material', 'amaterial']),

    forceHover: PropTypes.bool,

    forceFocus: PropTypes.bool,

    /** i.e. '12px' */
    maxHeight: PropTypes.string,

    /** i.e. '12px' */
    minHeight: PropTypes.string,

    /** Define max length allowed in the inputArea */
    maxLength: PropTypes.number,

    /** Sets initial height according to the number of rows (chrome uses the rows for minHeight as well) */
    rows: PropTypes.number,

    /** Will cause the Input Area to grow and shrink according to user input */
    autoGrow: PropTypes.bool,

    /** Sets the minimum amount of rows the component can have when in autoGrow mode */
    minRowsAutoGrow: PropTypes.number,

    resizable: PropTypes.bool,

    /** Sets the input to readOnly */
    readOnly: PropTypes.bool,

    /** Standard React Input autoFocus (focus the element on mount) */
    autoFocus: PropTypes.bool,

    /** Standard React TextArea autoSelect (select the entire text of the element on focus) */
    autoSelect: PropTypes.bool,

    /** When true a letters counter will appear */
    hasCounter: PropTypes.bool,

    /** Inputs value */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /** Default value for those who wants to use this component un-controlled */
    defaultValue: PropTypes.string,

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
    onEnterPressed: PropTypes.func,
    onEscapePressed: PropTypes.func,

    /** Called when user presses -enter- */
    onEnterPressed: PropTypes.func,

    /** Called when user presses -escape- */
    onEscapePressed: PropTypes.func,

    /** A single CSS class name to be appended to ther TextArea's wrapper element. */
    className: PropTypes.string,

    /** Applied as data-hook HTML attribute that can be used in the tests */
    dataHook: PropTypes.string,
  };

  static defaultProps = {
    theme: 'material',
    minRowsAutoGrow: TextArea.MIN_ROWS,
  };

  constructor(props) {
    super(props);

    this.state = {
      focused: false,
      counter: (this.props.value || this.props.defaultValue || '').length,
      computedRows: this.props.minRowsAutoGrow,
    };

    this._calculateComputedRows = this._calculateComputedRows.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onInput = this._onInput.bind(this);
    this._onChange = this._onChange.bind(this);
    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);
    this.select = this.select.bind(this);
  }

  componentDidMount() {
    this.props.autoFocus && this._onFocus();
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
      theme,
      forceHover,
      forceFocus,
      disabled,
      rows,
      autoGrow,
      minHeight,
      maxHeight,
      resizable,
      maxLength,
      hasCounter,
      className,
      dataHook,
      minRowsAutoGrow,
      ...props
    } = this.props;

    const classes = classNames(styles.root, {
      [styles[`theme-${theme}`]]: true,
      [styles.hasHover]: forceHover,
      [styles.hasFocus]: forceFocus || this.state.focus,
      [styles.resizable]: resizable,
      [styles.nonResizable]: !resizable || disabled,
      [styles.disabled]: disabled,
    });

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

    return (
      <div className={classes}>
        <textarea
          {...props}
          ref={textArea => (this.textArea = textArea)}
          rows={rowsAttr}
          disabled={disabled}
          maxLength={maxLength}
          onFocus={this._onFocus}
          onBlur={this._onBlur}
          onKeyDown={this._onKeyDown}
          onInput={onInput}
          onChange={this._onChange}
          className={styles.textArea}
        />
        {theme === 'material' && <div className={styles.bar} />}
        {hasCounter && maxLength && (
          <div className={styles.counter} data-hook="counter">
            {this.state.counter}/{maxLength}
          </div>
        )}
      </div>
    );
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

  _getComputedStyle() {
    this._updateComputedStyle();
    return this._computedStyle;
  }

  _updateComputedStyle = debounce(
    () => {
      this._computedStyle = window.getComputedStyle(this.textArea);
    },
    500,
    { leading: true },
  );

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

  _onFocus(event) {
    this.setState({ focused: true });

    this.props.onFocus && this.props.onFocus(event);

    if (this.props.autoSelect) {
      // Set timeout is needed here since onFocus is called before react
      // gets the reference for the input (specifically when autoFocus
      // is on. So setTimeout ensures we have the ref.input needed in select)
      setTimeout(() => this.select(), 0);
    }
  }

  _onBlur(event) {
    this.setState({ focused: false });

    this.props.onBlur && this.props.onBlur(event);
  }

  _onKeyDown(event) {
    this.props.onKeyDown && this.props.onKeyDown(event);

    if (event.key === 'Enter') {
      this.props.onEnterPressed && this.props.onEnterPressed();
    } else if (event.key === 'Escape') {
      this.props.onEscapePressed && this.props.onEscapePressed();
    }
  }

  _onInput() {
    this._calculateComputedRows();
  }

  _onChange(event) {
    this.props.hasCounter && this.setState({ counter: event.target.value.length });

    this.props.onChange && this.props.onChange(event);
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
}

export default TextArea;
