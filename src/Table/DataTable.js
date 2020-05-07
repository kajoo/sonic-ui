import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import defaultTo from 'lodash/defaultTo';

import styles from './DataTable.module.scss';

class DataTable extends React.PureComponent {
  static displayName = 'Table.DataTable';

  static propTypes = {
    /** An id to pass to the table */
    id: PropTypes.string,
    /** Configuration of the table's columns.<br>
     *  Each column needs to specify:
     *    * `title`: a string or an element to display in the table header for this column
     *    * `render`: a function which will be called for every row in `data` to display this row's value for this column<br>
     *
     *  Each column can also specify these fields:
     *    * `sortable`: Sets whether this field is sortable. If `true` clicking the header will call `onSortClick`
     *    * `sortDescending`: Sets what sort icon to display in the column header. `true` will show an up arrow, `false` will show a down arrow, `undefined' will show no icon
     *    * `infoTooltipProps`: Props object for column header's tooltip. Note: `dataHook`, `moveBy` and `children` will not be passed to tooltip.
     *    * `style`: Sets the column inline style. Vertical padding cannot be set here, please use table's `rowVerticalPadding` prop
     *    * `align`: Sets the alignment of the column content
     *    * `width`: CSS value to set the width to use for this column. No value means column will try to contain its children, if possible
     *    * `important`: Sets whether font color of the column should be stronger, more dominant
     *    */
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
          .isRequired,
        render: PropTypes.func.isRequired,
        sortable: PropTypes.bool,
        sortDescending: PropTypes.bool,
        // infoTooltipProps: PropTypes.shape(Tooltip.propTypes),
        style: PropTypes.string,
        align: PropTypes.oneOf(['start', 'center', 'end']),
        width: PropTypes.string,
        important: PropTypes.bool,
      }),
    ).isRequired,
    /** The data to display.<br>
     * For each `row` in `data`, If `row.id` exists then it will be used as the React `key` value for each row, otherwise, the row index will be used.<br>
     * When `showSelection` prop is set, if `row.unselectable` is truthy for a `row` in `data`, no checkbox will be displayed for the row in the selection column.  */
    data: PropTypes.array, // Not performing any shape validation to not hurt performance.
    /** Table cell vertical padding. should be 'medium' or 'large'  */
    rowVerticalPadding: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    /** Any wrapper element that eventually includes <Table.Content/> as a child */
    children: PropTypes.any,
    dataHook: PropTypes.string,
  };

  static defaultProps = {
    rowVerticalPadding: 18,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedRows: {},
    };

    this.renderHeader = this.renderHeader.bind(this);
    this.renderHeaderCell = this.renderHeaderCell.bind(this);
    this.renderBody = this.renderBody.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderCell = this.renderCell.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
    this.toggleRowDetails = this.toggleRowDetails.bind(this);
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

    return (
      <div data-hook={dataHook}>
        <table
          id={id}
          style={style}
          className={classNames(styles.table, {
            [styles.showLastRowDivider]: showLastRowDivider,
          })}
        >
          {!hideHeader && this.renderHeader()}
          {this.renderBody(rowsToRender)}
        </table>
      </div>
    );
  }

  renderHeader() {
    return (
      <thead>
        <tr>{this.props.columns.map(this.renderHeaderCell)}</tr>
      </thead>
    );
  }

  renderHeaderCell(column, colNum) {
    const optionalHeaderCellProps = {};

    const classes = classNames(styles.thText, {
      // [styles.sortable]: column.sortable === undefined,
    });
    const align = column.align || 'start';
    const containerClasses = classNames(styles.thContainer, {
      [styles[`${align.charAt(0).toUpperCase() + align.substring(1)}`]]: true,
    });
    const style = {
      width: column.width,
      cursor: column.sortable === undefined ? 'arrow' : 'pointer',
    };

    if (column.sortable) {
      optionalHeaderCellProps.onClick = () =>
        this.props.onSortClick && this.props.onSortClick(column, colNum);
    }

    return (
      <th
        key={colNum}
        className={classes}
        style={style}
        {...optionalHeaderCellProps}
      >
        <div className={containerClasses}>{column.title}</div>
      </th>
    );
  }

  renderBody(rows) {
    return (
      <tbody>
        {rows.map((rowData, index) => this.renderRow(rowData, index))}
      </tbody>
    );
  }

  renderRow(rowData, rowNum) {
    const {
      columns,
      rowClass,
      rowDetails,
      rowDataHook,
      onRowClick,
      onMouseEnterRow,
      onMouseLeaveRow,
    } = this.props;

    const key = defaultTo(rowData.id, rowNum);
    const optionalRowProps = {};

    optionalRowProps.onClick = event => this.onRowClick(rowData, rowNum);
    if (onMouseEnterRow) {
      optionalRowProps.onMouseEnter = event => {
        if (event.isDefaultPrevented()) {
          return;
        }
        onMouseEnterRow(rowData, rowNum);
      };
    }
    if (onMouseLeaveRow) {
      optionalRowProps.onMouseLeave = event => {
        if (event.isDefaultPrevented()) {
          return;
        }
        onMouseLeaveRow(rowData, rowNum);
      };
    }

    if (rowDataHook) {
      if (typeof rowDataHook === 'string') {
        optionalRowProps['data-hook'] = rowDataHook;
      } else {
        optionalRowProps['data-hook'] = rowDataHook(rowData, rowNum);
      }
    }

    const classes = classNames(
      {
        [styles.clickableRow]: !!onRowClick,
        [styles.animatedRow]: !!rowDetails,
      },
      rowClass,
    );

    // TODO: add row details
    const rowsToRender = [
      <tr
        key={key}
        data-table-row="tableRow"
        className={classes}
        {...optionalRowProps}
      >
        {columns.map((column, colNum) =>
          this.renderCell(rowData, column, rowNum, colNum),
        )}
      </tr>,
    ];

    if (rowDetails) {
      rowsToRender.push(
        <tr key={`${key}_details`} className={styles.rowDetails}>
          <td
            className={styles.rowDetailsInner}
            colSpan={columns.length}
            data-hook={`${rowNum}_details`}
          ></td>
        </tr>,
      );
    }

    return rowsToRender;
  }

  renderCell(rowData, column, rowNum, colNum) {
    const { rowVerticalPadding } = this.props;

    const align = column.align || 'start';
    const classes = classNames({
      [styles[`${align.charAt(0).toUpperCase() + align.substring(1)}`]]: true,
    });
    const style = {
      width: column.width,
      paddingTop: rowVerticalPadding + 'px',
      paddingBottom: rowVerticalPadding + 'px',
      ...column.style,
    };

    return (
      <td key={colNum} className={classes} style={style}>
        {column.render && column.render(rowData, rowNum)}
      </td>
    );
  }

  onRowClick(rowData, rowNum) {
    const { onRowClick, rowDetails } = this.props;
    onRowClick && onRowClick(rowData, rowNum);
    rowDetails && this.toggleRowDetails(rowNum);
  }

  toggleRowDetails(selectedRow) {
    let selectedRows = { [selectedRow]: !this.state.selectedRows[selectedRow] };
    if (this.props.allowMultiDetailsExpansion && !this.props.virtualized) {
      selectedRows = Object.assign({}, this.state.selectedRows, {
        [selectedRow]: !this.state.selectedRows[selectedRow],
      });
    }
    this.setState({ selectedRows });
  }
}

export default DataTable;
