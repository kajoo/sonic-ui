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
import ReactModal from 'react-modal';
import classNames from 'classnames';

import styles from './Modal.module.scss';
import { ZIndex } from '../ZIndex';

export const flexPositions = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
};
export const positions = {
  static: 'static',
  relative: 'relative',
  absolute: 'absolute',
  fixed: 'fixed',
  sticky: 'sticky',
};
const CHILDREN_WRAPPER_DIV_ID = 'modal-children-container';

class Modal extends React.Component {
  static displayName = 'Modal';

  static propTypes = {
    /** To specify if modal is open */
    isOpen: PropTypes.bool.isRequired,

    /** z-index of the modal overlay */
    zIndex: PropTypes.number,
    contentLabel: PropTypes.string,
    closeTimeoutMS: PropTypes.number,
    height: PropTypes.string,
    maxHeight: PropTypes.string,
    scrollable: PropTypes.bool,
    scrollableContent: PropTypes.bool,

    horizontalPosition: PropTypes.oneOf(Object.keys(flexPositions)),
    verticalPosition: PropTypes.oneOf(Object.keys(flexPositions)),

    overlayPosition: PropTypes.oneOf(Object.keys(positions)),
    shouldCloseOnOverlayClick: PropTypes.bool,

    onRequestClose: PropTypes.func,
    onAfterOpen: PropTypes.func,

    /** The parent where modal should mount */
    parentSelector: PropTypes.func,

    /**
     * any kids to render, should be some form of input. Input, InputArea & RichTextArea work well
     *
     * `children` can be React node or a function
     *
     * when function, it receives object with:
     * * `setCharactersLeft` - function accepts a number and will display it on top right of `Modal` component
     *
     */
    children: PropTypes.any,

    /**
     * Specify an optional className to be added to your Modal
     */
    className: PropTypes.string,

    /** used for testing */
    dataHook: PropTypes.string,
  };

  static defaultProps = {
    horizontalPosition: 'center',
    verticalPosition: 'center',
    overlayPosition: 'fixed',
    height: '100%',
    maxHeight: 'auto',
    borderRadius: 0,
    shouldCloseOnOverlayClick: false,
    closeTimeoutMS: 500,
    scrollable: true,
    scrollableContent: false,
  };

  constructor(props) {
    super(props);

    this.renderCloseButton = this.renderCloseButton.bind(this);
    this.handleOverlayClick = this.handleOverlayClick.bind(this);
  }

  render() {
    const {
      horizontalPosition,
      verticalPosition,
      overlayPosition,
      height,
      className,
      borderRadius,
      isOpen,
      zIndex,
      scrollable,
      scrollableContent,
      shouldCloseOnOverlayClick,
      shouldDisplayCloseButton,
      contentLabel,
      closeTimeoutMS,
      onAfterOpen,
      onRequestClose,
      children,
      parentSelector,
      dataHook,
      appElement,
    } = this.props;
    let { maxHeight } = this.props;

    const alignItems = flexPositions[verticalPosition];
    const justifyContent = flexPositions[horizontalPosition];

    const modalStyles = {
      overlay: {
        // Overriding defaults
        position: overlayPosition,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: zIndex ? zIndex : ZIndex('Modal'),
        backgroundColor: null, // null disables the property, use css instead
        // Overriding defaults - END
        display: 'flex',
        alignItems,
        justifyContent,
        overflowY: scrollable ? 'auto' : 'hidden',
      },
      content: {
        // Overriding defaults
        border: 'none',
        overflowY: scrollableContent ? 'auto' : 'initial',
        overflowX: scrollableContent ? 'hidden' : 'initial',
        height,
        maxHeight,
        width: '100%',
        WebkitOverflowScrolling: 'touch',
        outline: 'none',
        borderRadius,
        padding: '0px',
        // Overriding defaults - END
        backgroundColor: 'transparent',
        marginBottom: '0px',
        position: 'relative',
      },
    };

    const classes = classNames(styles.modal, className);
    const portalClasses = classNames(styles.portal, {
      [styles.portalNonScrollable]: !scrollable,
    });

    if (appElement) {
      ReactModal.setAppElement(appElement);
    } else {
      ReactModal.setAppElement('body');
    }

    return (
      <div className={classes} data-hook={dataHook}>
        <ReactModal
          isOpen={isOpen}
          className={classes}
          portalClassName={portalClasses}
          bodyOpenClassName={styles.bodyOpen}
          style={modalStyles}
          shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
          contentLabel={contentLabel}
          closeTimeoutMS={closeTimeoutMS}
          parentSelector={parentSelector}
          onAfterOpen={onAfterOpen}
          onRequestClose={onRequestClose}
        >
          {isOpen && shouldDisplayCloseButton && this.renderCloseButton()}
          <div
            id={CHILDREN_WRAPPER_DIV_ID}
            className={styles.childrenContainer}
            onClick={this.handleOverlayClick}
          >
            {children}
          </div>
        </ReactModal>
      </div>
    );
  }

  renderCloseButton() {
    return null;
  }

  handleOverlayClick(event) {
    const { shouldCloseOnOverlayClick, onRequestClose } = this.props;
    if (
      shouldCloseOnOverlayClick &&
      event.target.id === CHILDREN_WRAPPER_DIV_ID
    ) {
      onRequestClose();
    }
  }
}

export default Modal;
