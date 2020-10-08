import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import DropdownBase from '../DropdownBase';
import { listItemActionBuilder } from '../ListItemAction';
import { placements } from '../Popover';
import styles from './PopoverMenu.module.scss';

class PopoverMenu extends React.PureComponent {
  static displayName = 'PopoverMenu';

  static propTypes = {

  };

  static defaultProps = {
    maxWidth: 204,
    minWidth: 144,
    placement: 'bottom',
    appendTo: 'window',
    textSize: 'medium',
    fixed: true,
    flip: true,
    showArrow: true,
    ellipsis: false,
    maxHeight: 'auto',
  };

  static MenuItem = () => ({});

  static Divider = () => ({});

  constructor(props) {
    super(props);

    this.state = {
      focused: 0,
    };
    this.savedOnClicks = null;
    this.focusableList = [];
    this.children = {};

    this._renderOptions = this._renderOptions.bind(this);
    this._renderTrigerElement = this._renderTrigerElement.bind(this);
    this._filterChildren = this._filterChildren.bind(this);
    this._buildOptions = this._buildOptions.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onSelect = this._onSelect.bind(this);
    this._saveOnClicks = this._saveOnClicks.bind(this);
    this._focus = this._focus.bind(this);
  }

  render() {
    const {
      className,
    } = this.props;

    return (
      <DropdownBase
        {...this.props}
        animate
        tabIndex={-1}
        options={this._renderOptions()}
        onSelect={this._onSelect}
        className={classNames(styles.root, className)}
      >
        {({ open, close, toggle }) => this._renderTrigerElement({ open, close, toggle })}
      </DropdownBase>
    );
  }

  _renderOptions() {
    const { textSize, ellipsis } = this.props;
    const children = this._filterChildren(this.props.children);
    const options = this._buildOptions(children);

    // Store information for further use
    this._saveOnClicks(options);

    return options.map(option => {
      // Custom
      if (option.custom) {
        return option;
      }

      // Divider
      if (option.divider) {
        return null;
        // return listItemSectionBuilder({
        //   type: 'divider',
        //   ...option,
        // });
      }

      const {
        id,
        disabled,
        onClick,
        dataHook,
        skin,
        subtitle,
        ...rest
      } = option;

      const { focused } = this.state;

      if (!disabled) {
        this.focusableList = [...this.focusableList, id];
      }

      return listItemActionBuilder({
        ...rest,
        id,
        disabled,
        as: 'button',
        dataHook: dataHook || `popover-menu-${id}`,
        ref: ref => (this.children[id] = ref),
        tabIndex: id === focused && !disabled ? '0' : '-1',
        onKeyDown: e => this._onKeyDown(e, id),
        skin: skin || 'dark',
        size: textSize,
        className: styles.listItem,
        ellipsis,
        subtitle,
      });
    });
  }

  _renderTrigerElement({ toggle, open, close }) {
    const { triggerElement } = this.props;
    if (!triggerElement) {
      return null;
    }

    return React.isValidElement(triggerElement)
      ? React.cloneElement(triggerElement, {
          onClick: toggle,
        })
      : triggerElement({
          onClick: toggle,
          toggle,
          open,
          close,
        });
  }

  _filterChildren(children) {
    return React.Children.map(children, child => child).filter(
      child => typeof child !== 'string',
    );
  }

  _buildOptions(children) {
    return children.map((child, id) => {
      const displayName = child.type && child.type.displayName;

      if (displayName && displayName === 'PopoverMenu.Divider') {
        return {
          id,
          divider: true,
          dataHook: child.props.dataHook,
        };
      }

      if (displayName && displayName === 'PopoverMenu.MenuItem') {
        return {
          id,
          title: child.props.text,
          onClick: child.props.onClick,
          skin: child.props.skin,
          dataHook: child.props.dataHook,
          prefixIcon: child.props.prefixIcon,
          disabled: child.props.disabled,
          subtitle: child.props.subtitle,
        };
      }

      return { id, value: child, custom: true, overrideStyle: true };
    });
  }

  _onKeyDown(e, id) {
    const ARROW_LEFT = 37;
    const ARROW_UP = 38;
    const ARROW_RIGHT = 39;
    const ARROW_DOWN = 40;

    const length = this.focusableList.length;
    let focused = this.state.focused;

    const keyCode = e.keyCode;

    if (keyCode === ARROW_LEFT || keyCode === ARROW_UP) {
      if (id === 0) {
        focused = this.focusableList[length - 1];
      } else {
        const nextIndex = this.focusableList.indexOf(id) - 1;
        focused = this.focusableList[nextIndex];
      }
    }

    if (keyCode === ARROW_RIGHT || keyCode === ARROW_DOWN) {
      if (id === length - 1) {
        focused = this.focusableList[0];
      } else {
        const nextIndex = this.focusableList.indexOf(id) + 1;
        focused = this.focusableList[nextIndex];
      }
    }

    if (focused !== this.state.focused) {
      this._focus(e, focused);
    }
  }

  _onSelect(e) {
    const onClick = this.savedOnClicks.find(({ id }) => id === e.id).onClick;
    onClick && onClick();
  }

  _saveOnClicks(options) {
    this.savedOnClicks = options.map(({ id, onClick }) => ({ id, onClick }));
  };

  _focus(e, focused) {
    e.preventDefault();
    const native = this.children[focused].focus;
    const focusableHOC = this.children[focused].wrappedComponentRef;

    const callback = native
      ? this.children[focused].focus
      : focusableHOC
      ? focusableHOC.innerComponentRef.focus
      : () => ({});

    this.setState({ focused }, () => callback());
  }
}

PopoverMenu.MenuItem.displayName = 'PopoverMenu.MenuItem';
PopoverMenu.Divider.displayName = 'PopoverMenu.Divider';

export default PopoverMenu;
