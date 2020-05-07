import React from 'react';
import PropTypes from 'prop-types';

import Input from '../Input';
import DropdownLayout, {
  DIVIDER_OPTION_VALUE,
} from '../DropdownLayout/DropdownLayout';
import styles from './Select.module.scss';

export const DEFAULT_VALUE_PARSER = option => option.value;

class Select extends React.Component {
  static displayName = 'Select';

  static propTypes = {
    ...Input.propTypes,
    ...DropdownLayout.propTypes,
    inputElement: PropTypes.element,
    options: PropTypes.array,
    /** Function that receives an option, and should return the value to be displayed. By default returns `option.value`. */
    valueParser: PropTypes.func,
    closeOnSelect: PropTypes.bool,
    /** Indicates whether to render using the native select element */
    native: PropTypes.bool,
  };

  static defaultProps = {
    ...Input.defaultProps,
    ...DropdownLayout.defaultProps,
    autocomplete: 'off',
    inputElement: <Input />,
    options: [],
    valueParser: DEFAULT_VALUE_PARSER,
    closeOnSelect: true,
    onSelect: () => {},
    native: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      inputValue: props.value || '',
      showOptions: false,
      lastOptionsShow: 0,
    };

    this.renderNative = this.renderNative.bind(this);
    this.renderDropdownLayout = this.renderDropdownLayout.bind(this);
    this.renderInput = this.renderInput.bind(this);
    this.showOptions = this.showOptions.bind(this);
    this.hideOptions = this.hideOptions.bind(this);
    this.select = this.select.bind(this);
    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);

    this._isDropdownLayoutVisible = this._isDropdownLayoutVisible.bind(this);
    this._onSelect = this._onSelect.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this._onClick = this._onClick.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    // super.componentDidUpdate(prevProps);
  }

  render() {
    const { native, dropDirectionUp } = this.props;

    return native ? (
      this.renderNative()
    ) : (
      <div>
        {dropDirectionUp ? this.renderDropdownLayout() : null}
        <div data-input-parent>{this.renderInput()}</div>
        {!dropDirectionUp ? this.renderDropdownLayout() : null}
      </div>
    );
  }

  renderNative() {
    const { options, onSelect } = this.props;

    return (
      <div className={styles.nativeSelectWrapper}>
        {this.renderInput()}
        <select
          data-hook="native-select"
          className={styles.nativeSelect}
          onChange={event => {
            this._onChange(event);

            onSelect(options[event.target.selectedIndex]);
          }}
        >
          {options.map((option, index) => (
            <option
              data-hook={`native-option-${option.id}`}
              data-index={index}
              key={option.id}
              value={option.value}
              className={styles.nativeOption}
            >
              {option.value}
            </option>
          ))}
        </select>
      </div>
    );
  }

  renderDropdownLayout() {
    const { options } = this.props;

    return (
      <div data-hook="dropdown-layout-wrapper">
        <DropdownLayout
          ref={dropdownLayout => (this.dropdownLayout = dropdownLayout)}
          visible={this._isDropdownLayoutVisible()}
          tabIndex={-1}
          options={options}
          isComposing={this.state.isComposing}
          onSelect={this._onSelect}
          onClose={this.hideOptions}
        />
      </div>
    );
  }

  renderInput() {
    const { inputElement } = this.props;

    return React.cloneElement(inputElement, {
      ref: input => (this.input = input),
      onChange: this._onChange,
      onFocus: this._onFocus,
      onBlur: this._onBlur,
      onClick: this._onClick,
    });
  }

  showOptions() {
    this.setState({ showOptions: true, lastOptionsShow: Date.now() });
  }

  hideOptions() {
    if (this.state.showOptions) {
      this.setState({ showOptions: false });
    }
  }

  select() {
    this.input.select();
  }

  focus(options = {}) {
    this.input.focus(options);
  }

  blur() {
    this.input.blur();
  }

  _isDropdownLayoutVisible() {
    return (
      this.state.showOptions &&
      (this.props.showOptionsIfEmptyInput || this.state.inputValue.length > 0)
    );
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

  _onChange(event) {
    this.setState({ inputValue: event.target.value });

    this.props.onChange && this.props.onChange(event);
  }

  _onFocus(event) {
    if (this.props.disabled) {
      return;
    }

    this._focused = true;
    this.props.onFocus && this.props.onFocus(event);
  }

  _onBlur(event) {
    this._focused = false;
    this.props.onBlur && this.props.onBlur(event);
  }

  _onClick(event) {
    console.log(event);
    if (this.state.showOptions) {
      if (Date.now() - this.state.lastOptionsShow > 2000) {
        this.hideOptions();
      }
    } else {
      this.showOptions();
    }

    this.props.onClick && this.props.onClick(event);
  }
}

export default Select;
