/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import PopperJS from '@popperjs/core';
import classNames from 'classnames';
import onClickOutside, {
  OnClickOutProps,
  InjectedOnClickOutProps,
} from 'react-onclickoutside';
import { Manager, Reference, Popper } from 'react-popper';
import { CSSTransition } from 'react-transition-group';
import { Portal } from 'react-portal';

import { createModifiers } from './modifiers';
import { getAppendToElement } from './utils/getAppendElement';
import { buildChildrenObject, createComponentThatRendersItsChildren } from '../utils/componentGenerator';
import styles from './Popover.module.scss';

// This is here and not in the test setup because we don't want consumers to need to run it as well
let testId;
const isTestEnv = process.env.NODE_ENV === 'test';

// We're declaring a wrapper for the clickOutside machanism and not using the
// HOC because of Typings errors.
const ClickOutsideWrapper: React.ComponentClass<OnClickOutProps<
  InjectedOnClickOutProps
>> = onClickOutside(
  class extends React.Component<any, any> {
    handleClickOutside() {
      this.props.handleClickOutside && this.props.handleClickOutside();
    }

    render() {
      return this.props.children;
    }
  },
);

const attachClasses = (node: HTMLElement, classnames: string) =>
  node && node.classList.add(...classnames.split(' '));
const detachClasses = (node: HTMLElement, classnames: string) =>
  node && node.classList.remove(...classnames.split(' '));

