import React from 'react';
import PropTypes from 'prop-types';
import defaultTo from 'lodash/defaultTo';

import TableContext from './TableContext';
import DataTable from './DataTable';
import Checkbox from '../Checkbox';
import { TableBulkSelectionCheckbox } from './TableBulkSelectionCheckbox';
import { BulkSelectionContext } from './BulkSelection';
// import styles from './TableContent.scss';

export function createColumns({ tableProps, bulkSelectionContext }) {
  const { toggleSelectionById, isSelected, disabled } = bulkSelectionContext;
  const checkboxColumn = {
    title: tableProps.hideBulkSelectionCheckbox ? (
      ''
    ) : (
      <TableBulkSelectionCheckbox dataHook="table-select" />
    ),
    render: (row, rowNum) => {
      const id = defaultTo(row.id, rowNum);
      return row.unselectable ? null : (
        <div>
          <Checkbox
            disabled={disabled}
            checked={isSelected(id)}
            dataHook="row-select"
            onChange={() => toggleSelectionById(id)}
          />
        </div>
      );
    },
    width: '12px',
  };

  return tableProps.showSelection
    ? [checkboxColumn, ...tableProps.columns]
    : tableProps.columns;
}

class TableContent extends React.PureComponent {
  static displayName = 'Table.Content';

  static propTypes = {
    dataHook: PropTypes.string,
  };

  render() {
    return (
      <TableContext.Consumer>
        {tableProps => {
          if (tableProps.showSelection) {
            return (
              <BulkSelectionContext.Consumer>
                {bulkSelectionContext => (
                  <DataTable
                    {...tableProps}
                    isRowSelected={(rowData, rowIndex) =>
                      bulkSelectionContext.isSelected(
                        defaultTo(rowData.id, rowIndex),
                      )
                    }
                    columns={createColumns({
                      tableProps,
                      bulkSelectionContext,
                    })}
                  />
                )}
              </BulkSelectionContext.Consumer>
            );
          }
          return <DataTable {...tableProps} />;
        }}
      </TableContext.Consumer>
    );
  }
}

export default TableContent;
