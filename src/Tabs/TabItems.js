import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import TabItem from './TabItem';
import styles from './Tabs.module.scss';

class TabItems extends React.PureComponent {
  static displayName = 'TabItems';

  static propTypes = {};

  constructor(props) {
    super(props);

    this.renderItem = this.renderItem.bind(this);
  }

  render() {
    const { items, type, minWidth } = this.props;

    const classes = classNames(styles.itemsContainer, {
      [styles[type]]: true,
    });

    return (
      <ul className={classes} style={{ minWidth }}>
        {items.map((item, index) => this.renderItem(item, index))}
      </ul>
    );
  }

  renderItem(item, index) {
    const { activeId, width, onClick } = this.props;

    return (
      <TabItem
        key={item.id}
        index={index}
        item={item}
        isActive={item.id === activeId}
        width={width}
        onClick={onClick}
      />
    );
  }
}

export default TabItems;
