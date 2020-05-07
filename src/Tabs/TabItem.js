import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './Tabs.module.scss';

class TabItem extends React.PureComponent {
  static displayName = 'TabItem';

  static propTypes = {};

  constructor(props) {
    super(props);

    this._onClick = this._onClick.bind(this);
  }

  render() {
    const { index, item, isActive, onClick } = this.props;

    const classes = classNames(styles.tab, {
      [styles.isActive]: isActive,
    });

    return (
      <li
        key={item.id}
        onClick={() => onClick(item, index)}
        className={classes}
        data-hook={item.dataHook}
      >
        <span>{item.title}</span>
      </li>
    );
  }

  _onClick() {
    const { index, item, onClick } = this.props;
    item.type !== STEP_TYPES.DISABLED && !item.active && onClick && onClick(item, index);
  }
}

export default TabItem;
