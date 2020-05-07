import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import defaultTo from 'lodash/defaultTo';

import TableContext from './TableContext';
// import Checkbox from '../Checkbox';
import styles from './ToolbarContainer.module.scss';

class ToolbarContainer extends React.PureComponent {
  static displayName = 'Table.ToolbarContainer';

  static propTypes = {
    /** Any wrapper element that eventually includes <Table.Content/> as a child */
    children: PropTypes.any,
    dataHook: PropTypes.string,
  };

  static defaultProps = {
    rowVerticalPadding: 18,
  };

  constructor(props) {
    super(props);

    // this.onRowClick = this.onRowClick.bind(this);
  }

  render() {
    const {
      id,
      width,
      hideHeader,
      data,
      showSelection,
      showLastRowDivider,
      dataHook,
    } = this.props;

    // TODO: adding infinite needs slicing
    const rowsToRender = data;
    const style = { width };

    return <div data-hook={dataHook}></div>;
  }
}

export default ToolbarContainer;
