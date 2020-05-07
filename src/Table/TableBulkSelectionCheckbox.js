import React from 'react';
import PropTypes from 'prop-types';

import Checkbox from '../Checkbox/Checkbox';
import { BulkSelectionState } from './BulkSelection';
import { BulkSelectionContext } from './BulkSelection/BulkSelectionContext';

export const TableBulkSelectionCheckbox = ({ dataHook, children }) => {
  return (
    <BulkSelectionContext.Consumer>
      {({ bulkSelectionState, toggleAll, disabled, deselectRowsByDefault }) => (
        <Checkbox
          checked={bulkSelectionState === BulkSelectionState.ALL}
          indeterminate={bulkSelectionState === BulkSelectionState.SOME}
          disabled={disabled}
          onChange={() => toggleAll(deselectRowsByDefault)}
          dataHook={dataHook}
        >
          {children}
        </Checkbox>
      )}
    </BulkSelectionContext.Consumer>
  );
};

TableBulkSelectionCheckbox.propTypes = {
  children: PropTypes.any,
  dataHook: PropTypes.string,
};
