import React from 'react';
import PropTypes from 'prop-types';
import { DragDropManager } from 'dnd-core';
import HTML5Backend from './HTML5Backend';

import { DndProvider } from 'react-dnd';
import { createDragDropManager } from 'dnd-core';

// let defaultManager;
// function getDefaultManager(backend) {
//   if (!defaultManager) {
//     defaultManager = new DragDropManager(backend);
//   }
//   return defaultManager;
// }
let defaultManager;
function getDefaultManager(backend) {
  if (!defaultManager) {
    defaultManager = createDragDropManager(backend);
  }
  return defaultManager;
}

// const DragDropContext = React.createContext({});

// https://github.com/react-dnd/react-dnd/issues/186#issuecomment-110333064
class DragDropContextProvider extends React.Component {
  static displayName = 'DragDropContextProvider';

  static propTypes = {
    children: PropTypes.node,
    backend: PropTypes.func,
  };
  static defaultProps = {
    backend: HTML5Backend,
  };
  // static contextTypes = {
  //   dragDropManager: PropTypes.object,
  // };
  //
  // // static childContextTypes = {
  // //   dragDropManager: PropTypes.object,
  // // };
  // //
  // // getChildContext() {
  // //   // we add `manager` to instance to allow to manipulate d&d in tests
  // //   this.getManager = () =>
  // //     this.context.dragDropManager || getDefaultManager(this.props.backend);
  // //
  // //   return {
  // //     dragDropManager: this.getManager(),
  // //   };
  // // }

  render() {
    // return this.props.children;
    this.getManager = () =>
      this.context.dragDropManager || getDefaultManager(this.props.backend);

    return (
      <DndProvider manager={this.getManager()}>
        {this.props.children}
      </DndProvider>
    );
  }
}

export default DragDropContextProvider;