const shouldAnimatePopover = ({ timeout }) => {
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

class Popover extends React.Component {
  static displayName = 'Popover';

  static propTypes = {
    animate: PropTypes.bool,

    /** The theme of the popover */
    theme: PropTypes.oneOf(['dark', 'light']),

    children: (props, propName) => {
      const childrenArr = React.Children.toArray(props[propName]);
      const childrenObj = buildChildrenObject(childrenArr, {
        Element: null,
        Content: null,
      });

      if (!childrenObj.Element) {
        return new Error(
          'Invalid children provided, <Popover.Element/> must be provided',
        );
      }

      if (!childrenObj.Content) {
        return new Error(
          'Invalid children provided, <Popover.Content/> must be provided',
        );
      }

      return childrenArr.reduce((err, child) => {
        if (
          !err &&
          child.type.displayName !== 'Popover.Element' &&
          child.type.displayName !== 'Popover.Content'
        ) {
          return new Error(
            `Invalid children provided, unknown child <${child.type
              .displayName || child.type}/> supplied`,
          );
        }

        return err;
      }, false);
    },

    dataHook: PropTypes.string,
  };

  static defaultProps = {
    flip: true,
    fixed: false,
    zIndex: 1000,
    //
    appendTo: 'parent',
    animate: false,
    disableClickOutsideWhenClosed: true,
  };

  static Element = createComponentThatRendersItsChildren('Popover.Element');
  static Content = createComponentThatRendersItsChildren('Popover.Content');

  targetRef = null;
  portalNode = null;
  portalClasses;
  appendToNode = null;
  clickOutsideRef = null;
  clickOutsideClass;
  contentHook;

  popperScheduleUpdat = null;

  // Timer instances for the show/hide delays
  _hideTimeout = null;
  _showTimeout = null;

  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      shown: props.shown || false,
    };

    this.showPopover = this.showPopover.bind(this);
    this.hidePopover = this.hidePopover.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    this._onClickOutside = this._onClickOutside.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;

    this.initAppendToNode();
  }

  componentDidUpdate(prevProps) {
    const { shown } = this.props;
    if (this.portalNode) {
      // Re-calculate the portal's styles
      this.portalClasses = classNames(styles.root, this.props.className);

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
    this._isMounted = false;

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
      id,
      onClick,
      onKeyDown,
      onMouseEnter,
      onMouseLeave,
      children,
      className,
      fluid,
      style,
    } = this.props;
    const { shown } = this.state;

    const childrenObject = buildChildrenObject(children, {
      Element: null,
      Content: null,
    });

    const shouldAnimate = shouldAnimatePopover(this.props);
    const shouldRenderPopper = this._isMounted && (shouldAnimate || shown);

    return (
      <Manager>
        <ClickOutsideWrapper
          handleClickOutside={shown ? this._onClickOutside : undefined}
        >
          <div
            id={id}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={classNames(styles.root, {
              [styles.fluid]: fluid,
            }, className)}
            style={style}
          >
            <Reference innerRef={r => (this.targetRef = r)}>
              {({ ref }) => (
                <div
                  ref={ref}
                  onClick={onClick}
                  onKeyDown={onKeyDown}
                  className={styles.popoverElement}
                  data-hook="popover-element"
                >
                  {childrenObject.Element}
                </div>
              )}
            </Reference>
            {shouldRenderPopper && this.renderContent(childrenObject)}
          </div>
        </ClickOutsideWrapper>
      </Manager>
    )
  }

  renderContent(childrenObject) {
    const popper = this.getContentStructure(childrenObject);

    return this.portalNode ? (
      <Portal node={this.portalNode}>{popper}</Portal>
    ) : (
      popper
    )
  }

  getContentStructure(childrenObject) {
    const {
      id,
      role,
      appendTo,
      placement,
      moveBy,
      flip,
      fixed,
      width,
      minWidth,
      maxWidth,
      dynamicWidth,
      zIndex,
      showArrow,
      moveArrowTo,
      customArrow,
      popoverContentClassName,
    } = this.props;
    const shouldAnimate = shouldAnimatePopover(this.props);

    const modifiers = createModifiers({
      appendTo,
      placement,
      moveBy,
      flip,
      fixed,
      width,
      minWidth,
      dynamicWidth,
      shouldAnimate,
      // isTestEnv,
    });
    console.log('modifiers', modifiers);


    const popper = (
      <Popper modifiers={modifiers} placement={placement}>
        {({
          ref,
          style: popperStyle,
          placement: popperPlacement,
          arrowProps,
          scheduleUpdate,
        }) => {
          this.popperScheduleUpdate = scheduleUpdate;

          return (
            <div
              ref={ref}
              className={classNames(styles.popover, this.clickOutsideClass, {
                [styles.withArrow]: showArrow,
                [styles.popoverContent]: !showArrow,
              }, popoverContentClassName)}
              style={{ ...popperStyle, zIndex, maxWidth }}
              data-placement={popperPlacement || placement}
              data-hook="popover-content"
            >
              {showArrow && this.renderArrow(arrowProps, moveArrowTo, popperPlacement || placement, customArrow)}
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
    )

    return popper;
    // return this.wrapWithAnimations(popper);
  }

  wrapWithAnimations(popper) {
    const { timeout } = this.props;
    const { shown } = this.state;

    const shouldAnimate = shouldAnimatePopover(this.props);

    return shouldAnimate ? (
      <CSSTransition
        in={shown}
        timeout={timeout}
        unmountOnExit
      >
        {popper}
      </CSSTransition>
    ) : (
      popper
    )
  }

  renderArrow(arrowProps, moveArrowTo, placement, customArrow) {
    const props = {
      ref: arrowProps.ref,
      key: 'popover-arrow',
      'data-hook': 'popover-arrow',
      style: {
        ...arrowProps.style,
        ...getArrowShift(moveArrowTo, placement),
      },
    };

    if (customArrow) {
      return customArrow(placement, props);
    }

    return <div {...props} className={styles.arrow} />
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

  applyStylesToPortaledNode() {
    const { shown } = this.state;
    const shouldAnimate = shouldAnimatePopover(this.props);

    if (shouldAnimate || shown) {
      attachClasses(this.portalNode, this.portalClasses);
    } else {
      detachClasses(this.portalNode, this.portalClasses);
    }
  }

  showPopover() {
    const { showDelay } = this.props;

    if (!this._isMounted || this._showTimeout) {
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
    const { hideDelay } = this.props;

    if (!this._isMounted || this._hideTimeout) {
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

  _onClickOutside() {
    const {
      onClickOutside: onClickOutsideCallback,
      shown,
      disableClickOutsideWhenClosed,
    } = this.props;
    if (onClickOutsideCallback && !(disableClickOutsideWhenClosed && !shown)) {
      onClickOutsideCallback();
    }
  }
}

export default Popover;
