import React from 'react';
import PropTypes from 'prop-types';

import { BulkSelectionContext } from './BulkSelection/BulkSelectionContext';

class TableToolbarContainer extends React.Component {
  render() {
    return (
      <BulkSelectionContext.Consumer>
        {context => this.props.children(context)}
      </BulkSelectionContext.Consumer>
    );
  }
}

export default TableToolbarContainer;
