import React from 'react';
import renderIf from 'render-if';
import PropTypes from 'prop-types';
import { Card, Row, Col, Skeleton } from 'antd';
import TaskProgress from './tasks/TaskProgress';

const completedTasks = (tasks) => tasks.filter((task) => task.progress.percentage >= 99);
const Uploads = ({ tasks, isLoadingUploads }) => (
  <Card style={{ marginTop: '1rem' }}>
    <Row type="flex" justify="space-between" align="middle" style={{ marginBottom: '1rem' }}>
      <Col>
        <h3>Uploads</h3>
      </Col>
      <Col>
        <strong style={{ color: '#9B9B9B' }}>
          {completedTasks(tasks).length}/{tasks.length} Completed
        </strong>
      </Col>
    </Row>
    <Skeleton loading={isLoadingUploads} avatar active>
      {renderIf(!tasks.length)(
        <Row style={{ marginBottom: '1rem' }}>
          <Card>No any task</Card>
        </Row>,
      )}
      {tasks.map((task) => (
        <Row style={{ marginBottom: '1rem' }} key={task.uuid}>
          <TaskProgress task={task} />
        </Row>
      ))}
    </Skeleton>
  </Card>
);
Uploads.defaultProps = {
  isLoadingUploads: false,
};
Uploads.propTypes = {
  tasks: PropTypes.array.isRequired,
  isLoadingUploads: PropTypes.bool,
};

export default Uploads;
