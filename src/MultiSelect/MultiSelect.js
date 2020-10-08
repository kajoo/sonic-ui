import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import difference from 'difference';

import InputWithTags from './InputWithTags';
import InputWithOptions from '../InputWithOptions';
import DropdownLayout, { propTypes as DropdownLayoutPropTypes } from '../DropdownLayout/DropdownLayout';
import styles from './MultiSelect.module.scss';

class MultiSelect extends InputWithOptions {
  static displayName = 'MultiSelect';

  static propTypes = {
    selectedId: DropdownLayoutPropTypes.selectedId,
    closeOnSelect: DropdownLayoutPropTypes.closeOnSelect,
    selectedHighlight: DropdownLayoutPropTypes.selectedHighlight,

    customInput: PropTypes.elementType
    ? PropTypes.oneOfType([PropTypes.func, PropTypes.elementType])
    : PropTypes.oneOfType([PropTypes.func]),

    /** passing `'select'`  will render a readOnly input with menuArrow suffix */
    mode: PropTypes.string,

    /** When set to true this component is disabled */
    disabled: PropTypes.bool,

    /** Optional list of strings that are selected suggestions. */
    tags: PropTypes.array,

    /** Delimiters that will trigger a Submit action (call to `onTagsAdded`). By default it is `[,]` but also
     * <kbd>enter</kbd> and <kbd>tab</kbd> keys work. */
    delimiters: PropTypes.array,

    /** Callback predicate for the filtering options function */
    predicate: PropTypes.func,

    /** When set to false, the input will not be cleared on blur */
    clearOnBlur: PropTypes.bool,

    /** A callback which is called when the user performs a Submit-Action.
     * Submit-Action triggers are: "Enter", "Tab", [typing any defined delimiters], Paste action.
     * `onManuallyInput(values: Array<string>): void - The array of strings is the result of splitting the input value by the given delimiters */
    onManuallyInput: PropTypes.func,

    /** A callback function to be called when a tag should be removed.
     * The expected callback signature is `onRemoveTag(tagId: number | string) => void`.
     */
    onRemoveTag: PropTypes.func,

    /** When this callback function is set, tags can be reordered.
     * The expected callback signature is `onReorder({addedIndex: number, removedIndex: number}) => void`
     */
    onReorder: PropTypes.func,

    /** A callback which is called when the user selects an option from the list.
     * `onSelect(option: Option): void` - Option is the original option from the provided `options` prop.
     */
    onSelect: PropTypes.func,
  };

  static autoSizeInputWithRef = () =>
    React.forwardRef((props, ref) =>
      (({ className, ref, ...rest }) => {
        const inputClassName = classNames(className, styles.autoSizeInput);
        return <input {...rest} ref={ref} className={inputClassName} />;
      })({ ...props, ref }),
    );

  static defaultProps = {
    ...InputWithOptions.defaultProps,
    highlight: true,
    predicate: () => true,
    tags: [],
    delimiters: [','],
    clearOnBlur: true,
    customInput: MultiSelect.autoSizeInputWithRef(),
  };

  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      pasteDetected: false,
    };

    this.getUnselectedOptions = this.getUnselectedOptions.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onPaste = this.onPaste.bind(this);
  }

  _onSelect(option) {
    this.onSelect(option);
  }

  _onManuallyInput(inputValue, event) {
    const { value } = this.props;

    // FIXME: InputWithOptions is not updating it's inputValue state when the `value` prop changes.
    // So using `value` here, covers for that bug. (This is tested)
    // BTW: Previously, `value` was used to trigger onSelect, and `inputValue` was used to trigger onManuallyInput. Which is crazy.
    // So now both of them trigger a submit (onManuallyInput).
    const _value = (value && value.trim()) || (inputValue && inputValue.trim());

    this.submitValue(_value);
    _value && event.preventDefault();

    if (this.closeOnSelect()) {
      this.hideOptions();
    }
  }

  inputAdditionalProps() {
    return {
      readOnly: false,
      disableEditing: false,
      delimiters: this.props.delimiters,
      onKeyDown: this.onKeyDown,
      onPaste: this.onPaste,
      inputElement: (
        <InputWithTags
          mode={this.props.mode}
          maxNumRows={this.props.maxNumRows}
          customSuffix={this.props.customSuffix}
          onReorder={this.props.onReorder}
        />
      ),
    };
  }

  dropdownAdditionalProps() {
    return {
      options: this.getUnselectedOptions().filter(this.props.predicate),
      closeOnSelect: false,
      selectedHighlight: false,
      selectedId: -1,
    };
  }

  getManualSubmitKeys() {
    return ['Enter', 'Tab'].concat(this.props.delimiters);
  }

  closeOnSelect() {
    return false;
  }

  onClickOutside() {
    if (this.state.showOptions) {
      this.hideOptions();
    }
  }

  getUnselectedOptions() {
    const optionIds = this.props.options.map(option => option.id);
    const tagIds = this.props.tags.map(tag => tag.id);
    const unselectedOptionsIds = difference(optionIds, tagIds);
    return this.props.options.filter(option =>
      unselectedOptionsIds.includes(option.id),
    );
  }

  _splitByDelimitersAndTrim(value) {
    const delimitersRegexp = new RegExp(this.props.delimiters.join('|'), 'g');
    return value
      .split(delimitersRegexp)
      .map(str => str.trim())
      .filter(str => str);
  }

  _onChange(event) {
    if (this.state.pasteDetected) {
      const value = event.target.value;
      this.setState({ pasteDetected: false }, () => {
        this.submitValue(value);
      });
    } else {
      this.setState({ inputValue: event.target.value });
      this.props.onChange && this.props.onChange(event);
    }
    // If the input value is not empty, should show the options
    if (event.target.value.trim()) {
      this.showOptions();
    }
  }

  onKeyDown(event) {
    const { tags, value, onRemoveTag } = this.props;

    if (
      tags.length > 0 &&
      (event.key === 'Delete' || event.key === 'Backspace') &&
      value.length === 0
    ) {
      onRemoveTag(last(tags).id);
    }

    if (event.key === 'Escape') {
      this.clearInput();
      super.hideOptions();
    }

    if (this.props.onKeyDown) {
      this.props.onKeyDown(event);
    }
  }

  onPaste() {
    this.setState({ pasteDetected: true });
  }

  onSelect(option) {
    this.clearInput();

    const { onSelect } = this.props;

    if (onSelect) {
      onSelect(this.props.options.find(o => o.id === option.id));
    }

    setTimeout(() => {
      this.input && this.input.focus();
    }, 0);
  }

  hideOptions() {
    super.hideOptions();
    if (this.props.clearOnBlur) {
      this.clearInput();
    }
  }

  submitValue(inputValue) {
    if (!inputValue) {
      return;
    }

    const { onManuallyInput } = this.props;
    const values = this._splitByDelimitersAndTrim(inputValue);
    onManuallyInput && values.length && onManuallyInput(values);

    this.clearInput();
  }

  clearInput() {
    this.input.clear();
    if (this.props.onChange) {
      this.props.onChange({ target: { value: '' } });
    }
  }
}

export default MultiSelect;
