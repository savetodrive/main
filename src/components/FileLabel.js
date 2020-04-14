import PropTypes from 'prop-types';
import React from 'react';
import { Dropdown, Divider, Label } from 'semantic-ui-react';
import { getUniqKey } from '../Utils/index';

const FileLabel = ({
  isTag,
  tags,
  options,
  handleChange,
  handleTagSearch,
  handleRemoveTag,
}) => (
  <div>
    {tags.length ? (
      <div className="sd-badges">
        <Label pointing="right">Tags</Label>
        {tags.map((tag, index) => (
          <span className="badge badge-default" key={getUniqKey()}>
            {tag}
            <button
              onClick={handleRemoveTag(tag, index)}
              type="button"
              className="close"
              aria-label="Close"
            >
              <span>&times;</span>
            </button>
          </span>
        ))}
        <Divider />
      </div>
    ) : (
      ''
    )}
    {isTag ? (
      <div className="form-group mt-2">
        <Dropdown
          className="form-control filename-label-dropdown"
          placeholder="Enter label"
          search
          selection
          fluid
          value={[]}
          multiple
          allowAdditions
          floating
          options={options}
          onChange={handleChange}
          onSearchChange={handleTagSearch}
        />
      </div>
    ) : (
      ''
    )}
  </div>
);
FileLabel.propTypes = {
  isTag: PropTypes.bool.isRequired,
  tags: PropTypes.array.isRequired,
  options: PropTypes.array,
  handleChange: PropTypes.func.isRequired,
  handleRemoveTag: PropTypes.func.isRequired,
  handleTagSearch: PropTypes.func.isRequired,
};
FileLabel.defaultProps = {
  options: [],
};
export default FileLabel;
