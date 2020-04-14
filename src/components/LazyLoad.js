/* eslint-disable */
import React from 'react';
import Loadable from 'react-loadable';

function loadableFactory(path) {
  return Loadable({
    loader: () => import(path),
    loading: () => 'Loading'
  });
}

export default function lazyLoad(path) {
  return class LazyLoad extends React.Component {
    render() {
      const Component = loadableFactory('../../guest/pages/Login');
      return <Component />;
    }
  };
}
