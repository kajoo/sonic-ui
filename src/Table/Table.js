import React from 'react';
import PropTypes from 'prop-types';
// import classNames from 'classnames';
import defaultTo from 'lodash/defaultTo';

import TableToolbarContainer from './TableToolbarContainer';
import TableContext from './TableContext';
import TableContent from './TableContent';
import DataTable from './DataTable';
import { BulkSelection } from './BulkSelection';
// import styles from './Table.module.scss';

const hasUnselectablesSymbol = Symbol('hasUnselectables');

class Table extends React.PureComponent {
  static displayName = 'Table';

  static propTypes = {
    ...DataTable.propTypes,
    /** An id to pass to the table */
    id: PropTypes.string,
    /** The width of the fixed table. Can be in percentages or pixels. */
    width: PropTypes.string,
    /** Should we hide the header of the table. */
    hideHeader: PropTypes.bool,
    /** Configuration of the table's columns.<br>
     *  Each column needs to specify:
     *    * `title`: a string or an element to display in the table header for this column
     *    * `render`: a function which will be called for every row in `data` to display this row's value for this column<br>
     *
     *  Each column can also specify these fields:
     *    * `sortable`: Sets whether this field is sortable. If `true` clicking the header will call `onSortClick`
     *    * `sortDescending`: Sets what sort icon to display in the column header. `true` will show an up arrow, `false` will show a down arrow, `undefined' will show no icon
     *    * `infoTooltipProps`: Props object for column header's [tooltip](). Note: `dataHook`, `moveBy` and `children` will not be passed to tooltip.
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
        // important: PropTypes.bool,
      }),
    ).isRequired,
    /** The data to display.<br>
     * For each `row` in `data`, If `row.id` exists then it will be used as the React `key` value for each row, otherwise, the row index will be used.<br>
     * When `showSelection` prop is set, if `row.unselectable` is truthy for a `row` in `data`, no checkbox will be displayed for the row in the selection column.  */
    data: PropTypes.array, // Not performing any shape validation to not hurt performance.
    /** Should the table show the header when data is empty */
    showHeaderWhenEmpty: PropTypes.bool, // TODO
    /** Indicates whether to show a selection column (with checkboxes).<br>
     * To hide the selection checkbox from a specific row, set its `row.unselectable` (in the `data` prop) to `true`. */
    showSelection: PropTypes.bool,
    /** Array of selected row ids.
     *  Ideally, id should be a property on the data row object.
     *  If data objects do not have id property, then the data row's index would be used as an id. */
    selectedIds: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.arrayOf(PropTypes.number),
    ]),
    /** Indicates the total number of selectable items in the table, including those not yet loaded.
     * When `infiniteScroll` and this prop are set and the user does bulk selection ("Select All"), and there are still unloaded items (`hasMore` is 'true`),
     * the table enters an "Infinite Bulk Selection" mode, where newly loaded items get selected by default and `SelectionContext` holds the not-selected items rather than the selected items.
     * In this case, `SelectionContext.infiniteBulkSelected` is `true` and  `SelectionContext.selectedCount` is the value of `totalSelectableCount` minus the count of unselected items. */
    totalSelectableCount: PropTypes.number,
    /** Indicates whether to hide the bulk selection ("Select All") checkbox in the table header when showing the selection column */
    hideBulkSelectionCheckbox: PropTypes.bool,
    /** Indicates the `SelectionContext.toggleAll` behaviour when some rows are selected. `true` means SOME -> NONE, `false` means SOME -> ALL */
    deselectRowsByDefault: PropTypes.bool,
    /** Is selection disabled for the table */
    selectionDisabled: PropTypes.bool,
    /** Called when row selection changes.
     * Receives 2 arguments: `selectedIds` array, and a `change` object ( in this order).
     * `selectedIds` is the updated selected ids.
     * `change` object has a `type` property with the following possible values: 'ALL', 'NONE', 'SINGLE_TOGGLE'.
     * In case of 'SINGLE_TOGGLE' the `change` object will also include an `id` prop with the item's id,
     * and a `value` prop with the new boolean selection state of the item. */
    onSelectionChanged: PropTypes.func,
    /** A flag specifying weather to show a divider after the last row */
    showLastRowDivider: PropTypes.bool,
    /** A class to apply to all table body rows */
    rowClass: PropTypes.string,
    /** Function that returns React component that will be rendered in row details section. Example: `rowDetails={(row, rowNum) => <MyRowDetailsComponent {...row} />}` */
    rowDetails: PropTypes.func,
    /** A string data-hook to apply to all table body rows. or a func which calculates the data-hook for each row  - Signature: `(rowData, rowNum) => string` */
    rowDataHook: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    /** Allows to open multiple row details */
    allowMultiDetailsExpansion: PropTypes.bool,
    /** A callback method to be called on row click. Signature: `onRowClick(rowData, rowNum)` */
    onRowClick: PropTypes.func,
    /** A callback method to be called on row mouse enter. Signature: `onMouseEnterRow(rowData, rowNum)` */
    onMouseEnterRow: PropTypes.func,
    /** A callback method to be called on row mouse leave. Signature: `onMouseLeaveRow(rowData, rowNum)` */
    onMouseLeaveRow: PropTypes.func,
    /**
     * A callback function called on each column title click. Signature `onSortClick(colData, colNum)`
     */
    onSortClick: PropTypes.func,
    /** Any wrapper element that eventually includes <Table.Content/> as a child */
    children: PropTypes.any,
    className: PropTypes.any,
    /** Applied as data-hook HTML attribute that can be used in the tests */
    dataHook: PropTypes.string,
  };

  static defaultProps = {
    ...DataTable.defaultProps,
    width: '100%',
    columns: [],
    data: [],
    showSelection: false,
    selectedIds: [],
    hideBulkSelectionCheckbox: false,
    showLastRowDivider: false,
    children: [<TableContent key="content" />],
  };

  constructor(props) {
    super(props);

    // this._onMouseOver = this._onMouseOver.bind(this);
  }

  render() {
    const {
      data,
      showSelection,
      selectedIds,
      totalSelectableCount,
      deselectRowsByDefault,
      selectionDisabled,
      onSelectionChanged,
      children,
    } = this.props;

    let hasUnselectables = null;
    let allIds = data.map((rowData, rowIndex) =>
      rowData.unselectable
        ? (hasUnselectables = hasUnselectablesSymbol)
        : defaultTo(rowData.id, rowIndex),
    );
    if (hasUnselectables === hasUnselectablesSymbol) {
      allIds = allIds.filter(rowId => rowId !== hasUnselectablesSymbol);
    }

    return (
      <TableContext.Provider value={this.props}>
        {showSelection ? (
          <BulkSelection
            ref={ref => (this.bulkSelection = ref)}
            selectedIds={selectedIds}
            allIds={allIds}
            totalCount={totalSelectableCount}
            deselectRowsByDefault={deselectRowsByDefault}
            disabled={selectionDisabled}
            onSelectionChanged={onSelectionChanged}
          >
            {children}
          </BulkSelection>
        ) : (
          children
        )}
      </TableContext.Provider>
    );
  }
}

Table.ToolbarContainer = TableToolbarContainer;
Table.Content = TableContent;

export default Table;
