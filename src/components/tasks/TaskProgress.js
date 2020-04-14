import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card, Icon, Progress } from 'antd';
import renderIf from 'render-if';
import startCase from 'lodash/fp/startCase';
import format from 'date-fns/format';
import distance_in_words_to_now from 'date-fns/distance_in_words_to_now';

const TaskProgress = ({ task }) => (
  <Card>
    <Row>
      <Col span={23}>
        <strong
          style={{
            width: '95%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'block',
          }}
          title={task.name}
        >
          <a href={task.url} rel="noopener noreferrer" target="_blank">
            {task.name} {`(${task.progress.percentage || 0}%)`}
          </a>
          {renderIf(task.completed)(<Icon type="check-circle" style={{ color: 'green' }} />)}
          {renderIf(task.completed === false)(<Icon type="close-circle" style={{ color: 'red' }} />)}
        </strong>
      </Col>
      {
        // <Col span={1} style={{ textAlign: 'right' }}>
        //   <Icon type="close" style={{ color: '#9B9B9B' }} />
        // </Col>
      }
    </Row>
    <Progress percent={task.progress.percentage || 0} showInfo={false} />
    <small title={`Uploaded ${task.progress.transferred} of ${task.size} to ${startCase(task.service)}`} style={{ color: '#9B9B9B' }}>
      {`Uploaded ${task.progress.transferred} of ${task.size} to ${startCase(task.service)}`}
    </small>
    <br />
    <small style={{ color: '#9B9B9B' }}>
      Speed: {task.progress.speed} ETA: {task.progress.eta}
    </small>
    <br />
    <small style={{ color: '#9B9B9B' }}>
      {' '}
      <i>
        Created {format(task.started_at, 'MM/DD/YYYY h:m A')} ({distance_in_words_to_now(task.started_at)} ago)
        <br />
        Task Type: {task.processType}
      </i>
    </small>
  </Card>
);

TaskProgress.propTypes = {
  task: PropTypes.object.isRequired,
};
export default TaskProgress;
