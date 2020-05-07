import React from 'react';
import PropTypes from 'prop-types';
import PopperJS from 'popper.js';
import classNames from 'classnames';
import onClickOutside from 'react-onclickoutside';
import { Manager, Reference, Popper } from 'react-popper';
import { Portal } from 'react-portal';

import styles from './Popover2.module.scss';
import { createModifiers } from './modifiers';
import {
  buildChildrenObject,
  createComponentThatRendersItsChildren,
} from '../utils/element';
// import {
//   getAppendToElement
// } from './utils/getAppendToElement';

export { placements } from './constants';

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

// We're declaring a wrapper for the clickOutside machanism and not using the
// HOC because of Typings errors.
const ClickOutsideWrapper = onClickOutside(
  class extends React.Component<any, any> {
    handleClickOutside() {
      this.props.handleClickOutside();
    }

    render() {
      return this.props.children;
    }
  },
);

class Popover extends React.Component {
  static displayName = 'Popover';

  static Element = createComponentThatRendersItsChildren('Popover.Element');
  static Content = createComponentThatRendersItsChildren('Popover.Content');

  static propTypes = {
    /** Id */
    id: PropTypes.string,
    /** target element role value */
    role: PropTypes.string,
    /** Is the content shown or not */
    shown: PropTypes.bool,
    /** The location to display the content */
    placement: PropTypes.oneOf(PopperJS.Placement),
    /** Show Delay in ms */
    showDelay: PropTypes.number,
    /** Hide Delay in ms */
    hideDelay: PropTypes.number,
    /** Enables calculations in relation to a dom element */
    appendTo: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
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
    /** Animation timer */
    timeout: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({ enter: PropTypes.number, exit: PropTypes.number }),
    ]),
    /** popover z-index */
    zIndex: PropTypes.number,
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
     * popovers content is set to minnimum width of trigger element,
     * but it can expand up to the value of maxWidth.
     */
    dynamicWidth: PropTypes.bool,
    /** Show show arrow from the content */
    showArrow: PropTypes.bool,
    /** Custom arrow element */
    customArrow: PropTypes.node,
    /** onClick on the component */
    onClick: PropTypes.func,
    /** Provides callback to invoke when clicked outside of the popover */
    onClickOutside: PropTypes.func,
    /** onMouseEnter on the component */
    onMouseEnter: PropTypes.func,
    /** onMouseLeave on the component */
    onMouseLeave: PropTypes.func,
    /** onKeyDown on the target component */
    onKeyDown: PropTypes.func,
    /** Inline style */
    style: PropTypes.object,
    /** custom classname */
    className: PropTypes.string,
    dataHook: PropTypes.string,
  };

  static defaultProps = {
    // flip: true,
    // fixed: false,
    shown: true,
    zIndex: 1000,
    dataHook: 'popover',
  };

  constructor(props) {
    super(props);

    this.state = {
      _isMounted: false,
      shown: props.shown || false,
    };

    this.targetRef = null;
    this.portalNode = null; // TODO:
    this.popperScheduleUpdate = null;

    this._handleClickOutside = this._handleClickOutside.bind(this);
  }

  componentDidMount() {
    console.log('mount');
    this.setState({ isMounted: true });
  }

  componentDidUpdate(prevProps) {
    const { shown } = this.props;

    if (prevProps.shown !== shown) {
      if (shown) {
        this.showPopover();
      } else {
        this.hidePopover();
      }
    }
  }

  render() {
    const {
      id,
      zIndex,
      onMouseEnter,
      onMouseLeave,
      onClick,
      onKeyDown,
      style: inlineStyles,
      children,
      dataHook,
    } = this.props;
    const { isMounted, shown } = this.state;

    const shouldAnimate = shouldAnimatePopover(this.props);
    const shouldRenderPopper = isMounted && (shouldAnimate || shown);
    console.log('render', shouldRenderPopper, isMounted, shouldAnimate, shown);

    const childrenObject = buildChildrenObject(children, {
      Element: null,
      Content: null,
    });

    return (
      <Manager>
        <ClickOutsideWrapper
          handleClickOutside={this._handleClickOutside}
        >
          <div
            id={id}
            className={styles.root}
            style={inlineStyles}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={inlineStyles}
            data-hook={dataHook}
          >
            <Reference innerRef={r => (this.targetRef = r)}>
              {({ ref }) => (
                <div
                  ref={ref}
                  onClick={onClick}
                  onKeyDown={onKeyDown}
                  data-hook="popover-element"
                >
                  {childrenObject.Element}
                </div>
              )}
            </Reference>
            {shouldRenderPopper && this.renderPopper(childrenObject)}
          </div>
        </ClickOutsideWrapper>
      </Manager>
    );
  }

  renderPopper(childrenObject) {
    console.log('renderPopper');
    const popper = this.renderPopperContent();

    return this.portalNode ? (
      <Portal node={this.portalNode}>{popper}</Portal>
    ) : (
      popper
    );
  }

  renderPopperContent(childrenObject) {
    const {
      id,
      role,
      appendTo,
      moveBy,
      placement,
      zIndex,
      fixed,
      flip,
      minWidth,
      maxWidth,
      width,
      dynamicWidth,
      showArrow,
      customArrow,
    } = this.props;
    const shouldAnimate = shouldAnimatePopover(this.props);
    const modifiers = createModifiers({
      minWidth,
      width,
      dynamicWidth,
      shouldAnimate,
      appendTo,
      moveBy,
      placement,
      fixed,
      flip,
      // isTestEnv,
    });

    const popper = (
      <Popper
        placement={placement}
        modifiers={modifiers}
      >
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
              style={{ ...popperStyles, zIndex, maxWidth }}
              data-placement={popperPlacement || placement}
              data-hook="popover-content"
            >
              {showArrow && this.renderArrow(
                arrowProps,
                popperPlacement || placement,
              )}
              <div
                id={id}
                role={role}
              >
                {childrenObject.Content}
              </div>
            </div>
          );
        }}
      </Popper>
    );

    return popper;
  }

  renderArrow(
    arrowProps,
    placement,
  ) {

  }

  _handleClickOutside() {
    const {
      onClickOutside: onClickOutsideCallback,
      shown,
      disableClickOutsideWhenClosed,
    } = this.props;
    if (onClickOutsideCallback && !(disableClickOutsideWhenClosed && !shown)) {
      onClickOutsideCallback();
    }
  }

  showPopover() {
    const { showDelay } = this.props;
    const { isMounted } = this.state;

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
    const { hideDelay } = this.props;
    const { isMounted } = this.state;

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
}

export default Popover;
