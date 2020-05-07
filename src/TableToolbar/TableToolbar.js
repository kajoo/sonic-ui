import React from 'react';
import PropTypes from 'prop-types';

import { Title } from './Title';
import { ItemGroup } from './ItemGroup';
import { Item } from './Item';
import { Label } from './Label';
import { Divider } from './Divider';
import { SelectedCount } from './SelectedCount';
import styles from './TableToolbar.module.scss';

class TableToolbar extends React.Component {
  static displayName = 'TableToolbar';

  static propTypes = {
    children: PropTypes.any,
    dataHook: PropTypes.string,
  };

  render() {
    const { children, dataHook } = this.props;

    return (
      <div className={styles.toolbar} data-hook={dataHook}>
        {children}
      </div>
    );
  }
}

TableToolbar.Title = Title;
TableToolbar.ItemGroup = ItemGroup;
TableToolbar.Item = Item;
TableToolbar.Label = Label;
TableToolbar.Divider = Divider;
TableToolbar.SelectedCount = SelectedCount;

export default TableToolbar;
