/* eslint-disable jsx-a11y/click-events-have-key-events  */
import PropTypes from 'prop-types';
import React from 'react';
import prettySize from 'prettysize';
import { Icon, Segment, List, Header, Grid } from 'semantic-ui-react';
import { getMappedIconWithMime } from '../Utils';

const FilePreview = ({ meta, handleClosePreview }) => (
  <List>
    <Segment>
      <span
        tabIndex="0"
        role="button"
        className="close"
        onClick={handleClosePreview}
        aria-label="Close"
      >
        <span aria-hidden>&times;</span>
      </span>
      <Grid columns="equal">
        <Grid.Column>
          <Icon disabled name={getMappedIconWithMime(meta.type)} size="huge" />
        </Grid.Column>
        <Grid.Column tablet={12} mobile={13} computer={14}>
          <Header size="tiny" className="text-overflow-hidden">
            {meta.name}
            <Header.Subheader>
              File Size: {prettySize(meta.size)}{' '}
            </Header.Subheader>
            <Header.Subheader>File Type: {meta.type} </Header.Subheader>
          </Header>
        </Grid.Column>
      </Grid>
    </Segment>
  </List>
);

FilePreview.propTypes = {
  meta: PropTypes.object.isRequired,
  handleClosePreview: PropTypes.func.isRequired,
};
export default FilePreview;
