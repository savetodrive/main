import PropTypes from 'prop-types';
import React from 'react';
import { Header, Progress } from 'semantic-ui-react';
import { limitString } from '../../Utils/index';

const UploadTable = ({ items, handleTaskKill }) => (
  <div>
    <div className="upload-list">
      {items.map((item, index) => (
        <div className="upload-list__item" key={item.uuid} id={item.uuid}>
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={handleTaskKill(item, index)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <div className="upload-list__item__info" name={item.uuid}>
            <a className="upload-list__filename" title={item.name}>
              {limitString(item.name)}
            </a>
            {item.completed === false ? (
              <Header color="red" content="Failed" />
            ) : (
              <Progress
                color="blue"
                percent={item.progress.percentage}
                size="tiny"
              >
                {item.progress.percentage}%
              </Progress>
            )}
            <div className="upload-list__item__row">
              <span className="upload-list__filetype mr-2">{item.type}</span>
              <span className="mr-2">
                <span className="text-muted">Service:</span>
                <strong>{item.serviceLabel}</strong>
              </span>
              <span className="mr-2">
                <span className="text-muted">Speed:</span>
                <strong>{item.progress.speed}</strong>
              </span>
              <span className="mr-2">
                <span className="text-muted">ETA:</span>
                <strong>{item.progress.eta}</strong>
              </span>
            </div>
          </div>
          <div className="upload-list__item__extra">
            <h4 className="upload-list__title">
              <span className="text-muted">Size:</span>
              <span>{item.size}</span>
            </h4>
            <h4 className="upload-list__title">
              <span className="text-muted">Transferred:</span>
              <span>{item.progress.transferred}</span>
            </h4>
            <h4 className="upload-list__title">
              <span className="text-muted">Remaining:</span>
              <span>{item.progress.remaining}</span>
            </h4>
          </div>
        </div>
      ))}
    </div>
  </div>
);
UploadTable.propTypes = {
  items: PropTypes.array.isRequired,
  handleTaskKill: PropTypes.func.isRequired,
};
export default UploadTable;
