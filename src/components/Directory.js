import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'auto-bind';
import { Card, Breadcrumb, Spin } from 'antd';
import Droppable from './dnd/Droppable';
import VirtualizedExplorerTable from './VirtualizedExplorerTable';

// const mockData = [
//   {
//     name: 'Taarak Mehta Ka Ooltah Chashmah 2000 Ep.(Stop Posting Off Topic Sh*t in Group Morons)',
//     id: '0B53lSFxSnKipdllxYVNpbVFXYVk',
//     format: 'folder',
//     type: '.(Stop Posting Off Topic Sh*t in Group Morons)'
//   },
//   {
//     name: 'Collection',
//     id: '0B8bPNWM1pkErRWFIbkQ5dE5qOUU',
//     format: 'folder',
//     type: ''
//   },
//   {
//     name: 'cv',
//     id: '1Or4fUaRBmkimV-dcz4-ynsV6VViEc_MN',
//     format: 'folder',
//     type: ''
//   },
//   {
//     name: 'Codes.zip',
//     id: '0B8bPNWM1pkErWHlCREtSZlhob1U',
//     format: 'folder',
//     type: '.zip'
//   },
//   {
//     name: 'Refactoring to Collections – Complete Reference Package',
//     id: '0B33wSRJF82XLVmFHdlRNb1BJSDA',
//     format: 'folder',
//     type: ''
//   },
//   {
//     name: 'Ballloon',
//     id: '0B8bPNWM1pkErNXFQM1FLN0J4bDg',
//     format: 'folder',
//     type: ''
//   },
//   {
//     name: 'Tutorials',
//     id: '0B8bPNWM1pkEranF0a1M2azkzZ3M',
//     format: 'folder',
//     type: ''
//   },
//   {
//     name: 'NetBeansProjects',
//     id: '0B8bPNWM1pkErT2hzUm9MSkFvTWc',
//     format: 'folder',
//     type: ''
//   },
//   {
//     name: 'workspace',
//     id: '0B8bPNWM1pkErR3FsWTVoV3pDbkU',
//     format: 'folder',
//     type: ''
//   },
//   {
//     name: 'web',
//     id: '0B8bPNWM1pkErUXhzeUNyRTNCNTg',
//     format: 'folder',
//     type: ''
//   },
//   {
//     name: 'SaveToDrive Pricing',
//     id: '1FkWaII5NYis1k4mqRz1H2kQcn1I8pkBB0eAxXo0F6-s',
//     format: 'file',
//     type: ''
//   },
//   {
//     name: 'SaveToDrive Credentials',
//     id: '1oegLEm19BxJCfxpgG5GuvShuaqb3Q3pypdR-edaxxb0',
//     format: 'file',
//     type: ''
//   },
//   {
//     name: 'Samundra Khatri_Resume.pdf',
//     size: '106486',
//     id: '15S9zdV7Lp4uI1WXIHl0nR4jVgbTArRXI',
//     format: 'file',
//     type: '.pdf'
//   },
//   {
//     name: 'Edit fiddle - JSFiddle.png',
//     size: '69927',
//     id: '1mOZ8g3J9vB_lqRCy_SWhuISUH1XERx_f',
//     format: 'file',
//     type: '.png'
//   },
//   {
//     name: 'Gitlab answers',
//     id: '1J-xTi4SJ-nWzG_sqbEFP2sLSOQSWFeiR3LDKPs7C6ds',
//     format: 'file',
//     type: ''
//   },
//   {
//     name: 'sw',
//     id: '13TkxnW_jF7CpiJjz0IdgZ8XxiwUhzwXUFoHQYqEnITg',
//     format: 'file',
//     type: ''
//   },
//   {
//     name: 'service-worker.pdf',
//     size: '26911990',
//     id: '1XnQoucU9x0lTlK-E1h0fWRxJwIl8F8nM',
//     format: 'file',
//     type: '.pdf'
//   },
//   {
//     name: 'Untitled document',
//     id: '1W_WX5xCuZ6kIu9P8nOmzI1Au8I7NLM8ByWaopkl86dU',
//     format: 'file',
//     type: ''
//   },
//   {
//     name: 'Time slot for LIM',
//     id: '1TsyrETYw7v9DvS5fVefh6W2hCj2LXUqlYkyWbPhTS-c',
//     format: 'file',
//     type: ''
//   },
//   {
//     name: 'big_buck_bunny_720p_2mb.mp4',
//     size: '2097841',
//     id: '1abEGp1sVny4snlmXjrTXYpvzgIuRQH6e',
//     format: 'file',
//     type: '.mp4'
//   },
//   {
//     name: 'CV_Samundra Kc.pdf',
//     size: '110843',
//     id: '1qcCazI5VRYOvzQFrl0rsVr_fvRFopfLS',
//     format: 'file',
//     type: '.pdf'
//   },
//   {
//     name: 'big_buck_bunny_720p_2mb.mp4',
//     size: '2097841',
//     id: '1Yrmz3PbpIXdz0v2YTNQs1jP7rZhhqNJt',
//     format: 'file',
//     type: '.mp4'
//   },
//   {
//     name: 'big_buck_bunny_720p_2mb.mp4',
//     size: '2097841',
//     id: '1O-mBCKTxQOn73-cblNNvJ8VX8KxqxbkO',
//     format: 'file',
//     type: '.mp4'
//   },
//   {
//     name: 'Samundra_Khatri.pdf',
//     size: '114032',
//     id: '1VhCw9VLpHEnwl88MWMRI6TEgBeYM_BNj',
//     format: 'file',
//     type: '.pdf'
//   }
// ];
class Directory extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = {};
  }

  render() {
    const { mover } = this.props;
    return (
      <Card>
        <Spin spinning={this.props.loading}>
          {mover.connection &&
            mover.connection._id && (
              <Breadcrumb>
                {mover.tree.concat([mover.activeFolder]).map((item) => (
                  <Breadcrumb.Item key={item.id} style={{ cursor: 'pointer' }} onClick={this.props.handleItemSelect(item)}>
                    {item.name}
                  </Breadcrumb.Item>
                ))}
              </Breadcrumb>
            )}
          <Droppable
            source={mover.id}
            handleClone={this.props.handleClone}
            onOver={() => (
              <div
                style={{
                  fontSize: '20px',
                  fontStyle: 'italic',
                  zIndex: '1000',
                  position: 'absolute',
                  left: '40%',
                  top: '40%',
                }}
              >
                Drop Here
              </div>
            )}
          >
            <div>
              <VirtualizedExplorerTable
                items={mover.list}
                handleItemSelect={this.props.handleItemSelect}
                mover={this.props.mover}
                disableDragging={this.props.disableDragging}
              />
            </div>
          </Droppable>
        </Spin>
      </Card>
    );
  }
}
/* <Table pagination={false} rowKey="id" columns={this.getColumns()} dataSource={mover.list} scroll={{ y: 500 }} /> */

Directory.defaultProps = {
  mover: {},
  disableDragging: false,
  loading: false,
};
Directory.propTypes = {
  mover: PropTypes.object,
  disableDragging: PropTypes.bool,
  handleItemSelect: PropTypes.func.isRequired,
  handleClone: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};
export default Directory;
