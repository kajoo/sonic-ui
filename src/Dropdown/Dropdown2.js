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

import Input from '../Input';
import Text from '../Text';
import DropdownLayout from '../DropdownLayout/DropdownLayout';
import Popover from '../Popover';
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
    this.showOptions = this.showOptions.bind(this);
    this.hideOptions = this.hideOptions.bind(this);
    this._onClickOutside = this._onClickOutside.bind(this);
    this._onMouseEnter = this._onMouseEnter.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);
    this._onInputClicked = this._onInputClicked.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onSelect = this._onSelect.bind(this);
  }

  // Abstraction
  inputAdditionalProps() {}
  dropdownAdditionalProps() {}

  componentDidMount() {
    if (this.props.selectedId) {
      const selectedOption = this.props.options.filter(option => option.id === this.props.selectedId);
      if (selectedOption.length === 1) {
        this.setState({ value: selectedOption[0].value });
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.selectedId !== prevProps.selectedId ||
      !Dropdown.isOptionsEqual(this.props.options, prevProps.options)
    ) {
      const selectedOption = this.props.options.filter(option => option.id === this.props.selectedId);
      if (selectedOption.length === 1) {
        this.setState({ value: selectedOption[0].value });
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
      <Popover
        shown={this.state.showOptions}
      >
        <Popover.Element>
          {this._renderInput()}
        </Popover.Element>
        <Popover.Content>
          <DropdownLayout
            {...this.props}
            visible={this.state.showOptions}
            onSelect={this._onSelect}
            tabIndex={-1}
          />
        </Popover.Content>
      </Popover>
    );

    // onKeyDown={this._onKeyDown}
    return (
      <ClickOutsideWrapper
        handleClickOutside={this._onClickOutside}
      >
        <div
          onMouseEnter={this._onMouseEnter}
          onMouseLeave={this._onMouseLeave}
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
                  key={option.id}
                  value={option.value}
                  className={styles.nativeOption}
                  data-index={index}
                  data-hook={`native-option-${option.id}`}
                >
                  {option.value}
                </option>
              ))}
            </select>
          ) : (
            <DropdownLayout
              {...this.props}
              visible={this.state.showOptions}
              onSelect={this._onSelect}
              tabIndex={-1}
            />
          )}
        </div>
      </ClickOutsideWrapper>
    );
  }

  _renderInput() {
    const inputAdditionalProps = this.inputAdditionalProps() || {};
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
        this.props,
      ),
      ...inputAdditionalProps,
    };

    const { inputElement } = inputProps;
    return React.cloneElement(inputElement, {
      ref: input => (this.input = input),
      menuArrow: true,
      ...inputProps,
      onKeyDown: inputAdditionalProps.onKeyDown,
      // value: this.state.value,
      // onInputClicked: inputElement.type.displayName === 'ThemedInput' ? this._onInputClicked : undefined,
      onInputClicked: this._onInputClicked,
      onClick: this._onClick,
      onChange: this._onChange,
      textOverflow: this.props.textOverflow || inputElement.props.textOverflow,
      tabIndex: this.props.native ? -1 : 0,
    });
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

  _onMouseEnter() {
    this.props.openOnHover && this.setState({ showOptions: true });
    this.props.onMouseEnter && this.props.onMouseEnter();
  }

  _onMouseLeave() {
    this.props.openOnHover && this.setState({ showOptions: false });
    this.props.onMouseLeave && this.props.onMouseLeave();
  }

  _onInputClicked() {
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

  _onSelect(option, sameOptionWasPicked) {
    const { onSelect } = this.props;

    if (this.props.closeOnSelect) {
      this.hideOptions();
    }

    onSelect && onSelect(option, sameOptionWasPicked);
  }
}

export default Dropdown;
