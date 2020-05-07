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
import omit from 'omit';
import isEqual from 'lodash/isEqual';
import sortBy from 'lodash/sortBy';
import onClickOutside, {
  OnClickOutProps,
  InjectedOnClickOutProps,
} from 'react-onclickoutside';

import Input from '../../Input';
import Text from '../../Text';
import styles from './Dropdown.module.scss';

const NO_SELECTED_ID = null;
const NOT_HOVERED_INDEX = -1;
export const DIVIDER_OPTION_VALUE = '-';

const modulu = (n, m) => {
  const remain = n % m;
  return remain >= 0 ? remain : remain + m;
};

// We're declaring a wrapper for the clickOutside machanism and not using the
// HOC because of Typings errors.
const ClickOutsideWrapper: React.ComponentClass<OnClickOutProps<
  InjectedOnClickOutProps
>> = onClickOutside(
  class extends React.Component<any, any> {
    handleClickOutside() {
      this.props.handleClickOutside();
    }

    render() {
      return this.props.children;
    }
  },
);

class Dropdown extends React.PureComponent {
  static displayName = 'Dropdown';

  static propTypes = {
    ...Input.propTypes,
    native: PropTypes.bool,
    /** Array of objects. Objects must have an Id and can can include value and node. If value is '-', a divider will be rendered instead (dividers do not require an id). */
    options: PropTypes.array,
    /** Function that receives an option, and should return the id of the option. By default returns `option.id`. */
    idParser: PropTypes.func,
    /** Function that receives an option, and should return the value to be displayed. By default returns `option.value`. */
    valueParser: PropTypes.func,
    /** Sets the selected option id. (Implies Controlled mode) */
    // selectedId: DropdownLayout.propTypes.selectedId,
    /** An initial selected option id. (Implies Uncontrolled mode) */
    // initialSelectedId: DropdownLayout.propTypes.selectedId,
    inputElement: PropTypes.element,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onClick: PropTypes.func,
    /** Callback function called whenever an option becomes focused (hovered/active). Receives the relevant option object from the original props.options array. */
    onOptionMarked: PropTypes.func,
    closeOnSelect: PropTypes.bool,
    /** Callback function called whenever the user selects a different option in the list */
    onSelect: PropTypes.func,
    onClose: PropTypes.func,
    /** A fixed header to the list */
    fixedHeader: PropTypes.node,
    /** A fixed footer to the list */
    fixedFooter: PropTypes.node,
    className: PropTypes.string,
    dataHook: PropTypes.string,
  };

  static defaultProps = {
    options: [],
    inputElement: <Input />,
    closeOnSelect: true,
  };

  static isOptionsEqual(optionA, optionB) {
    return isEqual(sortBy(optionA, 'id'), sortBy(optionB, 'id'));
  }

