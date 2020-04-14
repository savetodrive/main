import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import prettySize from 'prettysize';
import { Table } from 'antd';
import differenceInMinutes from 'date-fns/difference_in_minutes';
import differenceInSeconds from 'date-fns/difference_in_seconds';
import differenceInHours from 'date-fns/difference_in_hours';
import startCase from 'lodash/fp/startCase';
import format from 'date-fns/format';
import ProtectedPage from './ProtectedPage';
import { fetchActivities as fetchUploads } from '../../api/app';

const columns = [
  {
    title: 'Service',
    key: 'service',
    dataIndex: 'service',
    // prettier-ignore
    render: (text) => ( // eslint-disable-line
      <div>
        <img src={`../images/clouds/${text}.svg`} height="16px" width="16px" alt={text} title={text} />
        {startCase(text)}
      </div>
    ),
  },
  {
    title: 'Filename',
    key: 'filename',
    dataIndex: 'filename',
    // prettier-ignore
    render: (text, record) => ( // eslint-disable-line
      <a href={record.url} rel="noopener" target="_blank">
        {text}
      </a>
    ),
  },
  {
    title: 'Size',
    key: 'size',
    dataIndex: 'size',
  },
  {
    title: 'Type',
    key: 'type',
    dataIndex: 'type',
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
  },
  {
    title: 'Created At',
    key: 'created_at',
    dataIndex: 'created_at',
  },
  {
    title: 'Elapsed time',
    key: 'elapsed_time',
    dataIndex: 'elapsed_time',
  },
];

class Uploads extends ProtectedPage {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      uploads: {
        docs: [],
        total: 0,
        limit: 10,
        page: 1,
        pages: 0,
      },
    };
  }
  getPaginationConfig() {
    const { uploads } = this.state;
    return {
      onChange: (page) => {
        this.fetchActivities({ page });
      },
      pageSize: uploads.limit,
      total: uploads.total,
    };
  }
  fetchActivities(query) {
    this.setState({ loading: true });
    fetchUploads(query)
      .then(({ data }) => {
        // prettier-ignore
        data.docs = data.docs.map((item) => ({ // eslint-disable-line
          id: item._id,
          url: item.url,
          service: item.service,
          filename: item.meta.name,
          size: prettySize(item.meta.size),
          type: item.meta.type,
          status: startCase(item.status || 'Running'),
          created_at: format(item.created_at, 'DD MMM YYYY hh:mm:ss A'),
          elapsed_time: this.getFriendlyElapsedTime(item.created_at, item.end_at),
        }));
        this.setState({
          uploads: data,
        });
      })
      .catch(() => {
        this.setState({
          activities: [],
        });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  getFriendlyElapsedTime(startDate, endDate) {
    if (!endDate) {
      return 'N/A';
    }
    const dih = differenceInHours(endDate, startDate);
    const dim = differenceInMinutes(endDate, startDate);
    if (dih <= 0) {
      if (dim <= 0) {
        return `${differenceInSeconds(endDate, startDate)} second(s)`;
      }
      return `${dim} minute(s)`;
    }

    return `${dih} hour(s)`;
  }
  componentDidMount() {
    setTimeout(() => {
      this.fetchActivities({});
    }, 100);
  }

  isError(activity) {
    return activity.status === 'FAILED' || activity.status === 'STOPPED';
  }

  render() {
    return (
      <Table
        pagination={this.getPaginationConfig()}
        loading={this.state.loading}
        rowKey="id"
        columns={columns}
        dataSource={this.state.uploads.docs}
      />
    );
  }
}

Uploads.propTypes = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.app.user,
});

const mapActionsToProps = () => ({});
export default withRouter(
  connect(
    mapStateToProps,
    mapActionsToProps,
  )(Uploads),
);
