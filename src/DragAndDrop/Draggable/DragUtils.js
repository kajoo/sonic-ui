import { findDOMNode } from 'react-dom';

export const dragCoordinates = ({ monitor, component }) => {
  const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

  // Get vertical middle
  const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
  const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

  // Determine mouse position
  const clientOffset = monitor.getClientOffset();

  // Get pixels to the top
  const hoverClientY = clientOffset.y - hoverBoundingRect.top;
  const hoverClientX = clientOffset.x - hoverBoundingRect.left;

  return {
    hoverMiddleY,
    clientOffset,
    hoverClientY,
    hoverMiddleX,
    hoverClientX,
  };
};