  constructor(props) {
    super(props);

    this.state = {
      showOptions: false,
      hoveredIndex: NOT_HOVERED_INDEX,
      value: '',
      selectedId: NO_SELECTED_ID,
    };

    this._renderInput = this._renderInput.bind(this);
    this._renderNode = this._renderNode.bind(this);
    this._renderDivider = this._renderDivider.bind(this);
    this._renderItem = this._renderItem.bind(this);
    this.getId = this.getId.bind(this);
    this.getValue = this.getValue.bind(this);
    this.showOptions = this.showOptions.bind(this);
    this.hideOptions = this.hideOptions.bind(this);
    this._onClickOutside = this._onClickOutside.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onMouseEnter = this._onMouseEnter.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);
    this._onInputClick = this._onInputClick.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onSelect = this._onSelect.bind(this);
    this._isSelectableOption = this._isSelectableOption.bind(this);
    this._isControlled = this._isControlled.bind(this);
    this._onMouseEnterOption = this._onMouseEnterOption.bind(this);
    this._onMouseLeaveOption = this._onMouseLeaveOption.bind(this);
    this._markOption = this._markOption.bind(this);
    this._getMarkedIndex = this._getMarkedIndex.bind(this);
    this._markNextStep = this._markNextStep.bind(this);
  }

  componentDidMount() {
    if (this.props.selectedId) {
      const selectedOption = this.props.options.filter(option => this.getId(option) === this.props.selectedId);
      if (selectedOption.length === 1) {
        this.setState({ value: this.getValue(selectedOption[0]) });
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.selectedId !== prevProps.selectedId ||
      !Dropdown.isOptionsEqual(this.props.options, prevProps.options)
    ) {
      const selectedOption = this.props.options.filter(option => this.getId(option) === this.props.selectedId);
      if (selectedOption.length === 1) {
        this.setState({ value: this.getValue(selectedOption[0]) });
      }
    }
  }

  render() {
    const {
      native,
      options,
      onChange,
      fixedHeader,
      fixedFooter,
    } = this.props;

    const contentClasses = classNames(styles.content, {
      [styles.contentVisible]: this.state.showOptions,
    });

    return (
      <ClickOutsideWrapper
        handleClickOutside={this._onClickOutside}
      >
        <div
          onMouseEnter={this._onMouseEnter}
          onMouseLeave={this._onMouseLeave}
          onKeyDown={this._onKeyDown}
          className={styles.root}
        >
          {this._renderInput()}
          {native ? (
            <select
              onChange={this._onChange}
              className={styles.nativeSelect}
              data-hook="native-select"
            >
              {options.map((option, index) => (
                <option
                  key={this.getId(option)}
                  value={this.getValue(option)}
                  className={styles.nativeOption}
                  data-index={index}
                  data-hook={`native-option-${this.getId(option)}`}
                >
                  {this.getValue(option)}
                </option>
              ))}
            </select>
          ) : (
            <div className={contentClasses}>
              {this._renderNode(fixedHeader)}
              {options.map((option, index) => this._renderItem(option, index))}
              {this._renderNode(fixedFooter)}
            </div>
          )}
        </div>
      </ClickOutsideWrapper>
    );
  }

  _renderInput() {
    const {
      inputElement,
      ...props
    } = this.props;
    const inputProps = {
      ...omit(
        [
          'onChange',
          'dataHook',
          //
          'closeOnSelect',
          'menuArrow',
          'markedOption',
        ],
        props,
      ),
    };

    return React.cloneElement(inputElement, {
      ref: input => (this.input = input),
      ...inputProps,
      menuArrow: true,
      value: this.state.value,
      onInputClicked: inputElement.type.name === 'ThemedInput' ? this._onInputClick : undefined,
      onClick: this._onClick,
    });
  }

  _renderNode(node) {
    return node ? <div className={styles.node}>{node}</div> : null;
  }

  _renderDivider(idx, dataHook) {
    return <div key={idx} className={styles.divider} data-hook={dataHook} />;
  }

  _renderItem(option, index) {
    const {
      optionClassName,
    } = this.props;

    if (this.getValue(option) === DIVIDER_OPTION_VALUE) {
      return this._renderDivider(index, `dropdown-divider-${this.getId(option) || index}`);
    }

    const classes = classNames(styles.option, {
      [styles.hovered]: index === this.state.hoveredIndex,
    }, optionClassName);

    return (
      <div
        key={this.getId(option)}
        onMouseEnter={() => this._onMouseEnterOption(index)}
        onMouseLeave={this._onMouseLeaveOption}
        onClick={!option.disabled ? event => this._onSelect(index, event) : null}
        className={classes}
      >
        <Text
          weight="normal"
          size="medium"
          ellipsis={false}
        >
          {typeof this.getValue(option) === 'function' ? this.getValue(option)({}) : this.getValue(option)}
        </Text>
      </div>
    );
  }

  getId(option) {
    if (this.props.idParser) {
      return this.props.idParser(option);
    } else {
      return option.id;
    }
  }

  getValue(option) {
    if (this.props.valueParser) {
      return this.props.valueParser(option);
    } else {
      return option.value;
    }
  }

  showOptions() {
    if (!this.state.showOptions) {
      this.setState({ showOptions: true });
      this.props.onShowOptions && this.props.onShowOptions();
    }
  }

  hideOptions() {
    if (this.state.showOptions) {
      this.setState({ showOptions: false });
      this.props.onHideOptions && this.props.onHideOptions();
      this.props.onClose && this.props.onClose();
    }
  }

  _onClickOutside() {
    if (!this.state.showOptions) {
      return;
    }
    // Hide the popover
    this.hideOptions();

    // Trigger the ClickOutside callback
    this.props.onClickOutside && this.props.onClickOutside();
  }

  _onKeyDown(event) {
    switch (event.key) {
      case 'ArrowDown': {
        this._markNextStep(1);
        break;
      }

      case 'ArrowUp': {
        this._markNextStep(-1);
        break;
      }

      case ' ':
      case 'Spacebar':
      case 'Enter': {
        if (!this._onSelect(this.state.hoveredIndex, event)) {
          return false;
        }
        break;
      }

      case 'Tab': {
        if (this.props.closeOnSelect) {
          return this._onSelect(this.state.hoveredIndex, event);
        } else {
          if (this._onSelect(this.state.hoveredIndex, event)) {
            event.preventDefault();
            return true;
          } else {
            return false;
          }
        }
        break;
      }

      case 'Escape': {
        this._markOption(NOT_HOVERED_INDEX);
        this.props.onClose && this.props.onClose();
        break;
      }

      default: {
        return false;
      }
    }
    event.stopPropagation();
    return true;
  }

  _onMouseEnter() {
    this.props.openOnHover && this.setState({ showOptions: true });
    this.props.onMouseEnter && this.props.onMouseEnter();
  }

  _onMouseLeave() {
    this.props.openOnHover && this.setState({ showOptions: false });
    this.props.onMouseLeave && this.props.onMouseLeave();
  }

  _onInputClick() {
    if (this.state.showOptions) {
      this.input.blur();
    }
    this.setState({ showOptions: !this.state.showOptions });
    this.props.onInputClick && this.props.onInputClick();
  }

  _onClick() {
    this.setState({ showOptions: !this.state.showOptions });
    this.props.onClick && this.props.onClick();
  }

  _onChange(event) {
    this.props.onChange && this.props.onChange(event);
    this.props.onSelect && this.props.onSelect(this.props.options[event.target.selectedIndex]);
  }

  _onSelect(index, event) {
    const { options, onSelect } = this.props;
    const chosenOption = options[index];

    if (this.props.closeOnSelect) {
      this.hideOptions();
    }

    this.setState({ value: this.getValue(chosenOption) });

    if (chosenOption) {
      const sameOptionWasPicked = chosenOption.id === this.state.selectedId;
      if (onSelect) {
        event.stopPropagation();
        onSelect(chosenOption, sameOptionWasPicked);
      }
    }
    this._markOption(NOT_HOVERED_INDEX);
    return !!onSelect && chosenOption;
  }

  _isSelectableOption(option) {
    return option && option.value !== '-' && !option.disabled && !option.title;
  }

  _isControlled() {
    return (
      typeof this.props.selectedId !== 'undefined' &&
      typeof this.props.onSelect !== 'undefined'
    );
  }

  _onMouseEnterOption(index) {
    if (this._isSelectableOption(this.props.options[index])) {
      this._markOption(index);
    }
  }

  _onMouseLeaveOption() {
    this._markOption(NOT_HOVERED_INDEX);
  }

  _markOption(index) {
    this.setState({ hoveredIndex: index });

    this.props.onOptionMarked && this.props.onOptionMarked(this.props.options[index]);
  }

  _getMarkedIndex() {
    const { options } = this.props;
    const useHoverIndex = this.state.hoveredIndex > NOT_HOVERED_INDEX;
    const useSelectedIdIndex = typeof this.state.selectedId !== 'undefined';

    let markedIndex;
    if (useHoverIndex) {
      markedIndex = this.state.hoveredIndex;
    } else if (useSelectedIdIndex) {
      markedIndex = options.findIndex(
        option => option.id === this.state.selectedId,
      );
    } else {
      markedIndex = NOT_HOVERED_INDEX;
    }

    return markedIndex;
  }

  _markNextStep(step) {
    const { options } = this.props;

    if (!options.some(this._isSelectableOption)) {
      return;
    }

    let markedIndex = this._getMarkedIndex();

    do {
      markedIndex = Math.abs(
        modulu(Math.max(markedIndex + step, -1), options.length),
      );
    } while (!this._isSelectableOption(options[markedIndex]));
    this._markOption(markedIndex);
  }
}

export default Dropdown;
