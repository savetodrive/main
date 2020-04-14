import React from 'react';

const withSandbox = (Component) =>
  class SandBox extends React.Component {
    componentWillUpdate(nextProps) {
      console.log(nextProps);
    }
    render() {
      return <Component {...this.props} />;
    }
  };
export default withSandbox;
