import React from 'react';
import PropTypes from 'prop-types';

import PopoverCore from '../PopoverCore';
import { buildChildrenObject } from '../utils/componentGenerator';
import requestAnimationFramePolyfill from '../utils/request-animation-frame';
import styles from './Popover.module.scss';

export { placements } from './constants';
/**
 *  This has been added in order to fix jsdom not having requestAnimation frame
 *  installed. Jest by default has this polyfilled, but mocha fails on it.
 *  Decided with Shlomi to get rid of this on next major version 7, where we will support
 *  only jest.
 */
if (process.env.NODE_ENV === 'test') {
  requestAnimationFramePolyfill.install();
}

const ANIMATION_DURATION = 300;

class Popover extends React.Component {
  static displayName = 'Popover';

  static Element = PopoverCore.Element;
  static Content = PopoverCore.Content;

  static propTypes = {
    ...PopoverCore.propTypes,
    dataHook: PropTypes.string,

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
  };

  static defaultProps = {
    appendTo: 'parent',
    animate: false,
  };

  render() {
    const { dataHook, animate, theme, ...rest } = this.props;

    const timeout = animate
      ? { enter: ANIMATION_DURATION, exit: 0 }
      : undefined;

    return (
      <PopoverCore
        timeout={timeout}
        className={styles.root}
        {...(dataHook ? { 'data-hook': dataHook } : undefined)}
        {...rest}
      />
    );
    // {...style(
    //   'root',
    //   {
    //     theme,
    //   },
    //   this.props,
    // )}
  }
}

export default Popover;
