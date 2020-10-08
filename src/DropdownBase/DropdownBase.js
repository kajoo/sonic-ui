import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Popover, { placements } from '../Popover';
import DropdownLayout from '../DropdownLayout';
import styles from './DropdownBase.module.scss';

class DropdownBase extends React.PureComponent {
  static displayName = 'DropdownBase';

  static propTypes = {

    dataHook: PropTypes.string,
  };

  static defaultProps = {
    appendTo: 'parent',
    placement: 'bottom',
    showArrow: false,
    maxHeight: '260px',
    fluid: false,
    animate: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      open: props.open,
      selectedId: props.selectedId || props.initialSelectedId || -1,
    };

    this._renderChildren = this._renderChildren.bind(this);
    this._isControllingOpen = this._isControllingOpen.bind(this);
    this._isControllingSelection = this._isControllingSelection.bind(this);
    this._open = this._open.bind(this);
    this._close = this._close.bind(this);
    this._toggle = this._toggle.bind(this);
    this._handleClickOutside = this._handleClickOutside.bind(this);
    this._handlePopoverMouseEnter = this._handlePopoverMouseEnter.bind(this);
    this._handlePopoverMouseLeave = this._handlePopoverMouseLeave.bind(this);
    this._handleSelect = this._handleSelect.bind(this);
    this._handleClose = this._handleClose.bind(this);
    this._getSelectedOption = this._getSelectedOption.bind(this);
    this._isOpenKey = this._isOpenKey.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._delegateKeyDown = this._delegateKeyDown.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // Keep internal state updated if needed
    if (
      this._isControllingOpen(nextProps) &&
      this.props.open !== nextProps.open
    ) {
      this.setState({ open: nextProps.open });
    }

    if (
      this._isControllingSelection(nextProps) &&
      this.props.selectedId !== nextProps.selectedId
    ) {
      this.setState({ selectedId: nextProps.selectedId });
    }
  }

  render() {
    const {
      options,
      minWidth,
      maxWidth,
      maxHeight,
      showArrow,
      tabIndex,
      overflow,
      className,
    } = this.props;
    const { open, selectedId } = this.state;

    return (
      <Popover
        {...this.props}
        shown={open}
        onKeyDown={this._handleKeyDown}
        onMouseEnter={this._handlePopoverMouseEnter}
        onMouseLeave={this._handlePopoverMouseLeave}
        onClickOutside={this._handleClickOutside}
        className={classNames(styles.root, {
          [styles.withWidth]: Boolean(minWidth || maxWidth),
          [styles.withArrow]: showArrow,
        }, className)}
      >
        <Popover.Element>{this._renderChildren()}</Popover.Element>

        <Popover.Content>
          <div
            style={{
              minWidth,
              maxWidth,
            }}
          >
            <DropdownLayout
              ref={ref => this.dropdownLayout = ref}
              visible
              options={options}
              selectedId={selectedId}
              onSelect={this._handleSelect}
              maxHeightPixels={maxHeight}
              tabIndex={tabIndex}
              overflow={overflow}
              onClose={this._handleClose}
            />
          </div>
        </Popover.Content>
      </Popover>
    );
  }

  _renderChildren() {
    const { children } = this.props;
    const { selectedId, open } = this.state;

    if (!children) {
      return null;
    }

    return React.isValidElement(children)
      ? children
      : children({
        open: this._open,
        close: this._close,
        toggle: this._toggle,
        isOpen: Boolean(open),

        delegateKeyDown: this._delegateKeyDown,
        selectedOption: this._getSelectedOption(selectedId),
      });
  }

  _isControllingOpen() {
    return typeof this.props.open !== 'undefined';
  }

  _isControllingSelection() {
    return (
      typeof this.props.selectedId !== 'undefined' &&
      typeof this.props.onSelect !== 'undefined'
    );
  }

  _open() {
    !this._isControllingOpen() && this.setState({ open: true });
  }

  _close(e) {
    if (this._isControllingOpen()) {
      return;
    }

    // If called within a `mouseleave` event on the target element, we would like to close the
    // popover only on the popover's `mouseleave` event
    if (e && e.type === 'mouseleave') {
      // We're not using `setState` since we don't want to wait for the next render
      this._shouldCloseOnMouseLeave = true;
    } else {
      this.setState({ open: false });
    }
  }

  _toggle() {
    !this._isControllingOpen() &&
      this.setState(({ open }) => ({
        open: !open,
      }));
  }

  _handleClickOutside() {
    const { onClickOutside } = this.props;

    this._close();
    onClickOutside && onClickOutside();
  }

  _handlePopoverMouseEnter() {
    const { onMouseEnter } = this.props;

    onMouseEnter && onMouseEnter();
  }

  _handlePopoverMouseLeave() {
    const { onMouseLeave } = this.props;

    if (this._shouldCloseOnMouseLeave) {
      this._shouldCloseOnMouseLeave = false;

      this.setState({
        open: false,
      });
    }

    onMouseLeave && onMouseLeave();
  }

  _handleSelect(selectedOption) {
    const newState = {};

    if (!this._isControllingOpen()) {
      newState.open = false;
    }

    if (!this._isControllingSelection()) {
      newState.selectedId = selectedOption.id;
    }

    this.setState(newState, () => {
      const { onSelect } = this.props;
      onSelect && onSelect(selectedOption);
    });
  }

  _handleClose() {
    if (this.state.open) {
      this._close();
    }
  }

  _getSelectedOption(selectedId) {
    return this.props.options.find(({ id }) => id === selectedId);
  }

  /**
   * Determine if a certain key should open the DropdownLayout
   */
  _isOpenKey(key) {
    return ['Enter', 'Spacebar', ' ', 'ArrowDown'].includes(key);
  }

  /**
   * A common `keydown` event that can be used for the target elements. It will automatically
   * delegate the event to the underlying <DropdownLayout/>, and will determine when to open the
   * dropdown depending on the pressed key.
   */
  _handleKeyDown(e) {
    if (this._isControllingOpen()) {
      return;
    }

    const isHandledByDropdownLayout = this._delegateKeyDown(e);

    if (!isHandledByDropdownLayout) {
      if (this._isOpenKey(e.key)) {
        this._open();
        e.preventDefault();
      }
    }
  }

  /*
   * Delegate the event to the DropdownLayout. It'll handle the navigation, option selection and
   * closing of the dropdown.
   */
  _delegateKeyDown(e) {
    if (!this.dropdownLayout) {
      return false;
    }

    return this.dropdownLayout._onKeyDown(e);
  }
}

export default DropdownBase;
