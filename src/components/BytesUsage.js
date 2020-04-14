import React from 'react';
import PropTypes from 'prop-types';
import { Progress } from 'antd';
import prettySize from 'prettysize';

const usages = (total, consumed) => (consumed / total) * 100; // eslint-disable-line

const status = (per) => {
  if (per < 50) {
    return 'success';
  }
  if (per > 50 && per < 80) {
    return 'normal';
  }
  return 'exception';
};
const BytesUsage = ({ user }) => {
  const total = user.plan ? user.plan.features.bytes_quota : 100;
  let consumed = user.quota ? user.quota.bytesUsed : 0;
  consumed = consumed > total ? total : consumed;
  const usagePer = usages(total, consumed);

  if (!user.plan) return <div />;
  return (
    <div>
      <div
        style={{
          paddingRight: '10px',
          display: 'inline-block',
          boxSizing: 'border-box',
        }}
      >
        {prettySize(consumed)}
      </div>
      <div
        style={{
          width: '60%',
          display: 'inline-block',
          boxSizing: 'border-box',
        }}
      >
        <Progress percent={usagePer} size="medium" status={status(usagePer)} showInfo={false} />
      </div>
      <div
        style={{
          paddingLeft: '10px',
          display: 'inline-block',
          boxSizing: 'border-box',
        }}
      >
        {prettySize(total)}
      </div>
    </div>
  );
};

BytesUsage.propTypes = {
  user: PropTypes.object.isRequired,
};
export default BytesUsage;
