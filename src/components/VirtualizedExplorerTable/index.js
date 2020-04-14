import React from 'react';
import prettySize from 'prettysize';
import PropTypes from 'prop-types';
import { FixedSizeList as List } from 'react-window';
import { Row, Avatar, Icon } from 'antd';
import { StyledCol, StyledHeadCol, StyledRow } from './style';
import { getMappedIconWithMime, limitString } from '../../Utils';
import Draggable from '../dnd/Draggable';

// This is very hardcoded virtual table and is not reusable
class VirtualizedExplorerTable extends React.Component {
  renderItemName(item) {
    if (item.format === 'folder') {
      return (
        <div style={{ cursor: 'pointer' }} onDoubleClick={this.props.handleItemSelect(item)} title={item.name}>
          <Avatar style={{ backgroundColor: '#ff450f' }}>
            <Icon type={getMappedIconWithMime(item.format)} />
          </Avatar>
          &nbsp;
          {limitString(item.name, 25)}
        </div>
      );
    }
    return (
      <Draggable disableDragging={this.props.disableDragging} item={item} source={this.props.mover.id}>
        <div style={{ cursor: 'pointer' }} title={item.name}>
          <Avatar style={{ backgroundColor: '#1387ff' }}>
            <Icon type={getMappedIconWithMime(item.format)} />
          </Avatar>
          &nbsp;
          {limitString(item.name, 25)}
        </div>
      </Draggable>
    );
  }
  renderRows() {
    return ({ index, style }) => {
      const item = this.props.items[index];
      return (
        <div style={style}>
          <StyledRow>
            <StyledCol span={12}>{this.renderItemName(item)}</StyledCol>
            <StyledCol span={12}>{item.size ? prettySize(item.size) : '-'}</StyledCol>
          </StyledRow>
        </div>
      );
    };
  }
  render() {
    return (
      <Row>
        <Row>
          <StyledHeadCol span={12}>Title</StyledHeadCol>
          <StyledHeadCol span={12}>Size</StyledHeadCol>
        </Row>
        <List height={500} itemCount={this.props.items.length} itemSize={55}>
          {this.renderRows()}
        </List>
      </Row>
    );
  }
}

VirtualizedExplorerTable.propTypes = {
  items: PropTypes.array.isRequired,
  handleItemSelect: PropTypes.func.isRequired,
  disableDragging: PropTypes.bool.isRequired,
  mover: PropTypes.object.isRequired,
};
export default VirtualizedExplorerTable;
