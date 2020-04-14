import React from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import { ItemTypes } from '../../consts';

const dropSource = {
  beginDrag(props) {
    return {
      item: props.item,
      source: props.source,
    };
  },
};

/**
 * Specifies the props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

const propTypes = {
  // Injected by React DnD:
  disableDragging: PropTypes.bool,
  isDragging: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired, // eslint-disable-line
  source: PropTypes.string.isRequired, // eslint-disable-line
  children: PropTypes.element.isRequired,
  connectDragSource: PropTypes.func.isRequired,
};
const Draggable = (props) => {
  const { isDragging, connectDragSource } = props;
  return props.disableDragging ? (
    <div>{props.children}</div>
  ) : (
    connectDragSource(<div style={{ opacity: isDragging ? 0.5 : 1 }}>{props.children}</div>)
  );
};
Draggable.propTypes = propTypes;
Draggable.defaultProps = {
  disableDragging: false,
};
export default DragSource(ItemTypes.CARD, dropSource, collect)(Draggable);
