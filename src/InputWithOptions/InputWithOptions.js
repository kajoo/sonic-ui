import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import omit from 'omit';

import Input from '../Input';
import DropdownLayout, {
  DIVIDER_OPTION_VALUE,
} from '../DropdownLayout/DropdownLayout';
import Highlighter from '../Highlighter/Highlighter';
import { chainEventHandlers } from '../utils/ChainEventHandlers';
import styles from './InputWithOptions.module.scss';
import nativeStyles from './InputWithOptions.module.scss';
import { placements } from '../Popover/constants';

import Popover from '../Popover';

export const DEFAULT_VALUE_PARSER = option => option.value;

const DEFAULT_POPOVER_PROPS = {
  appendTo: 'parent',
  flip: false,
  fixed: true,
  placement: 'bottom',
};

class InputWithOptions extends React.Component {
  static displayName = 'InputWithOptions';

  static propTypes = {
    ...Input.propTypes,
    ...DropdownLayout.propTypes,
    autocomplete: PropTypes.string,
    inputElement: PropTypes.element,
    closeOnSelect: PropTypes.bool,
    onManuallyInput: PropTypes.func,
    /** Function that receives an option, and should return the value to be displayed. By default returns `option.value`. */
    valueParser: PropTypes.func,
    dropdownWidth: PropTypes.string,
    dropdownOffsetLeft: PropTypes.string,
    /** Controls whether to show options if input is empty */
    showOptionsIfEmptyInput: PropTypes.bool,
    highlight: PropTypes.bool,
    /** Indicates whether to render using the native select element */
    native: PropTypes.bool,
    /** common popover props */
    popoverProps: PropTypes.shape({
      appendTo: PropTypes.oneOf([
        'window',
        'scrollParent',
        'parent',
        'viewport',
      ]),
      maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      minWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      flip: PropTypes.bool,
      fixed: PropTypes.bool,
      placement: PropTypes.oneOf(placements),
      dynamicWidth: PropTypes.bool,
    }),
  };

  static defaultProps = {
    ...Input.defaultProps,
    ...DropdownLayout.defaultProps,
    onSelect: () => {},
    options: [],
    closeOnSelect: true,
    inputElement: <Input />,
    valueParser: DEFAULT_VALUE_PARSER,
    dropdownWidth: null,
    popoverProps: DEFAULT_POPOVER_PROPS,
    dropdownOffsetLeft: '0',
    showOptionsIfEmptyInput: true,
    magnifyingGlass: false,
    autocomplete: 'off',
    native: false,
  };

  // Abstraction
  inputClasses() {}
  dropdownClasses() {}
  dropdownAdditionalProps() {}
  inputAdditionalProps() {}

  /**
   * An array of key codes that act as manual submit. Will be used within
   * onKeyDown(event).
   *
   * @returns {KeyboardEvent.key[]}
   */
  getManualSubmitKeys() {
    return ['Enter', 'Tab'];
  }

