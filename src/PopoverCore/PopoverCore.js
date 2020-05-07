/**
 * Copyright (c) Kajoo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import PopperJS from 'popper.js';
import classNames from 'classnames';
import onClickOutside, {
  OnClickOutProps,
  InjectedOnClickOutProps,
} from 'react-onclickoutside';
import { Manager, Reference, Popper } from 'react-popper';
import { CSSTransition } from 'react-transition-group';
import { Portal } from 'react-portal';

import styles from './PopoverCore.module.scss';
import { createModifiers } from './modifiers';
import { popoverTestUtils } from './helpers';
import { getAppendToElement, Predicate } from './utils/getAppendToElement';
import {
  buildChildrenObject,
  createComponentThatRendersItsChildren,
  // ElementProps,
} from '../utils/element';

const omit = (key, obj) => {
  const { [key]: omitted, ...rest } = obj;
  return rest;
};

const shouldAnimatePopover = ({ timeout }: PopoverProps) => {
  if (typeof timeout === 'object') {
    const { enter, exit } = timeout;

    return (
      typeof enter !== 'undefined' &&
      typeof exit !== 'undefined' &&
      (enter > 0 || exit > 0)
    );
  }

  return !!timeout;
};

const getArrowShift = (shift: number | undefined, direction: string) => {
  if (!shift && !isTestEnv) {
    return {};
  }

  return {
    [direction === 'top' || direction === 'bottom'
      ? 'left'
      : 'top']: `${shift}px`,
  };
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

class PopoverCore extends React.Component {
  static displayName = 'PopoverCore';

  static propTypes = {
    /** The location to display the content */
    placement: PropTypes.instanceOf(PopperJS.Placement),
    /** Is the content shown or not */
    shown: PropTypes.bool,
    /** onClick on the component */
    onClick: PropTypes.func,
    /** Provides callback to invoke when clicked outside of the popover */
    onClickOutside: PropTypes.func,
    /**
     * Clicking on elements with this excluded class will will not trigger onClickOutside callback
     */
    excludeClass: PropTypes.string,
    /** onMouseEnter on the component */
    onMouseEnter: PropTypes.func,
    /** onMouseLeave on the component */
    onMouseLeave: PropTypes.func,
    /** onKeyDown on the target component */
    onKeyDown: PropTypes.func,
    /** Show show arrow from the content */
    showArrow: PropTypes.bool,
    /**
     * Whether to enable the flip behaviour. This behaviour is used to flip the `<Popover/>`'s placement
     * when it starts to overlap the target element (`<Popover.Element/>`).
     */
    flip: PropTypes.bool,
    /**
     * Whether to enable the fixed behaviour. This behaviour is used to keep the `<Popover/>` at it's
     * original placement even when it's being positioned outside the boundary.
     */
    fixed: PropTypes.bool,
    /** Moves popover relative to the parent */
    moveBy: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),
    /** Hide Delay in ms */
    hideDelay: PropTypes.number,
    /** Show Delay in ms */
    showDelay: PropTypes.number,
    /** Moves arrow by amount */
    moveArrowTo: PropTypes.number,
    /** Enables calculations in relation to a dom element */
    appendTo: PropTypes.oneOfType([
      PropTypes.instanceOf(PopperJS.Boundary),
      PropTypes.oneOf(['parent']),
      PropTypes.element,
      PropTypes.instanceOf(Predicate),
    ]),
    // PopperJS.Boundary | 'parent' | Element | Predicate
    /** Animation timer */
    timeout: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({ enter: PropTypes.number, exit: PropTypes.number }),
    ]),
    /** Inline style */
    style: PropTypes.object,
    /** Id */
    id: PropTypes.string,
    /** Custom arrow element */
    customArrow: PropTypes.node,
    /** target element role value */
    role: PropTypes.string,
    /** popover z-index */
    zIndex: PropTypes.number,
    /**
     * popovers content is set to minnimum width of trigger element,
     * but it can expand up to the value of maxWidth.
     */
    dynamicWidth: PropTypes.bool,
    /**
     * popover content minWidth value
     * - `number` value which converts to css with `px`
     * - `string` value that contains `px`
     */
    minWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * popover content maxWidth value
     * - `number` value which converts to css with `px`
     * - `string` value that contains `px`
     */
    maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * popover content width value
     * - `number` value which converts to css with `px`
     * - `string` value that contains `px`
     */
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * Breaking change:
     * When true - onClickOutside will be called only when popover content is shown
     */
    disableClickOutsideWhenClosed: PropTypes.bool,
    /** custom classname */
    className: PropTypes.string,
  };

  static defaultProps = {
    flip: true,
    fixed: false,
    zIndex: 1000,
  };

  static Element = createComponentThatRendersItsChildren('Popover.Element');
  static Content = createComponentThatRendersItsChildren('Popover.Content');

  constructor(props) {
    super(props);

    this.state = {
      isMounted: false,
      shown: props.shown || false,
    };

    this.targetRef = null;
    this.portalNode = null;
    this.stylesObj = null;
    this.appendToNode = null;
    this.contentHook;

    this.popperScheduleUpdate = null;

    // Timer instances for the show/hide delays
    this._hideTimeout = null;
    this._showTimeout = null;
  }

  componentDidMount() {
    this.initAppendToNode();
    this.setState({ isMounted: true });
  }

  componentDidUpdate(prevProps) {
    const { shown } = this.props;
    if (this.portalNode) {
      // Re-calculate the portal's styles
      // this.stylesObj = style('root', {}, omit('data-hook', this.props));
      this.stylesObj = styles.root;

      // Apply the styles to the portal
      this.applyStylesToPortaledNode();
    }

    // Update popover visibility
    if (prevProps.shown !== shown) {
      if (shown) {
        this.showPopover();
      } else {
        this.hidePopover();
      }
    } else {
      // Update popper's position
      this.updatePosition();
    }
  }

  componentWillUnmount() {
    if (this.portalNode && this.appendToNode.children.length) {
      // FIXME: What if component is updated with a different appendTo? It is a far-fetched use-case,
      // but we would need to remove the portaled node, and created another one.
      this.appendToNode.removeChild(this.portalNode);
    }
    this.portalNode = null;

    if (this._hideTimeout) {
      clearTimeout(this._hideTimeout);
      this._hideTimeout = null;
    }

    if (this._showTimeout) {
      clearTimeout(this._showTimeout);
      this._showTimeout = null;
    }
  }

  render() {
    const {
      onMouseEnter,
      onMouseLeave,
      onKeyDown,
      onClick,
      children,
      style: inlineStyles,
      id,
      excludeClass,
    } = this.props;
    const { isMounted, shown } = this.state;

    const childrenObject = buildChildrenObject(children, {
      Element: null,
      Content: null,
    });

    const shouldAnimate = shouldAnimatePopover(this.props);
    const shouldRenderPopper = isMounted && (shouldAnimate || shown);

    return (
      <Manager>
        <ClickOutsideWrapper
          handleClickOutside={this._handleClickOutside}
          outsideClickIgnoreClass={excludeClass || styles.popover}
        >
          <div
            id={id}
            style={inlineStyles}
            className={styles.root}
            data-hook={this.props['data-hook']}
            data-content-hook={this.contentHook}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <Reference innerRef={r => (this.targetRef = r)}>
              {({ ref }) => (
                <div
                  ref={ref}
                  className={styles.popoverElement}
                  data-hook="popover-element"
                  onClick={onClick}
                  onKeyDown={onKeyDown}
                >
                  {childrenObject.Element}
                </div>
              )}
            </Reference>
            {shouldRenderPopper && this.renderPopperContent(childrenObject)}
          </div>
        </ClickOutsideWrapper>
      </Manager>
    );
  }

  getPopperContentStructure(childrenObject) {
    const {
      moveBy,
      appendTo,
      placement,
      showArrow,
      moveArrowTo,
      flip,
      fixed,
      customArrow,
      role,
      id,
      zIndex,
      minWidth,
      maxWidth,
      width,
      dynamicWidth,
    } = this.props;
    const shouldAnimate = shouldAnimatePopover(this.props);

    const modifiers = createModifiers({
      minWidth,
      width,
      dynamicWidth,
      moveBy,
      appendTo,
      shouldAnimate,
      flip,
      placement,
      fixed,
      // isTestEnv,
    });

    const popper = (
      <Popper modifiers={modifiers} placement={placement}>
        {({
          ref,
          style: popperStyles,
          placement: popperPlacement,
          arrowProps,
          scheduleUpdate,
        }) => {
          this.popperScheduleUpdate = scheduleUpdate;
          return (
            <div
              ref={ref}
              data-hook="popover-content"
              data-content-element={this.contentHook}
              style={{ ...popperStyles, zIndex, maxWidth }}
              data-placement={popperPlacement || placement}
              className={classNames(styles.popover, {
                [styles.withArrow]: showArrow,
                [styles.popoverContent]: !showArrow,
              })}
            >
              {showArrow &&
                this.renderArrow(
                  arrowProps,
                  moveArrowTo,
                  popperPlacement || placement,
                  customArrow,
                )}
              <div
                key="popover-content"
                id={id}
                role={role}
                className={showArrow ? styles.popoverContent : ''}
              >
                {childrenObject.Content}
              </div>
            </div>
          );
        }}
      </Popper>
    );

    return this.wrapWithAnimations(popper);
  }

  wrapWithAnimations(popper) {
    const { timeout } = this.props;
    const { shown } = this.state;

    const shouldAnimate = shouldAnimatePopover(this.props);

    // onExited={() => detachStylesFromNode(this.portalNode, this.stylesObj)}
    return shouldAnimate ? (
      <CSSTransition
        in={shown}
        timeout={timeout}
        unmountOnExit
        classNames={{
          enter: styles['popoverAnimation-enter'],
          enterActive: styles['popoverAnimation-enter-active'],
          exit: styles['popoverAnimation-exit'],
          exitActive: styles['popoverAnimation-exit-active'],
        }}
      >
        {popper}
      </CSSTransition>
    ) : (
      popper
    );
  }

  renderPopperContent(childrenObject) {
    const popper = this.getPopperContentStructure(childrenObject);

    return this.portalNode ? (
      <Portal node={this.portalNode}>{popper}</Portal>
    ) : (
      popper
    );
  }

  renderArrow(arrowProps, moveArrowTo, placement, customArrow) {
    const commonProps = {
      ref: arrowProps.ref,
      key: 'popover-arrow',
      'data-hook': 'popover-arrow',
      style: {
        ...arrowProps.style,
        ...getArrowShift(moveArrowTo, placement),
      },
    };

    if (customArrow) {
      return customArrow(placement, commonProps);
    }

    return <div {...commonProps} className={styles.arrow} />;
  }

  applyStylesToPortaledNode() {
    const { shown } = this.state;
    const shouldAnimate = shouldAnimatePopover(this.props);

    if (shouldAnimate || shown) {
      // attachStylesToNode(this.portalNode, this.stylesObj);
    } else {
      // detachStylesFromNode(this.portalNode, this.stylesObj);
    }
  }

  initAppendToNode() {
    const { appendTo } = this.props;
    this.appendToNode = getAppendToElement(appendTo, this.targetRef);
    if (this.appendToNode) {
      this.portalNode = document.createElement('div');
      this.portalNode.setAttribute('data-hook', 'popover-portal');
      /**
       * reset overlay wrapping layer
       * so that styles from copied classnames
       * won't break the overlay:
       * - content is position relative to body
       * - overlay layer is hidden
       */
      Object.assign(this.portalNode.style, {
        position: 'static',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
      });
      this.appendToNode.appendChild(this.portalNode);
    }
  }

  showPopover() {
    const { isMounted } = this.state;
    const { showDelay } = this.props;

    if (!isMounted || this._showTimeout) {
      return;
    }

    if (this._hideTimeout) {
      clearTimeout(this._hideTimeout);
      this._hideTimeout = null;
    }

    if (showDelay) {
      this._showTimeout = setTimeout(() => {
        this.setState({ shown: true });
      }, showDelay);
    } else {
      this.setState({ shown: true });
    }
  }

  hidePopover() {
    const { isMounted } = this.state;
    const { hideDelay } = this.props;

    if (!isMounted || this._hideTimeout) {
      return;
    }

    if (this._showTimeout) {
      clearTimeout(this._showTimeout);
      this._showTimeout = null;
    }

    if (hideDelay) {
      this._hideTimeout = setTimeout(() => {
        this.setState({ shown: false });
      }, hideDelay);
    } else {
      this.setState({ shown: false });
    }
  }

  updatePosition() {
    if (this.popperScheduleUpdate) {
      this.popperScheduleUpdate();
    }
  }

  _handleClickOutside() { // TODO: fix bug
    // const {
    //   onClickOutside: onClickOutsideCallback,
    //   shown,
    //   disableClickOutsideWhenClosed,
    // } = this.props;
    // if (onClickOutsideCallback && !(disableClickOutsideWhenClosed && !shown)) {
    //   onClickOutsideCallback();
    // }
  }
}

export default PopoverCore;
