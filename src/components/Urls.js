/* eslint-disable */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Input, Button, AutoComplete } from 'antd';
import flatten from 'lodash/fp/flatten';

const ds = (uploads) => flatten(uploads.map((u) => u.urls.map((i) => i.value)));
const Urls = ({ urls, handleChange, handleRemove, uploads }) => {
  return (
    <div>
      {urls.map((url) => (
        <Fragment key={url.id}>
          <Input
            onChange={handleChange(url.id)}
            placeholder="Enter url here"
            value={url.value}
            addonAfter={<Button onClick={handleRemove(url.id)} shape="circle" icon="delete" size="default" />}
          />
        </Fragment>
      ))}
    </div>
  );
};
Urls.propTypes = {
  urls: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  uploads: PropTypes.array.isRequired
};
export default Urls;
// onClick={handleRemove(url.id)}
{
  /* <Input onChange={handleChange(url.id)} placeholder="Enter url here" value={url.value} /> */
}
{
  /* <AutoComplete
dataSource={ds(uploads)}
placeholder="Enter url here"
value={url.value}
onChange={(value) => handleChange(url.id)({ target: { value } })}
onSelect={(value) => handleChange(url.id)({ target: { value } })}
/> */
}