  constructor(props) {
    super(props);

    this.state = {
      inputValue: props.value || '',
      showOptions: false,
      lastOptionsShow: 0,
      isEditing: false,
    };

    this._onSelect = this._onSelect.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);
    this.select = this.select.bind(this);
    this.hideOptions = this.hideOptions.bind(this);
    this.showOptions = this.showOptions.bind(this);
    this._onManuallyInput = this._onManuallyInput.bind(this);
    this._renderDropdownLayout = this._renderDropdownLayout.bind(this);
    this._onInputClicked = this._onInputClicked.bind(this);
    this.closeOnSelect = this.closeOnSelect.bind(this);
    this.onCompositionChange = this.onCompositionChange.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !this.props.showOptionsIfEmptyInput &&
      ((!prevProps.value && this.props.value) ||
        (!prevState.inputValue && this.state.inputValue))
    ) {
      this.showOptions();
    }
  }

  onCompositionChange(isComposing) {
    this.setState({ isComposing });
  }

  onClickOutside = () => this.hideOptions();

  renderInput() {
    const inputAdditionalProps = this.inputAdditionalProps();
    const inputProps = Object.assign(
      omit(
        Object.keys(DropdownLayout.propTypes).concat([
          'onChange',
          'dataHook',
          'magnifyingGlass',
        ]),
        this.props,
      ),
      inputAdditionalProps,
    );

    const { inputElement } = inputProps;
    return React.cloneElement(inputElement, {
      menuArrow: !this.props.magnifyingGlass,
      ref: input => (this.input = input),
      ...inputProps,
      onKeyDown: chainEventHandlers(
        inputAdditionalProps && inputAdditionalProps.onKeyDown,
      ),
      theme: this.props.theme,
      onChange: this._onChange,
      onInputClicked: this._onInputClicked,
      onFocus: this._onFocus,
      onBlur: this._onBlur,
      onCompositionChange: this.onCompositionChange,
      width: inputElement.props.width,
      textOverflow: this.props.textOverflow || inputElement.props.textOverflow,
      tabIndex: this.props.native ? -1 : 0,
    });
  }

  _processOptions(options) {
    return !this.props.highlight
      ? options
      : options.map(option => {
          return {
            ...option,
            value:
              option.value === DIVIDER_OPTION_VALUE ? (
                option.value
              ) : (
                <Highlighter
                  match={this.state.inputValue}
                  dataHook={`highlighter-${option.id}`}
                >
                  {option.value}
                </Highlighter>
              ),
          };
        });
  }

  isDropdownLayoutVisible = () =>
    this.state.showOptions &&
    (this.props.showOptionsIfEmptyInput || this.state.inputValue.length > 0);

  _renderDropdownLayout() {
    const inputOnlyProps = omit(['tabIndex'], Input.propTypes);
    const dropdownProps = Object.assign(
      omit(Object.keys(inputOnlyProps).concat(['dataHook']), this.props),
      this.dropdownAdditionalProps(),
    );

    const customStyle = { marginLeft: this.props.dropdownOffsetLeft };

    return (
      <div
        className={this.dropdownClasses()}
        style={customStyle}
        data-hook="dropdown-layout-wrapper"
      >
        <DropdownLayout
          ref={dropdownLayout => (this.dropdownLayout = dropdownLayout)}
          {...dropdownProps}
          dataHook="inputwithoptions-dropdownlayout"
          options={this._processOptions(dropdownProps.options)}
          theme={this.props.theme}
          visible
          onClose={this.hideOptions}
          onSelect={this._onSelect}
          isComposing={this.state.isComposing}
          inContainer
          tabIndex={-1}
        />
      </div>
    );
  }

  _renderNativeSelect() {
    const { options, onSelect } = this.props;
    return (
      <div className={nativeStyles.nativeSelectWrapper}>
        {this.renderInput()}
        <select
          data-hook="native-select"
          className={nativeStyles.nativeSelect}
          onChange={event => {
            this._onChange(event);

            // In this case we don't use DropdownLayout so we need to invoke `onSelect` manually
            onSelect(options[event.target.selectedIndex]);
          }}
        >
          {options.map((option, index) => (
            <option
              data-hook={`native-option-${option.id}`}
              data-index={index}
              key={option.id}
              value={option.value}
              className={nativeStyles.nativeOption}
            >
              {option.value}
            </option>
          ))}
        </select>
      </div>
    );
  }

  render() {
    const {
      native,
      dataHook,
      popoverProps,
      dropDirectionUp,
      dropdownWidth,
      showArrow,
      className,
    } = this.props;
    const placement = dropDirectionUp ? 'top' : popoverProps.placement;
    const body = popoverProps.appendTo === 'window';

    const classes = classNames(
      styles.root,
      {
        [styles.popoverContent]: showArrow,
        [styles.withArrow]: showArrow,
      },
      className,
    );

    // {...styles('root', {}, this.props)}
    return !native ? (
      <Popover
        className={classes}
        {...DEFAULT_POPOVER_PROPS}
        dynamicWidth={body}
        {...popoverProps}
        width={dropdownWidth}
        placement={placement}
        dataHook={dataHook}
        onKeyDown={this._onKeyDown}
        onClickOutside={this.onClickOutside}
        shown={this.isDropdownLayoutVisible()}
      >
        <Popover.Element>
          <div data-input-parent className={this.inputClasses()}>
            {this.renderInput()}
          </div>
        </Popover.Element>
        <Popover.Content>{this._renderDropdownLayout()}</Popover.Content>
      </Popover>
    ) : (
      this._renderNativeSelect()
    );
  }

  showOptions() {
    this.setState({ showOptions: true, lastOptionsShow: Date.now() });
  }

  closeOnSelect() {
    return this.props.closeOnSelect;
  }

  get isReadOnly() {
    const { readOnly } = this.inputAdditionalProps() || {};
    return readOnly;
  }

  /**
   * Determine if the provided key should cause the dropdown to be opened.
   *
   * @param {KeyboardEvent.key}
   * @returns {boolean}
   */
  shouldOpenDropdown(key) {
    const openKeys = this.isReadOnly
      ? ['Enter', 'Spacebar', ' ', 'ArrowDown']
      : ['ArrowDown'];

    return openKeys.includes(key);
  }

  /**
   * Determine if the provided key should delegate the keydown event to the
   * DropdownLayout.
   *
   * @param {KeyboardEvent.key}
   * @returns {boolean}
   */
  shouldDelegateKeyDown(key) {
    return this.isReadOnly || !['Spacebar', ' '].includes(key);
  }

  /**
   * Determine if the provided key should cause manual submit.
   *
   * @param {KeyboardEvent.key}
   * @returns {boolean}
   */
  shouldPerformManualSubmit(key) {
    return this.getManualSubmitKeys().includes(key);
  }

  _onManuallyInput(inputValue = '') {
    if (this.state.isComposing) {
      return;
    }

    inputValue = inputValue.trim();

    const suggestedOption = this.props.options.find(
      element => element.value === inputValue,
    );

    if (this.props.onManuallyInput) {
      this.props.onManuallyInput(inputValue, suggestedOption);
    }
  }

  _onSelect(option, isSelectedOption) {
    this.showOptions();
    const { onSelect } = this.props;

    if (this.closeOnSelect()) {
      this.setState({ showOptions: false });
    }

    if (isSelectedOption) {
      this.setState({ showOptions: false });
    }

    if (onSelect) {
      onSelect(
        this.props.highlight
          ? this.props.options.find(opt => opt.id === option.id)
          : option,
      );
    }
  }

  hideOptions() {
    if (this.state.showOptions) {
      this.setState({ showOptions: false });
    }
  }

  _onChange(event) {
    this.setState({ inputValue: event.target.value });

    if (this.props.onChange) {
      this.props.onChange(event);
    }

    // If the input value is not empty, should show the options
    if (event.target.value.trim() && !this.props.native) {
      this.showOptions();
    }
  }

  _onInputClicked(event) {
    if (this.state.showOptions) {
      if (Date.now() - this.state.lastOptionsShow > 2000) {
        this.hideOptions();
      }
    } else {
      this.showOptions();
    }

    if (this.props.onInputClicked) {
      this.props.onInputClicked(event);
    }
  }

  _onFocus(e) {
    if (this.props.disabled) {
      return;
    }
    this._focused = true;
    this.setState({ isEditing: false });
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  }

  _onBlur(e) {
    this._focused = false;
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  }

  _onKeyDown(event) {
    if (this.props.disabled) {
      return;
    }

    const { key } = event;

    /* Enter - prevent a wrapping form from submitting when hitting Enter */
    /* ArrowUp - prevent input's native behaviour from moving the text cursor to the beginning */
    if (key === 'Enter' || key === 'ArrowUp') {
      event.preventDefault();
    }

    if (key !== 'ArrowDown' && key !== 'ArrowUp') {
      this.setState({ isEditing: true });
    }

    if (this.shouldOpenDropdown(key)) {
      this.showOptions();
      event.preventDefault();
    }

    if (this.shouldDelegateKeyDown(key)) {
      // Delegate event and get result

      if (this.dropdownLayout) {
        const eventWasHandled = this.dropdownLayout._onKeyDown(event);
        if (eventWasHandled || this.isReadOnly) {
          return;
        }
      }

      // For editing mode, we want to *submit* only for specific keys.
      if (this.shouldPerformManualSubmit(key)) {
        this._onManuallyInput(this.state.inputValue, event);
        const inputIsEmpty = !event.target.value;

        if (this.closeOnSelect() || (key === 'Tab' && inputIsEmpty)) {
          this.hideOptions();
        }
      }
    }
  }

  focus(options = {}) {
    this.input.focus(options);
  }

  blur() {
    this.input.blur();
  }

  select() {
    this.input.select();
  }
}

export default InputWithOptions;
