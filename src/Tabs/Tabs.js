import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import TabItems from './TabItems';
import styles from './Tabs.module.scss';

class Tabs extends React.PureComponent {
  static displayName = 'Tabs';

  static propTypes = {
    /** A selected tab id */
    activeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /** An array of tabs
     | propName | propType | isRequired | description |
     |----------|----------|------------|-------------|
     | id | string or number| + | Item id |
     | title | node | + | Tab title |
     | dataHook | string | - | Datahook |
     */
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        title: PropTypes.node,
        dataHook: PropTypes.string,
      }),
    ).isRequired,
    /** One of: '', compact, compactSide, uniformSide, uniformFull */
    type: PropTypes.oneOf([
      '',
      'compact',
      'compactSide',
      'uniformSide',
      'uniformFull',
    ]),
    /** Can be either string or renderable node */
    sideContent: PropTypes.node,
    /** A specific width of a tab (only for uniformSide type) */
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /** A minimum width of the container */
    minWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /** Places a divider on bottom */
    hasDivider: PropTypes.bool,
    /** Click event handler  */
    onClick: PropTypes.func,
    className: PropTypes.string,
    /** Applied as data-hook HTML attribute that can be used in the tests */
    dataHook: PropTypes.string,
  };

  static defaultProps = {
    hasDivider: true,
  };

  render() {
    const { hasDivider, className, dataHook } = this.props;

    const classes = classNames(
      styles.container,
      {
        [styles.hasDivider]: hasDivider,
      },
      className,
    );

    return (
      <div data-hook={dataHook} className={classes}>
        <TabItems {...this.props} />
      </div>
    );
  }
}

export default Tabs;
