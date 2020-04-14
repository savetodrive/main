import PropTypes from 'prop-types';
import React from 'react';
import renderIf from 'render-if';
import { Tab, Icon } from 'semantic-ui-react';
import { getMappedIconWithMime } from '../Utils';

const TabItem = ({ task, url }) => (
  <Tab.Pane>
    <div className="tab-pane active" id="google" role="tabpanel">
      <section className="card border-0">
        <div className="card-block p-2">
          <div className="row no-gutters">
            <ul className="list-group w-100">
              <li className="list-group-item sd-form__progress">
                <div className="media w-100">
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <Icon disabled name={getMappedIconWithMime(task.type)} size="huge" />
                  </a>
                  <div className="media-body">
                    <h6 className="mt-0">{ task.name }</h6>
                    <p className="small text-muted mb-2">
                      <span className="text-muted mr-2">File Size: {task.size}</span>
                      <span className="text-muted mr-2">File Type: {task.type}</span>
                      <span className="text-muted">
                        Status:
                        { renderIf(task.completed === false)(<span><Icon name="remove" color="red" /> Failed</span>)}
                        { renderIf(task.completed)(<span><Icon name="checkmark" color="green" /> Completed</span>)}
                        { renderIf(task.completed === null)(<span><Icon name="hourglass four" loading /> Transferring</span>)}
                      </span>
                    </p>
                    <div className="progress">
                      <div
                        className="progress-bar bg-info"
                        role="progressbar"
                        style={{ width: `${task.progress.percentage}%` }}
                        aria-valuenow="0"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      />
                    </div>
                    <p className="small text-muted mb-2">
                      <span className="text-muted mr-2">Transferred: {task.progress.transferred} </span>
                      <span className="text-muted mr-2">Remaining: {task.progress.remaining}</span>
                      <span className="text-muted mr-2">ETA: {task.progress.eta}</span>
                      <span className="text-muted mr-2">Speed: {task.progress.speed}</span>
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </Tab.Pane>
);
TabItem.propTypes = {
  task: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
};

export default TabItem;
